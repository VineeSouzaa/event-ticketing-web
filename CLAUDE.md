# event-ticketing-web — Claude Code instructions

## What this project is

Next.js frontend for a portfolio piece built to demonstrate mobile-first, modern frontend
practice alongside a backend (`event-ticketing-api`, separate repo — not a monorepo, that was a
deliberate choice) that proves correctness/performance under concurrent load and natural
observability. Full planning history and rationale for every decision below lives in
`~/Projects/AI/ai-solution-analysis/projects/personal/event-ticketing/decisions/v1-architecture.md`
— read it before proposing any architectural change, and update it (new version, not an edit) if a
decision here actually changes.

Note: `AGENTS.md` in this repo is auto-managed by `next dev` (Next.js breaking-changes/docs
pointer) — don't edit it, don't remove its content from commits. This `CLAUDE.md` is the one to
maintain by hand.

## Domain

Public-facing event ticketing: browse events, see live ticket availability, reserve (hold →
confirm flow, backend-owned), see real-time availability updates without polling.

## Design posture

**Mobile-first by default** — this continues a genuine pattern from real prior work (RUK
Platform, Unimed online exam scheduling were both built mobile-first), not a new unproven
approach. Also fits the domain honestly: ticket purchases are often an on-the-phone, impulsive
decision.

- **Tailwind CSS** (already scaffolded) for styling — mobile-first breakpoints by default.
- **`next/image`** for any event banner/imagery — don't use a raw `<img>` tag for content images.
- **Core Web Vitals** (LCP/CLS in particular) are an explicit target on the public event pages,
  not an afterthought — these pages are SSR specifically so this is measurable and worth actually
  checking, not just asserting.

## Talking to the backend

- **REST only** — no GraphQL/tRPC client, matching the backend's deliberate choice.
- **Type safety across the boundary comes from OpenAPI, not a shared monorepo package** (repos are
  separate on purpose — see the solution doc for the trade-off reasoning). Generate the typed API
  client from the backend's OpenAPI/Swagger spec (e.g. `openapi-typescript` or `orval`) — don't
  hand-write request/response types that duplicate the backend's DTOs; regenerate when the backend
  contract changes.
- Reservation creation must send a client-generated **idempotency key** — required by the backend,
  not optional.
- Event listing uses **cursor-based pagination** — design list UI/data-fetching around a cursor,
  not a page number.

## Real-time availability

Live ticket-count updates arrive over **WebSocket**, one logical channel per event — this is
additive on top of REST, not a replacement for it. REST remains the fallback for a reservation's
status (e.g. if the socket isn't connected). Known edge case already flagged, not yet solved:
mobile network changes (wifi↔4G) and backgrounding need reconnection handling — don't assume the
socket stays alive across those transitions, build with that in mind when this is implemented.

## Testing

**Vitest** (not Jest) — paired with React Testing Library. Deliberately different from the
backend's Jest choice; the two are explained together in the solution doc as a reasoned pair, not
an inconsistency to "fix."

## Explicit non-goals for v1

- Named/seated ticket selection UI (seat map) — backend doesn't support it yet either; v2 scope.
- Any state-sharing mechanism with the backend repo beyond the generated OpenAPI client — no
  shared monorepo package, no copy-pasted types maintained by hand.
