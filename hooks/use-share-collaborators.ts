"use client";

import { useCallback, useRef, useState } from "react";

interface Person {
  avatarUrl: string | null;
  displayName: string | null;
  email: string;
  id: string;
}

type ViewerRole = "owner" | "collaborator";

interface CollaboratorsResponse {
  collaborators: Person[];
  owner: Person | null;
  role: ViewerRole;
}

interface ApiErrorResponse {
  error?: {
    message?: string;
  };
}

async function readApiError(response: Response) {
  try {
    const payload = (await response.json()) as ApiErrorResponse;
    return payload.error?.message ?? "Request failed";
  } catch {
    return "Request failed";
  }
}

export function useShareCollaborators(projectId: string) {
  const loadedProjectIdRef = useRef<string | null>(null);
  const [collaborators, setCollaborators] = useState<Person[]>([]);
  const [owner, setOwner] = useState<Person | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [role, setRole] = useState<ViewerRole>("collaborator");

  const loadCollaborators = useCallback(
    async (force = false) => {
      if (!force && loadedProjectIdRef.current === projectId) {
        return;
      }

      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/collaborators`, {
          method: "GET",
        });

        if (!response.ok) {
          setErrorMessage(await readApiError(response));
          return;
        }

        const payload = (await response.json()) as CollaboratorsResponse;
        setCollaborators(payload.collaborators);
        setOwner(payload.owner);
        setRole(payload.role);
        loadedProjectIdRef.current = projectId;
      } finally {
        setIsLoading(false);
      }
    },
    [projectId],
  );

  const inviteCollaborator = useCallback(
    async (email: string) => {
      setIsMutating(true);
      setErrorMessage("");

      try {
        const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/collaborators`, {
          body: JSON.stringify({ email }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        if (!response.ok) {
          setErrorMessage(await readApiError(response));
          return false;
        }

        await loadCollaborators(true);
        return true;
      } finally {
        setIsMutating(false);
      }
    },
    [loadCollaborators, projectId],
  );

  const removeCollaborator = useCallback(
    async (email: string) => {
      setIsMutating(true);
      setErrorMessage("");

      try {
        const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/collaborators`, {
          body: JSON.stringify({ email }),
          headers: { "Content-Type": "application/json" },
          method: "DELETE",
        });

        if (!response.ok) {
          setErrorMessage(await readApiError(response));
          return false;
        }

        await loadCollaborators(true);
        return true;
      } finally {
        setIsMutating(false);
      }
    },
    [loadCollaborators, projectId],
  );

  const resetCache = useCallback(() => {
    loadedProjectIdRef.current = null;
  }, []);

  return {
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
  };
}
