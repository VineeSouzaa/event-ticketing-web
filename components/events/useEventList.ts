import { useEffect, useRef, useState } from 'react';
import { fetchEventsPage } from '@/lib/api/events';
import type { EventPage } from '@/lib/events/events';

const SEARCH_DEBOUNCE_MS = 300;

// Server-backed list: `initial` is the unfiltered first page rendered on the server; any change
// of search/category refetches from page one, and `loadMore` follows the API's cursor.
export function useEventList(initial: EventPage, query: string, category: string) {
  const [page, setPage] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const latest = useRef(0); // ignores responses that a newer request has superseded
  const applied = useRef(`|Todos`);

  useEffect(() => {
    const key = `${query.trim()}|${category}`;
    if (key === applied.current) return;
    const id = ++latest.current;
    const timer = setTimeout(
      async () => {
        setLoading(true);
        setError(false);
        try {
          const next = await fetchEventsPage({ q: query.trim(), category });
          if (id !== latest.current) return;
          applied.current = key;
          setPage(next);
        } catch {
          if (id === latest.current) setError(true);
        } finally {
          if (id === latest.current) setLoading(false);
        }
      },
      query ? SEARCH_DEBOUNCE_MS : 0,
    );
    return () => clearTimeout(timer);
  }, [query, category]);

  const loadMore = async () => {
    if (!page.nextCursor || loading) return;
    const id = ++latest.current;
    setLoading(true);
    setError(false);
    try {
      const next = await fetchEventsPage({ q: query.trim(), category, cursor: page.nextCursor });
      if (id !== latest.current) return;
      setPage((current) => ({ items: [...current.items, ...next.items], nextCursor: next.nextCursor }));
    } catch {
      if (id === latest.current) setError(true);
    } finally {
      if (id === latest.current) setLoading(false);
    }
  };

  return { events: page.items, hasMore: page.nextCursor !== null, loading, error, loadMore };
}
