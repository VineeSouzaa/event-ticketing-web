# hooks

Shared React hooks, e.g. `useAvailability` — subscribes via `lib/websocket` for live updates, with
a `lib/api` REST call as the initial/fallback value. Hooks here are cross-feature; a hook used by
only one component can live next to that component instead.
