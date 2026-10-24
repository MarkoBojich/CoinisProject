# FixMyCity

Citizens report city problems (photo, location, description, time) and the responsible authorities resolve them. An administrator approves each citizen post before it is public, so inappropriate photos or descriptions never appear.

## Roles
- **Citizen**: signs in, creates reports, stars other citizens' reports, sees public reports and their own (including pending and rejected ones).
- **Administrator**: sees the moderation queue, approves or rejects posts, moves approved reports through resolution.
- **Visitor**: can browse approved reports and the ranking without signing in, but cannot star.

## Report lifecycle
`pending` -> `approved` -> `in_progress` -> `resolved`, or `pending` -> `rejected`. Only the administrator changes status.

## Stars and ranking
- A signed-in citizen can star any approved report, once per report, and can remove the star again.
- A citizen cannot star their own report. Only approved reports can be starred.
- `starCount` is the number of stars; the ranking list orders approved, unresolved reports by `starCount` descending (ties: newest first). Resolved and rejected reports leave the ranking.
- The star state is optimistic in the UI (TanStack Query) and the backend enforces the one-star-per-user rule.

## Planned screens
- Home / public list of approved reports (search, filter by status, sort by newest or most starred)
- Ranking: most starred unresolved problems
- Report detail (photo, address, small map, description, time, status, star button and count)
- New report form (photo, location, description; time is set automatically)
- My reports (citizen)
- Moderation queue (administrator)
- Sign in

## Repository
This is a monorepo: one repository for the whole app.
- `frontend/`: React app. Details in @frontend/CLAUDE.md, design in @frontend/DESIGN.md
- `backend/`: API, database and auth (built after the frontend, against the mock API contract)
- `docs/entities.md`: entities and the API contract shared by frontend and backend

## Design
Reliable, clear, civic. Deep blue primary, orange accent only for the main action ("Report a problem"), Poppins headings + Mulish body, 8 px radius, borders instead of shadows, no dark mode. Mobile-first (375 px), responsive up to 1440 px. Report status is always a badge: color + icon + text. Stars use a lucide `Star` icon with a count. Full rules in @frontend/DESIGN.md.

## Language
All code, identifiers, comments, commit messages, docs and UI copy are in English.
You may talk to me in any language.

## Commands (run from the repo root)
- `pnpm install`: installs dependencies for every package in the workspace
- `pnpm dev`: frontend dev server at http://localhost:5173
- `pnpm typecheck`: TypeScript check
- `pnpm lint`: oxlint and the boundary check between features
- `pnpm build`: production build
- `pnpm format`: Prettier formats `frontend/src/`

## Working in the monorepo
- One change that touches frontend and backend goes in one commit or pull request
- When an entity changes, update `docs/entities.md` in the same change
- Run commands from the root; scripts are forwarded with `pnpm --filter <package>`
