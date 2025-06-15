"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.middleware = middleware;
const server_1 = require("next/server");
/**
 * Multi-tenant middleware for Next.js 14
 * Handles tenant detection from subdomain and routing
 */
function middleware(request) {
    const { pathname, hostname } = request.nextUrl;
    // Skip middleware for static files and API routes
    if (pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname.startsWith('/favicon')) {
        return server_1.NextResponse.next();
    }
    // Extract tenant from subdomain
    const tenantSlug = extractTenantFromHostname(hostname);
    // Create response
    const response = server_1.NextResponse.next();
    if (tenantSlug) {
        // Add tenant info to headers for the app to use
        response.headers.set('x-tenant-slug', tenantSlug);
        response.headers.set('x-tenant-detected', 'true');
        // Rewrite to include tenant in the path internally
        const url = request.nextUrl.clone();
        url.pathname = `/tenant/${tenantSlug}${pathname}`;
        return server_1.NextResponse.rewrite(url);
    }
    // No tenant detected - redirect to main site or show tenant selector
    if (hostname !== 'localhost' && !hostname.includes('127.0.0.1')) {
        // In production, redirect to main site
        const mainSiteUrl = new URL('https://stratoai.org');
        return server_1.NextResponse.redirect(mainSiteUrl);
    }
    return response;
}
/**
 * Extract tenant slug from hostname
 */
function extractTenantFromHostname(hostname) {
    // Skip localhost and IP addresses
    if (hostname === 'localhost' || hostname.includes('127.0.0.1') || hostname.includes('192.168')) {
        return null;
    }
    // Extract subdomain from hostname
    const parts = hostname.split('.');
    // Need at least 3 parts for subdomain (subdomain.domain.tld)
    if (parts.length < 3) {
        return null;
    }
    const subdomain = parts[0];
    // Skip common subdomains
    const skipSubdomains = ['www', 'api', 'app', 'admin', 'mail', 'ftp'];
    if (skipSubdomains.includes(subdomain)) {
        return null;
    }
    // Validate subdomain format
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
        return null;
    }
    return subdomain;
}
exports.config = {
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
