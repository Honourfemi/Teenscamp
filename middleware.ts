import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedPage =
    path.startsWith('/admin/dashboard') || path.startsWith('/admin/checkin');
  const isProtectedApi =
    path.startsWith('/api/admin') && !path.startsWith('/api/admin/login');

  if (isProtectedPage || isProtectedApi) {
    const token = request.cookies.get('admin_session')?.value;
    const valid = await verifySessionToken(token);

    if (!valid) {
      if (isProtectedApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
