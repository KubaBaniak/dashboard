import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_COOKIE = "accessToken";
const DASHBOARD_PATH = "/dashboard";
const LOGIN_PATH = "/auth/login";

async function hasValidSession(req: NextRequest): Promise<boolean> {
  if (!req.cookies.get(AUTH_COOKIE)?.value) return false;

  try {
    const VERIFY_URL = process.env.AUTH_VERIFY_URL!;
    const res = await fetch(VERIFY_URL, {
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
