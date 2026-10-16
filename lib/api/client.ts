import createClient from 'openapi-fetch';
import type { paths } from './schema';

// Browser client. `/api` is rewritten to the backend (see next.config.ts), so the
// HttpOnly session cookie travels same-origin without extra configuration.
export const api = createClient<paths>({ baseUrl: '/api' });
