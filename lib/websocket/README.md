# lib/websocket

Connection management for the real-time availability channel (one logical channel per event,
backed by the API's `core/realtime` gateway). REST remains the fallback for reservation status if
the socket isn't connected — this layer is additive, not a replacement for the API client in
`lib/api`.

Known open edge case, not yet solved: reconnection handling across mobile network changes
(wifi↔4G) and app backgrounding — build with that in mind, don't assume the socket stays alive
across those transitions.
