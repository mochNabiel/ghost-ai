# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In progress

## Current Goal

- 07 — Editor home wired to real project APIs and server-fetched project lists

## Completed

- `01-design-system`: Installed and configured shadcn/ui, added Button/Input/Textarea/ScrollArea/Dialog/Card/Tabs, installed lucide-react, created `cn()` helper, and wired dark theme tokens in `app/globals.css`.
- Verification: `bun run lint` passes and `bun run build` passes.
- `02-editor`: Added reusable editor chrome components (`editor-navbar`, `project-sidebar`) and a dialog pattern scaffold (`editor-dialog-pattern`) using dark theme tokens.
- `02-editor` wiring: Added `editor-shell` and updated `app/page.tsx` to integrate sidebar open/close, overlay behavior, tabs placeholders, and bottom `New Project` action.
- Verification: `bun run lint` passes and `bun run build` passes.
- `02-editor` follow-up: Installed shadcn sidebar primitives and updated `project-sidebar` to use `SidebarHeader`, `SidebarContent`, and `SidebarFooter` while keeping overlay + slide-in behavior.
- Verification follow-up: `bun run lint` passes and `bun run build` passes.
- `03-auth`: Wrapped the app in `ClerkProvider` with Clerk's dark theme and app CSS-variable appearance overrides.
- `03-auth` routes: Added minimal sign-in and sign-up pages, protected-first root `proxy.ts`, root redirect behavior, protected `/editor` workspace route, and Clerk `UserButton` in the editor navbar.
- Verification: `bun run lint` passes and `bun run build` passes.
- `04-project-dialogs`: Added the editor home empty state, mocked project lists, owned-project rename/delete sidebar actions, create/rename/delete dialogs, slug preview, and mobile sidebar scrim.
- Verification: `bun run lint` passes and `bun run build` passes.
- `04-project-dialogs` mobile fix: Reworked the project sidebar shell so mobile and desktop both use the editor-controlled `isOpen` state, with a responsive panel width and mobile scrim.
- Verification mobile fix: `bun run lint` passes and `bun run build` passes.
- `05-prisma`: Added project metadata schema models, Prisma multi-file schema loading, cached Prisma client singleton, generated Prisma client output, and applied the initial `init_projects` migration.
- Verification: `bunx --bun prisma validate` passes, `npm run lint` passes, and `npm run build` passes.
- `06-project-apis`: Added authenticated REST routes for project list/create/rename/delete with owner enforcement on rename/delete and explicit `401`/`403` handling.
- `07-wire-editor-home`: Replaced mock project state with server-fetched owned/shared lists, added `use-project-actions` hook for create/rename/delete API mutations, wired sidebar/dialog interactions, and added `/editor/[projectId]` navigation/redirect behavior.
- Verification: `npm run build` passes.

## In Progress

- None.

## Next Up

- Start the next feature unit from `context/feature/`.

## Open Questions

- None.

## Architecture Decisions

- Using Tailwind v4 `@theme inline` for CSS custom property tokens — matches existing project setup.

## Session Notes

- Project is a fresh Next.js 16 scaffold with Tailwind v4, bun, and Geist fonts already configured.
- Started implementation of `01-design-system` in this session; reading the feature spec and wiring shadcn/ui primitives, lucide-react, `cn()`, and dark theme tokens.
- Completed `01-design-system`; shadcn generated `components/ui/*` files were left unmodified after installation, and global CSS maps shadcn semantic tokens to the project dark-only theme.
- Fixed ESLint flat config usage for `eslint-config-prettier` so verification can run.
- Started `02-editor` implementation in this session.
- Completed `02-editor` with reusable navbar/sidebar shells and a future-ready dialog pattern component (title, description, footer actions).
- Re-opened `02-editor` for requirement parity: migrate project sidebar to shadcn sidebar primitives.
- Completed `02-editor` follow-up and fixed generated `use-mobile` hook to satisfy current lint rules.
- Started and completed `03-auth` in this session using Clerk v7, `@clerk/ui` dark theme, Next.js 16 `proxy.ts`, and the existing Clerk environment variable names.
- Started and completed `04-project-dialogs` in this session with local mock project state only; no API routes or persistence were added.
- Fixed mobile responsiveness for the project sidebar after finding the shadcn sidebar primitive used separate internal mobile open state from the editor shell.
- Started and completed `05-prisma` in this session, including `Project`, `ProjectCollaborator`, `ProjectStatus`, Prisma client generation, and the applied PostgreSQL migration.
- Started and completed `06-project-apis` in this session with route handlers at `/api/projects` and `/api/projects/[projectId]`, plus shared API auth/JSON parsing helpers.
- Started and completed `07-wire-editor-home` in this session by introducing server-side project list fetching, replacing mock dialog mutations with real API calls, and adding workspace route wiring at `/editor/[projectId]`.
- Follow-up update: project create and rename now regenerate and persist `project.id` from room ID preview instead of relying on Prisma `cuid()`, with redirect to `/editor/{projectId}` after create and after renaming the active workspace.
