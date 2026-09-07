import { NextResponse } from 'next/server';
import { getMaintenanceStatus } from './lib/maintenance';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Lewatkan static files, favicon, icons, images, dan endpoint API internal
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Baca status maintenance dari maintenance.json
  const maintenance = getMaintenanceStatus();

  // Jika maintenance mode mati
  if (!maintenance.enabled) {
    // Jika user mengakses halaman /maintenance langsung padahal sistem normal, redirect ke home
    if (pathname === '/maintenance') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 3. LOGIKA BYPASS SECRET (persis seperti Laravel php artisan down --secret="code")
  // Contoh: Akses langsung URL /beringin-admin atau ?secret=beringin-admin
  const secret = maintenance.secret || 'beringin-admin';
  const requestedSecretPath = '/' + secret;
  const secretQuery = request.nextUrl.searchParams.get('secret');

  if (pathname === requestedSecretPath || secretQuery === secret) {
    // Berikan cookie bypass selama 7 hari lalu redirect ke home
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('maintenance_bypass', secret, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      httpOnly: false,
      sameSite: 'lax',
    });
    return response;
  }

  // 4. Periksa apakah user memiliki cookie bypass yang valid
  const bypassCookie = request.cookies.get('maintenance_bypass')?.value;
  if (bypassCookie === secret) {
    // Admin dengan secret bypass diizinkan masuk ke semua halaman
    return NextResponse.next();
  }

  // 5. Jika tidak ada bypass dan bukan di /maintenance, redirect ke /maintenance (Status 503)
  if (pathname !== '/maintenance') {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}

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
