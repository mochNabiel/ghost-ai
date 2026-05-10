"use client";

import { useEffect, useMemo, useState } from "react";
import { Link2, Loader2, Mail, Trash2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useShareCollaborators } from "@/hooks/use-share-collaborators";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

function RoleBadge({ label, variant }: { label: string; variant: "owner" | "collaborator" }) {
  return (
    <span
      className={
        variant === "owner"
          ? "rounded-full border border-brand/50 bg-accent-dim px-2.5 py-0.5 text-[10px] tracking-[0.12em] text-brand"
          : "rounded-full border border-surface-border bg-subtle px-2.5 py-0.5 text-[10px] tracking-[0.12em] text-copy-muted"
      }
    >
      {label}
    </span>
  );
}

export function ShareDialog({ isOpen, onClose, projectId }: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const {
    collaborators,
    errorMessage,
    inviteCollaborator,
    isLoading,
    isMutating,
    loadCollaborators,
    owner,
    removeCollaborator,
    resetCache,
    role,
  } = useShareCollaborators(projectId);

  const isOwner = role === "owner";
  const peopleTotal = collaborators.length + (owner ? 1 : 0);
  const projectUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/editor/${encodeURIComponent(projectId)}`;
  }, [projectId]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        void loadCollaborators(false);
      }, 0);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [isOpen, loadCollaborators]);

  useEffect(() => {
    resetCache();
  }, [projectId, resetCache]);

  async function handleInvite() {
    if (!email.trim() || !isOwner) return;
    const success = await inviteCollaborator(email.trim());
    if (success) setEmail("");
  }

  async function handleRemove(targetEmail: string) {
    if (!isOwner) return;
    setRemovingEmail(targetEmail);
    try {
      await removeCollaborator(targetEmail);
    } finally {
      setRemovingEmail(null);
    }
  }

  async function handleCopyLink() {
    if (!projectUrl) {
      return;
    }

    await navigator.clipboard.writeText(projectUrl);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 1200);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="rounded-3xl border-surface-border bg-elevated p-0 text-copy-primary sm:max-w-2xl">
        <DialogHeader className="border-b border-surface-border px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-2xl">Share project</DialogTitle>
              <DialogDescription className="mt-0.5 text-sm">
                Invite collaborators, copy the workspace link, and manage access.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 px-5 pb-4">
          <div className="rounded-3xl border border-surface-border bg-subtle p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-lg font-medium text-copy-primary">Workspace link</p>
                <p className="mt-0.5 text-xs text-copy-muted">
                  Share a direct link with teammates after you grant them access.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleCopyLink}>
                <Link2 data-icon="inline-start" />
                {isCopying ? "Copied!" : "Copy link"}
              </Button>
            </div>
            <Input readOnly value={projectUrl} className="mt-3 font-mono text-[11px]" />
          </div>

          {isOwner ? (
            <form
              className="rounded-3xl border border-surface-border bg-subtle p-2.5"
              onSubmit={(event) => {
                event.preventDefault();
                void handleInvite();
              }}
            >
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-copy-faint" />
                  <Input
                    type="email"
                    placeholder="teammate@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
                <Button type="submit" size="sm" disabled={isMutating || !email.trim()}>
                  {isMutating ? "Inviting..." : "Invite"}
                </Button>
              </div>
            </form>
          ) : null}

          {errorMessage ? <p className="text-xs text-state-error">{errorMessage}</p> : null}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-lg font-medium text-copy-primary">People with access</p>
              <p className="text-xs text-copy-faint">{peopleTotal} total</p>
            </div>

            <div className="max-h-72 space-y-1.5 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-6 text-copy-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  {owner ? (
                    <div className="flex items-center justify-between rounded-2xl border border-surface-border bg-subtle px-3 py-2.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        {owner.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={owner.avatarUrl}
                            alt={owner.displayName ?? owner.email}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-base text-copy-muted">
                            <UserRound className="h-4 w-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-copy-primary">
                            {owner.displayName ?? owner.email}
                          </p>
                          <p className="truncate text-xs text-copy-muted">{owner.email}</p>
                        </div>
                      </div>
                      <RoleBadge label="OWNER" variant="owner" />
                    </div>
                  ) : null}

                  {collaborators.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="flex items-center justify-between rounded-2xl border border-surface-border bg-subtle px-3 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        {collaborator.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={collaborator.avatarUrl}
                            alt={collaborator.displayName ?? collaborator.email}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-base text-copy-muted">
                            <UserRound className="h-4 w-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-copy-primary">
                            {collaborator.displayName ?? collaborator.email}
                          </p>
                          <p className="truncate text-xs text-copy-muted">{collaborator.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <RoleBadge label="COLLABORATOR" variant="collaborator" />
                        {isOwner ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="size-6 text-copy-muted hover:text-state-error"
                            disabled={removingEmail === collaborator.email}
                            onClick={() => void handleRemove(collaborator.email)}
                            aria-label={`Remove ${collaborator.email}`}
                          >
                            <Trash2 />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {!owner && collaborators.length === 0 ? (
                    <p className="py-6 text-center text-xs text-copy-muted">No access entries yet.</p>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
