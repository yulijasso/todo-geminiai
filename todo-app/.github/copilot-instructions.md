## Purpose

Short, actionable guidance for AI coding assistants working on this repository.

## Big picture

- This is a Next.js (app-router) project (Next v16) using the `app/` directory. The UI is a single-page To‑Do app rendered from `app/page.js`.
- Styling is Tailwind CSS (see `app/globals.css`, `postcss.config.mjs`, `tailwindcss` in package.json). ESLint is configured via `eslint.config.mjs`.
- There are no server/API routes or database integrations in the current codebase: state is purely client-side in `app/page.js`.

## Key files to inspect

- `app/page.js` — the main UI; a client component (starts with `"use client"`) using React hooks and local state (todos are objects: `{ id, text, completed }`).
- `app/layout.js` — top-level layout wrapper for the app.
- `app/globals.css` — Tailwind base and global styles.
- `package.json` — dev and build scripts: `dev`, `build`, `start`, `lint`.
- `next.config.mjs`, `postcss.config.mjs`, `eslint.config.mjs` — build/lint configuration.

## Project-specific patterns and conventions

- App-router + app/ dir: default components are server components. Any component that uses hooks or browser APIs must explicitly include `"use client"` as the first line.
  - Example from `app/page.js`: the file begins with `"use client"` and then `import { useState } from 'react'`.
- Styling: use Tailwind utility classes directly in JSX. The project does not use CSS modules or styled-components in the current code.
- Component placement: add shared components under `app/components/` or feature folders under `app/` to follow app-router conventions.
- Data & persistence: currently there is no backend; todos are kept in client memory. If you implement persistence, add API routes or a server component and note that no server-side routes exist yet.

## Dev / build / test workflows (how to run things locally)

- Start dev server (fast local feedback): `npm run dev` — Next dev server (defaults to http://localhost:3000).
- Build for production: `npm run build` then `npm run start`.
- Lint: `npm run lint` (ESLint is configured at repo root).
- Notes: README mentions alternatives (yarn, pnpm, bun) but the package.json scripts above are the canonical commands.

## Integration points & dependencies

- Key dependencies: `next@16`, `react@19`, `tailwindcss@4` (see `package.json`).
- No external API integrations are present. If you add third-party integrations, register credentials out-of-band and do not commit secrets.

## Guidance for AI edits

- Small, focused PRs: change one logical area at a time (UI, styling, new API route).
- Preserve `"use client"` on files that rely on hooks/browser APIs. Moving code between server/client contexts requires adding/removing this directive.
- When adding stateful components, place them in `app/components/` and use client directive. Example todo item shape to reuse: `{ id: Number, text: String, completed: Boolean }`.
- If you add server-side code or API routes, update README and add simple tests or a README note describing the endpoint.
- Run `npm run lint` after edits and `npm run dev` locally to validate visual/interactive changes.

## Known limitations (avoid assumptions)

- No tests exist in the repository; do not assume test setup. Add tests with a minimal harness (Jest/React Testing Library) if needed, and include run instructions.
- No database or server endpoints exist yet — persistence is client-only in `app/page.js`.

## When in doubt — quick checklist for changes

1. Does the change require browser APIs/hooks? If yes, add `"use client"` at top of the file.
2. Did you run `npm run lint`? Fix any lint issues.
3. If you added server behavior, update README and add a small example request.
4. Keep changes minimal and reference where you edited (e.g., `app/page.js`, `app/layout.js`, `app/components/`).

---
If anything above is unclear or you'd like the file to include more repo-specific examples (config snippets, existing layout behaviors, or preferred component locations), tell me which areas to expand and I will iterate.
