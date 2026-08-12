import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Update Supabase Auth SSR session
  const response = await updateSession(request);

  const path = request.nextUrl.pathname;
  const isProtectedPath = path.startsWith('/dashboard') || path.startsWith('/onboarding');

  // Check if SB auth token cookie exists
  const authCookie = request.cookies.get('sb-access-token') || request.cookies.get('supabase-auth-token');

  if (isProtectedPath && !authCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*'],
};
