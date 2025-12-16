import { NextResponse } from 'next/server';
import { MiddlewareConfig, NextRequest } from 'next/server';

const publicRoutes = [
    { path: '/' },
    { path: '/manifest.json' },
    { path: '/servicos' },
    { path: '/auth/login', whenAuthenticated: 'redirect' },
    { path: '/auth/cadastrar', whenAuthenticated: 'redirect' },
    { path: '/auth/esqueci', whenAuthenticated: 'redirect' },
    { path: '/auth/recuperar', whenAuthenticated: 'redirect' },
];

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/auth/login'

export function middleware(req: NextRequest) {

    const path = req.nextUrl.pathname;
    const publicRoute = publicRoutes.find(route => route.path === path);
    const authToken = req.cookies.get('userid')?.value;

    return NextResponse.next();
    if (path === '/' || path === 'manifest.json') {
    }

    if (!authToken && publicRoute) {
        return NextResponse.next();
    }
    if (!authToken && !publicRoute) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
        return NextResponse.redirect(redirectUrl);
    }

    if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
    }

    if (authToken && !publicRoute) {
        return NextResponse.next();
    }

    return NextResponse.next();

}

export const config: MiddlewareConfig = {
    matcher: [
        /*
         * Corresponde a todos os caminhos, EXCETO:
         * - api, _next/static, _next/image, favicon.ico, sitemap, robots
         * - Arquivos com extensões: png, jpg, jpeg, gif, webp, svg, css, js, mp4
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$|.*\\.svg$|.*\\.css$|.*\\.js$|.*\\.mp4$).*)',
    ],
}