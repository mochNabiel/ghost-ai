import { currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export interface CurrentIdentity {
  primaryEmail: string | null;
  userId: string;
}

export async function getCurrentIdentity(): Promise<CurrentIdentity | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return {
    primaryEmail: user.primaryEmailAddress?.emailAddress ?? null,
    userId: user.id,
  };
}

export async function getProjectForUserAccess(roomId: string) {
  const identity = await getCurrentIdentity();

  if (!identity) {
    return { identity: null, project: null };
  }

  const accessConditions = [{ ownerId: identity.userId }] as Array<
    | { ownerId: string }
    | {
        collaborators: {
          some: {
            email: {
              equals: string;
              mode: "insensitive";
            };
          };
        };
      }
  >;

  if (identity.primaryEmail) {
    accessConditions.push({
      collaborators: {
        some: {
          email: { equals: identity.primaryEmail, mode: "insensitive" },
        },
      },
    });
  }

  const project = await prisma.project.findFirst({
    where: {
      id: roomId,
      OR: accessConditions,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return { identity, project };
}
