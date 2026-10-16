import { cookies } from 'next/headers';
import createClient from 'openapi-fetch';
import type { paths } from './schema';

// Server-side session lookup: Server Components call the backend directly (not through the
// /api rewrite) and forward the browser's cookie.
export async function getSession() {
  const cookie = (await cookies()).toString();
  const client = createClient<paths>({
    baseUrl: process.env.API_URL,
    headers: { cookie },
    cache: 'no-store',
  });
  const { data } = await client.GET('/auth/me');
  return data ?? null;
}
