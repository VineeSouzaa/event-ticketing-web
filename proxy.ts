import { NextResponse, type NextRequest } from 'next/server';

// Default name used by @nestjs/authentication for a Secure, host-only, Path=/ cookie.
const SESSION_COOKIE = '__Host-sid';

// Optimistic gate only: it checks the cookie exists, not that the session is still valid
// (sessions are in-memory on the API and die on restart). Pages that need the user call
// getSession() and redirect on null.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/login' || request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
