"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { EditorHome } from "@/components/editor/editor-home";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { ProjectListItem } from "@/lib/project-data";

function getEditorWorkspacePath(projectId: string) {
  return `/editor/${encodeURIComponent(projectId)}`;
}

interface EditorShellProps {
  activeProjectId?: string;
  ownedProjects: ProjectListItem[];
  sharedProjects: ProjectListItem[];
}

export function EditorShell({ activeProjectId, ownedProjects, sharedProjects }: EditorShellProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const projectActions = useProjectActions({ activeProjectId });

  return (
    <div className="relative h-screen flex flex-col overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
      />
      <main className="relative flex min-h-0 flex-1 gap-3 p-3">
        <ProjectSidebar
          activeProjectId={activeProjectId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={projectActions.openCreateDialog}
          onDeleteProject={projectActions.openDeleteDialog}
          onOpenProject={(projectId) => router.push(getEditorWorkspacePath(projectId))}
          onRenameProject={projectActions.openRenameDialog}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          variant="docked"
        />
        <section className="min-h-0 flex-1">
          <EditorHome onCreateProject={projectActions.openCreateDialog} />
        </section>
      </main>
      <ProjectDialogs
        activeDialog={projectActions.activeDialog}
        isLoading={projectActions.isLoading}
        onClose={projectActions.closeDialog}
        onCreate={projectActions.submitCreateProject}
        onDelete={projectActions.submitDeleteProject}
        onRename={projectActions.submitRenameProject}
        projectName={projectActions.projectName}
        setProjectName={projectActions.setProjectName}
        roomIdPreview={projectActions.roomIdPreview}
      />
    </div>
  );
}
