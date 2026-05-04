Read `AGENTS.md` before starting.

We're adding the design system and UI primitives components.

Install and configure `shadcn/ui`.

Add these shadcn components:
- Button
- Input
- Textarea
- ScrollArea
- Dialog
- Card
- Tabs

Don't modify the generated `components/ui/*` files after installation.

Also install `lucide-react`.

Create `lib/utils.ts` with a reusable `cn()` helper for merging tailwind classes.

Ensure all components match the existing dark theme in `app/globals.css`.

### Check when done
- All components import without error
- cn() helper function is created and working correctly
- No default light styling appears