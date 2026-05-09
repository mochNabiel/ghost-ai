"use client";

import { useState } from "react";

import { EditorHome } from "@/components/editor/editor-home";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";

export function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const projectDialogs = useProjectDialogs();

  return (
    <div className="relative h-screen flex flex-col overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
      />
      <main className="relative flex-1">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={projectDialogs.openCreateDialog}
          onDeleteProject={projectDialogs.openDeleteDialog}
          onRenameProject={projectDialogs.openRenameDialog}
          ownedProjects={projectDialogs.ownedProjects}
          sharedProjects={projectDialogs.sharedProjects}
        />
        <section className="h-full bg-base">
          <EditorHome onCreateProject={projectDialogs.openCreateDialog} />
        </section>
      </main>
      <ProjectDialogs
        activeDialog={projectDialogs.activeDialog}
        isLoading={projectDialogs.isLoading}
        onClose={projectDialogs.closeDialog}
        onCreate={projectDialogs.submitCreateProject}
        onDelete={projectDialogs.submitDeleteProject}
        onRename={projectDialogs.submitRenameProject}
        projectName={projectDialogs.projectName}
        setProjectName={projectDialogs.setProjectName}
        slugPreview={projectDialogs.slugPreview}
      />
    </div>
  );
}
