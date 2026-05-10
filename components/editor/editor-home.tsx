"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorHomeProps {
  onCreateProject: () => void;
}

export function EditorHome({ onCreateProject }: EditorHomeProps) {
  return (
    <section className="relative flex h-full min-h-0 items-center justify-center overflow-hidden rounded-3xl border border-surface-border bg-surface/80 px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,212,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(100,87,249,0.2),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 bg-[linear-gradient(rgba(58,58,66,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(58,58,66,0.4)_1px,transparent_1px)] bg-size-[56px_56px]" />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-4">
        <p className="text-xs uppercase tracking-[0.14em] text-primary">Editor Home</p>
        <h1 className="text-4xl font-semibold leading-tight text-copy-primary">
          Create a project or open an existing one.
        </h1>
        <p className="leading-8 text-copy-muted">
          Start a new architecture workspace, or choose an existing project from
          the sidebar.
        </p>
        <Button onClick={onCreateProject} size="lg" className="px-6">
          <Plus />
          New Project
        </Button>
      </div>
    </section>
  );
}
