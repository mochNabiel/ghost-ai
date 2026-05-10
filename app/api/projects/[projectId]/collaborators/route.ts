import { Prisma } from "@/app/generated/prisma/client";
import { clerkClient } from "@clerk/nextjs/server";

import { jsonError, parseJsonBody, requireUserId } from "@/lib/api/http";
import { getCurrentIdentity } from "@/lib/project-access";
import prisma from "@/lib/prisma";

interface CollaboratorMutationBody {
  email?: string;
}

interface RouteParams {
  projectId: string;
}

interface EnrichedPerson {
  avatarUrl: string | null;
  displayName: string | null;
  email: string;
  id: string;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function getDisplayName(user: {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}) {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return fullName || user.username || null;
}

async function enrichCollaborators(collaborators: Array<{ email: string; id: string }>) {
  const emails = collaborators.map((collaborator) => collaborator.email);
  const usersByEmail = new Map<
    string,
    { avatarUrl: string | null; displayName: string | null }
  >();

  if (emails.length > 0) {
    const client = await clerkClient();
    const users = await client.users.getUserList({
      emailAddress: emails,
      limit: emails.length,
    });

    for (const user of users.data) {
      for (const emailAddress of user.emailAddresses) {
        usersByEmail.set(normalizeEmail(emailAddress.emailAddress), {
          avatarUrl: user.imageUrl ?? null,
          displayName: getDisplayName(user),
        });
      }
    }
  }

  return collaborators.map((collaborator): EnrichedPerson => {
    const enriched = usersByEmail.get(normalizeEmail(collaborator.email));
    return {
      avatarUrl: enriched?.avatarUrl ?? null,
      displayName: enriched?.displayName ?? null,
      email: collaborator.email,
      id: collaborator.id,
    };
  });
}

async function enrichOwner(ownerId: string): Promise<EnrichedPerson | null> {
  const client = await clerkClient();
  const user = await client.users.getUser(ownerId);

  const primaryEmail = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) {
    return null;
  }

  return {
    avatarUrl: user.imageUrl ?? null,
    displayName: getDisplayName(user),
    email: primaryEmail,
    id: ownerId,
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<RouteParams> },
) {
  const userId = await requireUserId();
  const identity = await getCurrentIdentity();

  if (!userId || !identity) {
    return jsonError("Unauthorized", 401);
  }

  const { projectId } = await context.params;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      ownerId: true,
      collaborators: {
        orderBy: { createdAt: "asc" },
        select: { email: true, id: true },
      },
    },
  });

  if (!project) {
    return jsonError("Project not found", 404);
  }

  const isOwner = project.ownerId === identity.userId;
  const isCollaborator = project.collaborators.some(
    (collaborator) =>
      normalizeEmail(collaborator.email) === normalizeEmail(identity.primaryEmail ?? ""),
  );

  if (!isOwner && !isCollaborator) {
    return jsonError("Forbidden", 403);
  }

  const collaborators = await enrichCollaborators(project.collaborators);
  let owner: EnrichedPerson | null = null;

  try {
    owner = await enrichOwner(project.ownerId);
  } catch {
    owner = {
      avatarUrl: null,
      displayName: isOwner ? "You" : "Project Owner",
      email: isOwner ? identity.primaryEmail ?? "No primary email" : "Owner profile unavailable",
      id: project.ownerId,
    };
  }

  return Response.json({
    collaborators,
    owner,
    role: isOwner ? "owner" : "collaborator",
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const userId = await requireUserId();

  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  const { projectId } = await context.params;
  const body = await parseJsonBody<CollaboratorMutationBody>(request);
  const email = body?.email?.trim();

  if (!email) {
    return jsonError("Collaborator email is required", 400);
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) {
    return jsonError("Project not found", 404);
  }

  if (project.ownerId !== userId) {
    return jsonError("Forbidden", 403);
  }

  const client = await clerkClient();
  const existingUsers = await client.users.getUserList({
    emailAddress: [email],
    limit: 1,
  });

  if (existingUsers.data.length === 0) {
    return jsonError("Email is not registered in this app.", 400);
  }

  try {
    const collaborator = await prisma.projectCollaborator.create({
      data: {
        email,
        projectId,
      },
      select: {
        email: true,
        id: true,
      },
    });

    const [enriched] = await enrichCollaborators([collaborator]);

    return Response.json({ collaborator: enriched }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return jsonError("Collaborator already invited", 409);
    }

    throw error;
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const userId = await requireUserId();

  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  const { projectId } = await context.params;
  const body = await parseJsonBody<CollaboratorMutationBody>(request);
  const email = body?.email?.trim();

  if (!email) {
    return jsonError("Collaborator email is required", 400);
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) {
    return jsonError("Project not found", 404);
  }

  if (project.ownerId !== userId) {
    return jsonError("Forbidden", 403);
  }

  const deleted = await prisma.projectCollaborator.deleteMany({
    where: {
      email: { equals: email, mode: "insensitive" },
      projectId,
    },
  });

  if (deleted.count === 0) {
    return jsonError("Collaborator not found", 404);
  }

  return new Response(null, { status: 204 });
}
