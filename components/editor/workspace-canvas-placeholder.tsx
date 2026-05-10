interface WorkspaceCanvasPlaceholderProps {
  projectName: string
}

export function WorkspaceCanvasPlaceholder({
  projectName,
}: WorkspaceCanvasPlaceholderProps) {
  return (
    <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-3xl border border-surface-border bg-surface/80 px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,212,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(100,87,249,0.2),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 bg-[linear-gradient(rgba(58,58,66,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(58,58,66,0.4)_1px,transparent_1px)] bg-size-[56px_56px]" />

      <div className="relative z-10 flex max-w-xl flex-col items-center gap-4">
        <p className="text-xs uppercase tracking-[0.14em] text-primary">
          Workspace Shell
        </p>
        <h2 className="text-4xl font-semibold leading-tight text-copy-primary">
          Canvas and collaboration tooling land here next.
        </h2>
        <p className="leading-8 text-copy-muted">
          Room{" "}
          <span className="font-medium text-copy-primary">{projectName}</span>{" "}
          is wired with project context, ownership checks, and navigation.
          Real-time canvas will be added next.
        </p>
      </div>
    </section>
  )
}
