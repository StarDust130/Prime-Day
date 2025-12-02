import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const userCookie = request.cookies.get("prime_user");
  const { pathname } = request.nextUrl;

  let userData = null;
  if (userCookie) {
    try {
      userData = JSON.parse(userCookie.value);
    } catch {
      // Invalid cookie
    }
  }

  const isLoggedIn = !!userData?.userId;
  const hasOnboarded = !!userData?.hasOnboarded;

  if (!isLoggedIn) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/onboarding") ||
      pathname.startsWith("/habits") ||
      pathname.startsWith("/accounts")  ||
      pathname.startsWith("/friends") ||
      pathname.startsWith("/stats") ||
      pathname.startsWith("/goals") ||
      pathname.startsWith("/create") ||
      pathname.startsWith("/more")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/auth") || pathname === "/") {
    if (hasOnboarded) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (pathname.startsWith("/onboarding")) {
    if (hasOnboarded) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!hasOnboarded) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
