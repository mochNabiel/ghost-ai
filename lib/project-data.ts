import { currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export interface ProjectListItem {
  id: string;
  name: string;
}

export interface ProjectLists {
  ownedProjects: ProjectListItem[];
  sharedProjects: ProjectListItem[];
}

export async function getProjectListsForCurrentUser(): Promise<ProjectLists> {
  const user = await currentUser();

  if (!user) {
    return { ownedProjects: [], sharedProjects: [] };
  }

  const primaryEmail = user.primaryEmailAddress?.emailAddress;
  const ownerId = user.id;

  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId },
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    }),
    primaryEmail
      ? prisma.project.findMany({
          where: {
            ownerId: { not: ownerId },
            collaborators: {
              some: {
                email: { equals: primaryEmail, mode: "insensitive" },
              },
            },
          },
          select: { id: true, name: true },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  return { ownedProjects, sharedProjects };
}
