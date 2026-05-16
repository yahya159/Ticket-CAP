# Repository Guidelines

## Project Structure & Module Organization
This repository is a monolithic CAP app rooted in this directory:

- `app/frontend/`: Vite + React + TypeScript frontend.
- `srv/` and `db/`: SAP CAP OData v4 backend (Node.js + SQLite).

Frontend code lives in `app/frontend/src/` with feature-first folders under `src/app/features/` (for example `tickets/`, `projects/`), shared UI in `src/app/components/`, and page routes in `src/app/pages/` and `src/app/routes.tsx`.
Backend domain model is in `db/schema.cds`, seed data in `db/data/*.csv`, and service handlers are in `srv/`.

## Build, Test, and Development Commands
Run backend commands from this directory and frontend commands from `app/frontend/`.

- Frontend (`app/frontend/`)
  - `npm install`: install dependencies.
  - `npm run dev`: start Vite dev server.
  - `npm run typecheck`: run strict TypeScript checks.
  - `npm run build`: production build.
  - `npm run check`: typecheck + build (preferred pre-PR gate).
- Backend (`.`)
  - `npm install`: install CAP dependencies.
  - `npm run watch`: start CAP in watch mode.
  - `npm start`: run `cds-serve`.
  - `npm run build`: CAP build artifacts.

## Coding Style & Naming Conventions
Use 2-space indentation, semicolons, and keep style consistent with existing files.

- React components: `PascalCase.tsx` (for example `ProjectDetailsView.tsx`).
- Utilities/services/hooks: `camelCase.ts` (for example `ticketColors.ts`, `hooks.ts`).
- Backend modules use CommonJS and mostly kebab/dot naming (for example `ticket.impl.js`).
- Use the `@/` alias for frontend imports (`@/app/...`).

No Prettier config is currently committed beyond `.cdsprettier.json`; rely on `npm run check` and existing patterns.

## Testing Guidelines
Frontend uses Vitest. Prefer colocated tests as `*.test.ts` or `*.test.tsx` (examples: `src/app/services/odataClient.test.ts`, `src/app/features/projects/__tests__/panels.smoke.test.tsx`).

Add or update tests for changed business logic, route guards, data mapping, and API adapters.  
Backend integration tests run with Jest via `npm test`.

## Commit & Pull Request Guidelines
Git history on this branch is currently empty, so no existing commit convention can be inferred. Use clear, imperative commit messages, preferably Conventional Commit style (`feat:`, `fix:`, `refactor:`).

For PRs, include:

- Scope summary and affected paths.
- Linked issue/ticket.
- Test evidence (`npm run check`, manual CAP verification).
- UI screenshots/videos for frontend changes.

## Security & Configuration Tips
Frontend proxies `/odata/v4` to `http://localhost:4004` in Vite dev server by default. Production deployments should use `VITE_ODATA_CORE_URL`, `VITE_ODATA_USER_URL`, `VITE_ODATA_TICKET_URL`, and `VITE_ODATA_TIME_URL` to point to the dedicated microservices. `VITE_ODATA_BASE_URL` is still supported as a legacy fallback.
Backend uses local SQLite at `db/performance.db`; do not commit local DB files or secrets.
