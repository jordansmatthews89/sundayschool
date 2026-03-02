import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Edge-compatible: only check for session cookie. Full auth runs in dashboard layout (Node).
const SESSION_COOKIE = process.env.NEXTAUTH_URL?.startsWith('https')
  ? '__Secure-authjs.session-token'
  : 'authjs.session-token';

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/dashboard')) return NextResponse.next();
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? request.cookies.get('authjs.session-token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
