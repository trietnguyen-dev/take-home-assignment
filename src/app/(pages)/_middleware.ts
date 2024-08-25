import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken');

    if (!token && request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (token && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/protected/**', '/some-other-protected-page/**'],
};
