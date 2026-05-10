"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { ProjectListItem } from "@/lib/project-data";

type DialogType = "create" | "rename" | "delete";

interface ActiveDialog {
  type: DialogType;
  project?: ProjectListItem;
}

interface CreatedProjectResponse {
  project: {
    id: string;
  };
}

interface UseProjectActionsOptions {
  activeProjectId?: string;
}

function getEditorWorkspacePath(roomId: string) {
  return `/editor/${encodeURIComponent(roomId)}`;
}

function createSlug(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "new-project";
}

function createShortSuffix() {
  return Math.random().toString(36).slice(2, 6);
}

export function useProjectActions({ activeProjectId }: UseProjectActionsOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeDialog, setActiveDialog] = useState<ActiveDialog | null>(null);
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createSuffix, setCreateSuffix] = useState(createShortSuffix);

  const roomIdPreview = useMemo(() => {
    return `${createSlug(projectName)}-${createSuffix}`;
  }, [createSuffix, projectName]);

  function closeDialog() {
    setActiveDialog(null);
    setProjectName("");
    setIsLoading(false);
  }

  function openCreateDialog() {
    setProjectName("");
    setCreateSuffix(createShortSuffix());
    setActiveDialog({ type: "create" });
  }

  function openRenameDialog(project: ProjectListItem) {
    setProjectName(project.name);
    setCreateSuffix(createShortSuffix());
    setActiveDialog({ type: "rename", project });
  }

  function openDeleteDialog(project: ProjectListItem) {
    setProjectName(project.name);
    setActiveDialog({ type: "delete", project });
  }

  async function submitCreateProject() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roomIdPreview, name: projectName }),
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as CreatedProjectResponse;
      closeDialog();
      router.push(getEditorWorkspacePath(payload.project.id));
    } finally {
      setIsLoading(false);
    }
  }

  async function submitRenameProject() {
    const project = activeDialog?.project;

    if (!project) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roomIdPreview, name: projectName }),
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as CreatedProjectResponse;
      closeDialog();

      if (activeProjectId && project.id === activeProjectId) {
        router.push(getEditorWorkspacePath(payload.project.id));
        return;
      }

      if (pathname === getEditorWorkspacePath(project.id)) {
        router.push(getEditorWorkspacePath(payload.project.id));
        return;
      }

      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  async function submitDeleteProject() {
    const project = activeDialog?.project;

    if (!project) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return;
      }

      closeDialog();

      if (activeProjectId && project.id === activeProjectId) {
        router.push("/editor");
        return;
      }

      if (pathname === getEditorWorkspacePath(project.id)) {
        router.push("/editor");
        return;
      }

      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return {
    activeDialog,
    closeDialog,
    isLoading,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    projectName,
    roomIdPreview,
    setProjectName,
    submitCreateProject,
    submitDeleteProject,
    submitRenameProject,
  };
}
