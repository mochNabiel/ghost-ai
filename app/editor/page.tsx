import { EditorShell } from "@/components/editor/editor-shell";
import { getProjectListsForCurrentUser } from "@/lib/project-data";

export default async function EditorPage() {
  const { ownedProjects, sharedProjects } = await getProjectListsForCurrentUser();

  return <EditorShell ownedProjects={ownedProjects} sharedProjects={sharedProjects} />;
}
