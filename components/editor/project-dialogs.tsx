"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { MockProject } from "@/hooks/use-project-dialogs";

interface ProjectDialogsProps {
  activeDialog: {
    type: "create" | "rename" | "delete";
    project?: MockProject;
  } | null;
  isLoading: boolean;
  onClose: () => void;
  onCreate: () => Promise<void>;
  onDelete: () => Promise<void>;
  onRename: () => Promise<void>;
  projectName: string;
  setProjectName: (name: string) => void;
  slugPreview: string;
}

export function ProjectDialogs({
  activeDialog,
  isLoading,
  onClose,
  onCreate,
  onDelete,
  onRename,
  projectName,
  setProjectName,
  slugPreview,
}: ProjectDialogsProps) {
  const isCreateOpen = activeDialog?.type === "create";
  const isRenameOpen = activeDialog?.type === "rename";
  const isDeleteOpen = activeDialog?.type === "delete";
  const activeProject = activeDialog?.project;

  async function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onCreate();
  }

  async function handleRenameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onRename();
  }

  async function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onDelete();
  }

  return (
    <>
      <Dialog open={isCreateOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="rounded-3xl border-surface-border bg-elevated text-copy-primary sm:max-w-md">
          <form onSubmit={handleCreateSubmit} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle className="text-primary">Create Project</DialogTitle>
              <DialogDescription>
                Start a new architecture workspace with a readable project slug.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              <label htmlFor="create-project-name" className="text-sm font-medium text-copy-secondary">
                Project name
              </label>
              <Input
                id="create-project-name"
                autoFocus
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Architecture workspace"
                className="text-primary"
              />
              <p className="text-xs text-copy-muted">
                Slug preview: <span className="font-mono text-brand">{slugPreview}</span>
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="rounded-3xl border-surface-border bg-elevated text-copy-primary sm:max-w-md">
          <form onSubmit={handleRenameSubmit} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle className="text-primary">Rename Project</DialogTitle>
              <DialogDescription>
                Current project name: {activeProject?.name ?? "Untitled Project"}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              <label htmlFor="rename-project-name" className="text-sm font-medium text-copy-secondary">
                Project name
              </label>
              <Input
                id="rename-project-name"
                autoFocus
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                className="text-primary"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Renaming..." : "Rename Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="rounded-3xl border-surface-border bg-elevated text-copy-primary sm:max-w-md">
          <form onSubmit={handleDeleteSubmit} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle className="text-primary">Delete Project</DialogTitle>
              <DialogDescription>
                Delete <span className="text-primary">{activeProject?.slug ?? "this project"}</span> from your mock project list?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={isLoading}>
                {isLoading ? "Deleting..." : "Delete Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
