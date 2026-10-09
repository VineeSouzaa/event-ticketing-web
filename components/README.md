# components

- `ui/` — generic, reusable components with no domain knowledge (buttons, cards, inputs). Nothing
  here should import from `events/` or `reservations/`, or know what a "ticket" is.
- `events/` — feature-specific components (`EventCard`, `AvailabilityBadge`). May use `ui/`.
- `reservations/` — feature-specific components (`ReservationForm`, `HoldTimer`). May use `ui/`.

Tests are colocated next to the component they cover (`Component.test.tsx` beside
`Component.tsx`), run with Vitest + React Testing Library — not a separate `__tests__` folder.
