import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Role } from '@prisma/client';

const roleBasedRoutes: Record<string, Role[]> = {
  '/admin': [Role.PLATFORM_ADMIN],
  '/company': [Role.COMPANY_ADMIN],
  '/dashboard': [Role.JOB_SEEKER],
  '/jobs': [Role.JOB_SEEKER],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const userRole = token?.role as Role | undefined;

  if (['/login', '/signup'].includes(pathname) && token) {
    const redirectUrl =
      userRole === Role.PLATFORM_ADMIN
        ? '/admin'
        : userRole === Role.COMPANY_ADMIN
        ? '/company'
        : '/jobs';
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  const matchedRoute = Object.keys(roleBasedRoutes).find((route) =>
    pathname.startsWith(route)
  );

  if (!matchedRoute) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowedRoles = roleBasedRoutes[matchedRoute];

  if (!allowedRoles.includes(userRole!)) {
    const redirectUrl =
      userRole === Role.PLATFORM_ADMIN
        ? '/admin'
        : userRole === Role.COMPANY_ADMIN
        ? '/company'
        : '/jobs';

    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/company/:path*',
    '/dashboard/:path*',
    '/jobs/:path*',
    '/login',
    '/signup',
  ],
};
