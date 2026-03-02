import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Edge-compatible: only check for session cookie. Full auth runs in dashboard layout (Node).
function hasSessionCookie(request: NextRequest): boolean {
  const secure = request.cookies.get('__Secure-authjs.session-token')?.value;
  const standard = request.cookies.get('authjs.session-token')?.value;
  return !!(secure || standard);
}

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/dashboard')) return NextResponse.next();
  if (!hasSessionCookie(request)) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
