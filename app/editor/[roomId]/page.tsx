import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { EditorWorkspaceShell } from "@/components/editor/editor-workspace-shell";
import { getProjectListsForCurrentUser } from "@/lib/project-data";
import { getProjectForUserAccess } from "@/lib/project-access";

interface EditorWorkspacePageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function EditorWorkspacePage({ params }: EditorWorkspacePageProps) {
  const { roomId } = await params;
  const { identity, project } = await getProjectForUserAccess(roomId);

  if (!identity) {
    redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in");
  }

  if (!project) {
    return <AccessDenied />;
  }

  const { ownedProjects, sharedProjects } = await getProjectListsForCurrentUser();

  return (
    <EditorWorkspaceShell
      ownedProjects={ownedProjects}
      projectName={project.name}
      roomId={roomId}
      sharedProjects={sharedProjects}
    />
  );
}
