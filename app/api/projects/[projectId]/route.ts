import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { jsonError, parseJsonBody, requireUserId } from "@/lib/api/http";

interface UpdateProjectBody {
  id?: string;
  name?: string;
}

interface RouteParams {
  projectId: string;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<RouteParams> },
) {
  const userId = await requireUserId();

  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  const { projectId } = await context.params;
  const body = await parseJsonBody<UpdateProjectBody>(request);
  const nextProjectId = body?.id?.trim();
  const name = body?.name?.trim();

  if (!nextProjectId) {
    return jsonError("Project id is required", 400);
  }

  if (!name) {
    return jsonError("Project name is required", 400);
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  });

  if (!project) {
    return jsonError("Project not found", 404);
  }

  if (project.ownerId !== userId) {
    return jsonError("Forbidden", 403);
  }

  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { id: nextProjectId, name },
    });

    return Response.json({ project: updatedProject });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return jsonError("Project id already exists", 409);
    }

    throw error;
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<RouteParams> },
) {
  const userId = await requireUserId();

  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  const { projectId } = await context.params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  });

  if (!project) {
    return jsonError("Project not found", 404);
  }

  if (project.ownerId !== userId) {
    return jsonError("Forbidden", 403);
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return new Response(null, { status: 204 });
}
