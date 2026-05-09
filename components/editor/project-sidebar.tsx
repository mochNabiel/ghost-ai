"use client";

import { Plus, X } from "lucide-react";

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

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
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
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-surface-border bg-subtle p-6">
                  <p className="text-sm text-copy-muted">No projects yet.</p>
                </div>
              </TabsContent>

              <TabsContent value="shared" className="mt-3 h-full">
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-surface-border bg-subtle p-6">
                  <p className="text-sm text-copy-muted">No shared projects yet.</p>
                </div>
              </TabsContent>
            </Tabs>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <Button className="w-full" variant="default">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
