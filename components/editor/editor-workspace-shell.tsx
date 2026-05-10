"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Share2,
  Sparkles,
} from "lucide-react"
import { UserButton } from "@clerk/nextjs"

import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { WorkspaceAiSidebarPlaceholder } from "@/components/editor/workspace-ai-sidebar-placeholder"
import { WorkspaceCanvasPlaceholder } from "@/components/editor/workspace-canvas-placeholder"
import { Button } from "@/components/ui/button"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectListItem } from "@/lib/project-data"

function getEditorWorkspacePath(projectId: string) {
  return `/editor/${encodeURIComponent(projectId)}`
}

interface EditorWorkspaceShellProps {
  ownedProjects: ProjectListItem[]
  projectName: string
  roomId: string
  sharedProjects: ProjectListItem[]
}

export function EditorWorkspaceShell({
  ownedProjects,
  projectName,
  roomId,
  sharedProjects,
}: EditorWorkspaceShellProps) {
  const router = useRouter()
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const projectActions = useProjectActions({ activeProjectId: roomId })

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-base">
      <header className="flex h-14 items-center justify-between border-b border-surface-border bg-surface px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={
              isSidebarOpen ? "Close project sidebar" : "Open project sidebar"
            }
            onClick={() => setIsSidebarOpen((current) => !current)}
            className="text-copy-secondary hover:text-copy-primary"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </Button>
          <span className="truncate text-sm font-medium text-copy-primary">
            {projectName}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <Button variant="outline" size="sm">
            <Share2 data-icon="inline-start" />
            Share
          </Button>
          <Button
            variant={isAiSidebarOpen ? "default" : "outline"}
            size="sm"
            aria-label={
              isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"
            }
            onClick={() => setIsAiSidebarOpen((current) => !current)}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI
          </Button>
          <UserButton />
        </div>
      </header>

      <main className="relative flex min-h-0 flex-1 gap-3 p-3">
        <ProjectSidebar
          activeProjectId={roomId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={projectActions.openCreateDialog}
          onDeleteProject={projectActions.openDeleteDialog}
          onOpenProject={(projectId) =>
            router.push(getEditorWorkspacePath(projectId))
          }
          onRenameProject={projectActions.openRenameDialog}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          variant="docked"
        />

        <WorkspaceCanvasPlaceholder projectName={projectName} />

        <WorkspaceAiSidebarPlaceholder isOpen={isAiSidebarOpen} />
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
  )
}
