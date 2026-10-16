# lib/api

Typed API client generated from the backend's OpenAPI/Swagger spec (`openapi-typescript` +
`openapi-fetch`; regenerate with `pnpm api:generate` while the API is running). This is the contract-first mechanism that replaces what
a shared monorepo types package would otherwise provide — the two repos (`event-ticketing-api`,
`event-ticketing-web`) stay separate on purpose; see
`~/Projects/AI/ai-solution-analysis/projects/personal/event-ticketing/decisions/v2-code-organization.md`.

Don't hand-write request/response types here that duplicate the backend's DTOs — regenerate when
the backend contract changes instead.

- `client.ts` — browser client; `/api/*` is rewritten to the backend (`next.config.ts`), so the
  session cookie (`__Host-sid`, host-only) stays on the web origin: no CORS, no cross-site cookies.
- `session.ts` — server-side `getSession()` for Server Components; calls `API_URL` directly and
  forwards the cookie.
