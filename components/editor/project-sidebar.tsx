"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MockProject } from "@/hooks/use-project-dialogs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: () => void;
  onDeleteProject: (project: MockProject) => void;
  onRenameProject: (project: MockProject) => void;
  ownedProjects: MockProject[];
  sharedProjects: MockProject[];
}

interface ProjectListProps {
  emptyText: string;
  onDeleteProject: (project: MockProject) => void;
  onRenameProject: (project: MockProject) => void;
  projects: MockProject[];
}

function ProjectList({
  emptyText,
  onDeleteProject,
  onRenameProject,
  projects,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-surface-border bg-subtle p-6">
        <p className="text-sm text-copy-muted">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className="flex min-h-12 items-center gap-2 rounded-xl border border-surface-border bg-subtle px-3 py-2"
        >
          <button type="button" className="min-w-0 flex-1 text-left">
            <span className="block truncate text-sm font-medium text-copy-primary">{project.name}</span>
            <span className="block truncate text-xs text-copy-muted">{project.slug}</span>
          </button>

          {project.access === "owned" ? (
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Rename ${project.name}`}
                onClick={() => onRenameProject(project)}
                className="text-copy-muted hover:text-copy-primary"
              >
                <Pencil />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${project.name}`}
                onClick={() => onDeleteProject(project)}
                className="text-copy-muted hover:text-state-error"
              >
                <Trash2 />
              </Button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onCreateProject,
  onDeleteProject,
  onRenameProject,
  ownedProjects,
  sharedProjects,
}: ProjectSidebarProps) {
  return (
    <SidebarProvider
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      className="pointer-events-none absolute inset-0 z-30"
    >
      <button
        type="button"
        aria-label="Close project sidebar"
        onClick={onClose}
        className={cn(
          "pointer-events-auto fixed inset-x-0 bottom-0 top-14 bg-base/70 backdrop-blur-sm md:hidden",
          !isOpen && "hidden",
        )}
      />
      <Sidebar
        side="left"
        variant="floating"
        collapsible="offcanvas"
        className="pointer-events-auto top-14 h-[calc(100svh-3.5rem)] p-0 [&>[data-sidebar=sidebar]]:border-r [&>[data-sidebar=sidebar]]:border-surface-border [&>[data-sidebar=sidebar]]:bg-surface/95 [&>[data-sidebar=sidebar]]:backdrop-blur-md [&>[data-sidebar=sidebar]]:ring-0"
      >
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-copy-primary">Projects</h2>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close project sidebar"
              onClick={onClose}
              className="text-copy-secondary hover:text-copy-primary"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4">
          <SidebarGroup className="min-h-0 flex-1 p-0">
            <Tabs defaultValue="my-projects" className="min-h-0 flex-1">
              <TabsList className="w-full">
                <TabsTrigger value="my-projects" className="flex-1">
                  My Projects
                </TabsTrigger>
                <TabsTrigger value="shared" className="flex-1">
                  Shared
                </TabsTrigger>
              </TabsList>

              <TabsContent value="my-projects" className="mt-3 h-full">
                <ProjectList
                  emptyText="No projects yet."
                  onDeleteProject={onDeleteProject}
                  onRenameProject={onRenameProject}
                  projects={ownedProjects}
                />
              </TabsContent>

              <TabsContent value="shared" className="mt-3 h-full">
                <ProjectList
                  emptyText="No shared projects yet."
                  onDeleteProject={onDeleteProject}
                  onRenameProject={onRenameProject}
                  projects={sharedProjects}
                />
              </TabsContent>
            </Tabs>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <Button className="w-full" variant="default" onClick={onCreateProject}>
            <Plus data-icon="inline-start" />
            New Project
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
