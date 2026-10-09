# lib/api

Typed API client generated from the backend's OpenAPI/Swagger spec (`openapi-typescript` or
`orval` — tool choice not finalized yet). This is the contract-first mechanism that replaces what
a shared monorepo types package would otherwise provide — the two repos (`event-ticketing-api`,
`event-ticketing-web`) stay separate on purpose; see
`~/Projects/AI/ai-solution-analysis/projects/personal/event-ticketing/decisions/v2-code-organization.md`.

Don't hand-write request/response types here that duplicate the backend's DTOs — regenerate when
the backend contract changes instead.
