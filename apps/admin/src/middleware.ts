import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/admin/api') ||
    pathname.startsWith('/admin/_next') ||
    pathname.startsWith('/admin/favicon.ico')
  ) {
    return NextResponse.next();
  }
  const token = req.cookies.get('admin_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  // jwt.verify는 Edge Runtime에서 지원되지 않으므로 제거
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
