"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorHomeProps {
  onCreateProject: () => void;
}

export function EditorHome({ onCreateProject }: EditorHomeProps) {
  return (
    <div className="flex h-full items-center justify-center px-6 text-center">
      <div className="flex max-w-lg flex-col items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-normal text-copy-primary">
            Create a project or open an existing one
          </h1>
          <p className="text-sm leading-6 text-copy-muted">
            Start a new architecture workspace, or choose a project from the sidebar
          </p>
        </div>
        <Button onClick={onCreateProject}>
          <Plus data-icon="inline-start" />
          New Project
        </Button>
      </div>
    </div>
  );
}
