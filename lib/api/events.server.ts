import { cookies } from 'next/headers';
import createClient from 'openapi-fetch';
import { toEventPage } from '@/lib/events/events';
import type { paths } from './schema';

// First page of the home, rendered on the server with the browser's session cookie forwarded.
export async function getEventsPage() {
  const cookie = (await cookies()).toString();
  const client = createClient<paths>({
    baseUrl: process.env.API_URL,
    headers: { cookie },
    cache: 'no-store',
  });
  const { data } = await client.GET('/events');
  if (!data) throw new Error('Failed to load events');
  return toEventPage(data);
}
