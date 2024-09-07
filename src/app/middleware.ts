// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('next-auth.session-token'); // Adjust based on your session management

  // Redirect if not authenticated and trying to access a protected route
  if (!token && pathname !== '/sign-in') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Apply middleware to all paths except API and static files
};
