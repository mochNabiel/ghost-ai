import { cn } from "@/lib/utils";

interface EditorDialogPatternProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function EditorDialogPattern({
  title,
  description,
  children,
  footer,
  className,
}: EditorDialogPatternProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-surface-border bg-elevated text-copy-primary shadow-2xl",
        className,
      )}
    >
      <div className="space-y-1 p-6">
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? <p className="text-sm text-copy-muted">{description}</p> : null}
      </div>
      {children ? <div className="px-6 pb-6">{children}</div> : null}
      {footer ? <div className="rounded-b-3xl border-t border-surface-border bg-subtle p-4">{footer}</div> : null}
    </div>
  );
}
