import { EditorShell } from "@/components/editor/editor-shell";
import { getProjectListsForCurrentUser } from "@/lib/project-data";

interface EditorWorkspacePageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function EditorWorkspacePage({ params }: EditorWorkspacePageProps) {
  const { projectId } = await params;
  const { ownedProjects, sharedProjects } = await getProjectListsForCurrentUser();

  return (
    <EditorShell
      activeProjectId={projectId}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  );
}
