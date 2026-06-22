
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is the required function Next.js is looking for
export default function middleware(request: NextRequest) {
  // This allows all web requests to pass through normally
  return NextResponse.next();
}

// This controls which pages the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
