import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/" ||
    path === "/pricing" ||
    path === "/about" ||
    path === "/contact"

  // Check if the path starts with /dashboard
  const isDashboardPath = path.startsWith("/dashboard")

  // Get the token from the cookies
  const isAuthenticated =
    request.cookies.get("isAuthenticated")?.value === "true" || request.headers.get("x-is-authenticated") === "true"

  // If the user is not authenticated and is trying to access a dashboard page
  if (!isAuthenticated && isDashboardPath) {
    // Redirect to the login page
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is authenticated and is trying to access login or signup
  if (isAuthenticated && (path === "/login" || path === "/signup")) {
    // Redirect to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Otherwise, continue with the request
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard/:path*"],
}
