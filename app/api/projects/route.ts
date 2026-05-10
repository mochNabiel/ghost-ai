import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { jsonError, parseJsonBody, requireUserId } from "@/lib/api/http";

interface CreateProjectBody {
  id?: string;
  name?: string;
}

export async function GET() {
  const userId = await requireUserId();

  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ projects });
}

export async function POST(request: Request) {
  const userId = await requireUserId();

  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  const body = await parseJsonBody<CreateProjectBody>(request);
  const id = body?.id?.trim();
  const name =
    typeof body?.name === "string" && body.name.trim().length > 0
      ? body.name.trim()
      : "Untitled Project";

  if (!id) {
    return jsonError("Project id is required", 400);
  }

  try {
    const project = await prisma.project.create({
      data: {
        id,
        ownerId: userId,
        name,
      },
    });

    return Response.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return jsonError("Project id already exists", 409);
    }

    throw error;
  }
}
