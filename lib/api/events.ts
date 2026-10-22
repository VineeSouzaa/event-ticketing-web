import { toEventDetail, toEventPage } from '@/lib/events/events';
import { api } from './client';

export type EventsQuery = { q?: string; category?: string; cursor?: string };

// Browser-side reads, through the same-origin /api proxy. The first page is fetched on the
// server (see events.server.ts); these cover search, filters, "load more" and the detail dialog.
export async function fetchEventsPage({ q, category, cursor }: EventsQuery) {
  const { data } = await api.GET('/events', {
    params: { query: { q: q || undefined, category: category && category !== 'Todos' ? category : undefined, cursor } },
  });
  if (!data) throw new Error('Failed to load events');
  return toEventPage(data);
}

export async function fetchEventDetail(id: string) {
  const { data } = await api.GET('/events/{id}', { params: { path: { id } } });
  if (!data) throw new Error('Failed to load event');
  return toEventDetail(data);
}
