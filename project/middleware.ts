import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Simple middleware that just checks for auth cookies
  // Detailed auth checks happen at the page/API level
  const hasAuthCookie = req.cookies.has('sb-access-token') || 
                       req.cookies.toString().includes('supabase.auth.token');

  // Protect admin routes - redirect to login if no auth
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!hasAuthCookie) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    // Admin role check happens in the admin pages
  }

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!hasAuthCookie) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (req.nextUrl.pathname.startsWith('/auth') && hasAuthCookie) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
  ],
};
