"use client";

import { UserButton } from "@clerk/nextjs";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
}: EditorNavbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-surface-border bg-surface px-4">
      <div className="flex min-w-0 flex-1 items-center">
        <Button
          variant="ghost"
          size="icon"
          aria-label={isSidebarOpen ? "Close project sidebar" : "Open project sidebar"}
          onClick={onToggleSidebar}
          className="text-copy-secondary hover:text-copy-primary"
        >
          {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-center">
        <span className="text-sm font-medium text-copy-secondary">Ghost AI Editor</span>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end">
        <UserButton />
      </div>
    </header>
  );
}
