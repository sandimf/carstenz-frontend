import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const role = request.cookies.get('user_role')?.value;
  const pathname = request.nextUrl.pathname;

  const roleDashboard: Record<string, string> = {
    admin: '/dashboard/admin',
    nurse: '/dashboard/nurse',
    cashier: '/dashboard/cashier',
    doctor: '/dashboard/doctor',
  };

  // Jika belum login: semua akses ke /dashboard diarahkan ke login
  if (!role) {
    if (pathname.startsWith('/dashboard')) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const currentRolePath = roleDashboard[role] ?? '/dashboard';

  // Jika sudah login tapi ke /auth/login -> kirim ke dashboard role
  if (pathname === '/auth/login') {
    const url = request.nextUrl.clone();
    url.pathname = currentRolePath;
    return NextResponse.redirect(url);
  }

  // Khusus untuk /dashboard/*
  if (pathname.startsWith('/dashboard')) {
    // IZINKAN semua role mengakses /dashboard/management (dan subpath)
    if (pathname.startsWith('/dashboard/management')) {
      return NextResponse.next();
    }

    // Untuk dashboard lain, enforce prefix sesuai role
    if (!pathname.startsWith(currentRolePath)) {
      const url = request.nextUrl.clone();
      url.pathname = currentRolePath;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth/login', '/dashboard/:path*'],
};
