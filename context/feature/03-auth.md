Clerk is already installed and connected. Wire it into the Next.js app: provider, auth pages, redirects, route protection, and user menu.

## Design
Use clerk's `dark` theme from `@/clerk/ui/themes` as the base.

Override clerk appearance variables using the app's existing css variables. Don't hardcode colors and styles.

### Sign-in and sign-up pages:
- large screens : simple 2 panel layout
- left: compact logo, tagline, short text-only feature list
- right: centered clerk form
- small screens : form only
- no gradients
- no oversize hero section
- no feature cards
- no scroll-heavy layouts

Keep layout minimal and professional

## Implementation
Wrap the root layout with `ClerkProvider` using clerk's `dark` theme.

Create sign-in and sign-up pages using clerk components.

Use `proxy.ts` at the project root, not `middleware.ts`.

Define public routes using the existing sign-in and sign-up env vars. Protect everything else by default.

Update `/`:
- authenticated users redirect to `/editor`
- unauthenticated users redirect to `/sign-in`

Add clerk's built-in `UserButton` to the editor navbar right section for profile settings and logout.

Keep Clerk's default user menu and profile flows intact. Don't rebuild or heavily customize Clerk internals.

Use existing clerk env vars. Don't rename or invent new ones.

## Dependencies
install : @clerk/ui

## Check when done
- `proxy.ts` exists at the root
- all routes are protected except public auth paths
- auth pages use css variables with no hardcode colors
- `ClerkProvider` wraps the root layout
- `npm run build` passes