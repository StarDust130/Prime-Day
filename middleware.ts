import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Get the user cookie
  const userCookie = request.cookies.get("prime_user");
  const { pathname } = request.nextUrl;

  // Helper: Parse cookie if it exists
  let userData = null;
  if (userCookie) {
    try {
      userData = JSON.parse(userCookie.value);
    } catch (e) {
      // Invalid cookie
    }
  }

  const isLoggedIn = !!userData?.userId;
  const hasOnboarded = !!userData?.hasOnboarded;

  // --- SCENARIO 1: User is NOT logged in ---
  if (!isLoggedIn) {
    // If trying to access PROTECTED routes, kick to /auth
    // CHANGE: Removed 'pathname === "/"' so users can see the landing page
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/onboarding")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Allow access to / (Landing Page) and /auth (Login)
    return NextResponse.next();
  }

  // --- SCENARIO 2: User IS logged in ---

  // A. If on /auth OR / (Root)
  // Logic: If I am logged in, don't show me the landing page or login page,
  // take me straight to the app.
  if (pathname.startsWith("/auth") || pathname === "/") {
    // If they finished onboarding -> Dashboard
    if (hasOnboarded) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // If they haven't -> Onboarding
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // B. If on /onboarding
  if (pathname.startsWith("/onboarding")) {
    // If already finished, don't let them do it again -> Dashboard
    if (hasOnboarded) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // C. If on /dashboard
  if (pathname.startsWith("/dashboard")) {
    // If NOT finished onboarding, force them to finish -> Onboarding
    if (!hasOnboarded) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
