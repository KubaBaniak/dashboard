import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_COOKIE = "accessToken";
const DASHBOARD_PATH = "/dashboard";
const LOGIN_PATH = "/auth/login";

async function hasValidSession(req: NextRequest): Promise<boolean> {
  // fast path
  if (!req.cookies.get(AUTH_COOKIE)?.value) return false;

  try {
    // Build a same-origin URL so it goes through Next's rewrite proxy
    const verifyUrl = new URL("/api/auth/me", req.url);

    const res = await fetch(verifyUrl.toString(), {
      headers: { cookie: req.headers.get("cookie") ?? "" },
      cache: "no-store",
    });

    return res.ok;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Don’t gate API and preflights with auth middleware
  if (req.method === "OPTIONS" || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const needsAuthCheck =
    pathname === "/" ||
    pathname.startsWith(DASHBOARD_PATH) ||
    pathname.startsWith("/auth");

  if (!needsAuthCheck) return NextResponse.next();

  const isRoot = pathname === "/";
  const isDashboard = pathname.startsWith(DASHBOARD_PATH);
  const isAuthRoute = pathname.startsWith("/auth");

  const authenticated = await hasValidSession(req);

  if (isRoot) {
    const url = req.nextUrl.clone();
    url.pathname = authenticated ? DASHBOARD_PATH : LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  if (isDashboard && !authenticated) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && authenticated) {
    const url = req.nextUrl.clone();
    url.pathname = DASHBOARD_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
};
