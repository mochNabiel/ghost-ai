import Link from "next/link";
import { Lock } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex h-screen items-center justify-center bg-base px-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-border bg-subtle">
          <Lock className="h-6 w-6 text-copy-secondary" />
        </div>
        <h1 className="text-xl font-semibold text-copy-primary">Access Denied</h1>
        <p className="text-sm text-copy-muted">
          You do not have access to this workspace or it no longer exists.
        </p>
        <Link href="/editor" className={buttonVariants({ variant: "default" })}>
          Back to Projects
        </Link>
      </div>
    </div>
  );
}
