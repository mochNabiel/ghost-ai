"use client";

import { useMemo, useState } from "react";

export interface MockProject {
  id: string;
  name: string;
  slug: string;
  access: "owned" | "shared";
}

type DialogType = "create" | "rename" | "delete";

interface ActiveDialog {
  type: DialogType;
  project?: MockProject;
}

const initialProjects: MockProject[] = [
  {
    id: "owned-ghost-ai",
    name: "Ghost AI Platform",
    slug: "ghost-ai-platform",
    access: "owned",
  },
  {
    id: "owned-event-mesh",
    name: "Event Mesh Redesign",
    slug: "event-mesh-redesign",
    access: "owned",
  },
  {
    id: "shared-payments",
    name: "Payments Gateway",
    slug: "payments-gateway",
    access: "shared",
  },
  {
    id: "shared-analytics",
    name: "Analytics Pipeline",
    slug: "analytics-pipeline",
    access: "shared",
  },
];

function createSlug(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "new-project";
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<MockProject[]>(initialProjects);
  const [activeDialog, setActiveDialog] = useState<ActiveDialog | null>(null);
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const ownedProjects = useMemo(
    () => projects.filter((project) => project.access === "owned"),
    [projects],
  );
  const sharedProjects = useMemo(
    () => projects.filter((project) => project.access === "shared"),
    [projects],
  );
  const slugPreview = useMemo(() => createSlug(projectName), [projectName]);

  function closeDialog() {
    setActiveDialog(null);
    setProjectName("");
    setIsLoading(false);
  }

  function openCreateDialog() {
    setProjectName("");
    setActiveDialog({ type: "create" });
  }

  function openRenameDialog(project: MockProject) {
    setProjectName(project.name);
    setActiveDialog({ type: "rename", project });
  }

  function openDeleteDialog(project: MockProject) {
    setProjectName(project.name);
    setActiveDialog({ type: "delete", project });
  }

  async function runMockSubmit(action: () => void) {
    setIsLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 200));
    action();
    closeDialog();
  }

  async function submitCreateProject() {
    await runMockSubmit(() => {
      const name = projectName.trim() || "Untitled Project";
      const slug = createSlug(name);

      setProjects((currentProjects) => [
        {
          id: `owned-${slug}-${Date.now()}`,
          name,
          slug,
          access: "owned",
        },
        ...currentProjects,
      ]);
    });
  }

  async function submitRenameProject() {
    const project = activeDialog?.project;

    if (!project) {
      return;
    }

    await runMockSubmit(() => {
      const name = projectName.trim() || project.name;

      setProjects((currentProjects) =>
        currentProjects.map((currentProject) =>
          currentProject.id === project.id
            ? {
                ...currentProject,
                name,
                slug: createSlug(name),
              }
            : currentProject,
        ),
      );
    });
  }

  async function submitDeleteProject() {
    const project = activeDialog?.project;

    if (!project) {
      return;
    }

    await runMockSubmit(() => {
      setProjects((currentProjects) =>
        currentProjects.filter((currentProject) => currentProject.id !== project.id),
      );
    });
  }

  return {
    activeDialog,
    closeDialog,
    isLoading,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    ownedProjects,
    projectName,
    setProjectName,
    sharedProjects,
    slugPreview,
    submitCreateProject,
    submitDeleteProject,
    submitRenameProject,
  };
}
