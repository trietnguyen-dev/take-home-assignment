import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken');

    if (!token && request.nextUrl.pathname !== '/sign-in') {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (token && request.nextUrl.pathname === '/sign-in') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/protected/**', '/some-other-protected-page/**'],
};
