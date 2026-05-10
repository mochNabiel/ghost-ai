import { Bot, Sparkles } from "lucide-react"

import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

interface WorkspaceAiSidebarPlaceholderProps {
  isOpen: boolean
}

export function WorkspaceAiSidebarPlaceholder({
  isOpen,
}: WorkspaceAiSidebarPlaceholderProps) {
  return (
    <aside
      className={`hidden min-h-0 shrink-0 overflow-hidden rounded-3xl border border-surface-border bg-surface/95 text-copy-primary backdrop-blur-md transition-[width,opacity] duration-300 ease-out lg:flex lg:flex-col ${
        isOpen
          ? "lg:w-[20rem] lg:opacity-100"
          : "lg:w-0 lg:opacity-0 lg:border-transparent"
      }`}
    >
      <SidebarHeader className="border-b border-surface-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-copy-primary">
              AI Copilot
            </h2>
            <p className="text-sm text-copy-muted">Placeholder panel</p>
          </div>
          <Sparkles className="h-5 w-5 text-ai-text" />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <div className="rounded-3xl border border-surface-border bg-subtle p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-dim">
              <Bot className="h-5 w-5 text-ai-text" />
            </div>
            <div>
              <p className="text-lg font-medium text-copy-primary">
                Chat surface pending
              </p>
              <p className="mt-1 text-sm text-copy-muted">
                Messaging and generation are intentionally out of scope for this
                step.
              </p>
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-3xl border border-dashed border-surface-border bg-base/60 p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-copy-faint">
            Future hooks
          </p>
          <p className="mt-3 text-sm text-copy-muted">
            Prompt composer, run status, and architecture guidance will attach
            to this sidebar.
          </p>
        </div>
      </SidebarFooter>
    </aside>
  )
}
