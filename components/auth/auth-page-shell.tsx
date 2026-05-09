import type { ReactNode } from "react";

interface AuthPageShellProps {
  children: ReactNode;
}

const featureItems = [
  "Create architecture projects with a shared canvas.",
  "Collaborate with teammates in real time.",
  "Generate durable specs from your final system graph.",
];

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <main className="grid min-h-screen bg-base text-copy-primary lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="hidden border-r border-surface-border bg-surface px-10 py-10 lg:flex lg:flex-col lg:justify-between">
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-surface-border bg-elevated text-sm font-semibold text-brand">
              G
            </div>
            <span className="text-sm font-medium text-copy-primary">Ghost AI</span>
          </div>

          <div className="max-w-md space-y-4">
            <p className="text-2xl font-semibold tracking-normal text-copy-primary">
              Design systems with your team, then turn the graph into a spec.
            </p>
            <p className="text-sm leading-6 text-copy-secondary">
              A focused workspace for authenticated project teams to map, refine, and document
              system architecture.
            </p>
          </div>
        </div>

        <ul className="max-w-md space-y-3 text-sm leading-6 text-copy-muted">
          {featureItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:min-h-0 lg:px-10">
        {children}
      </section>
    </main>
  );
}
