import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'es'];
const defaultLocale = 'es';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/api') &&
      pathname.includes('.') &&
      !locales.some(prefix => pathname.startsWith(`/${prefix}/`))
  ) {
    const segments = pathname.split('/');
    const lastSegment = segments[segments.length - 1];
    if (lastSegment.includes('.')) {
      return NextResponse.next();
    }
  }

  // Check if the pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to the default locale
  // Clone the URL to modify it
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
  
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and API routes
    '/((?!api/|_next/static/|_next/image|favicon\\.ico|.*\\.[a-zA-Z0-9]+$).*)',
    // Match the root path to redirect it
    '/', 
  ],
};
