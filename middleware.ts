import { NextResponse, type NextRequest } from "next/server";
import { verifySessionJwt, SESSION_COOKIE_NAME } from "@/lib/auth";

/**
 * Edge middleware — protects /admin/*.
 *
 * This is a lightweight JWT-only check (no DB) so it runs at the edge with
 * sub-millisecond latency. Full session-row verification (revocation, user
 * active status) happens inside server components via requireSession() —
 * that's the belt-and-suspenders we need for admin pages.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login page is public; everything else under /admin is protected.
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return redirectToLogin(req);

  const payload = await verifySessionJwt(token);
  if (!payload) return redirectToLogin(req);

  // Pass the user id down to route handlers via request header — lets server
  // components skip a cookie read if they only need the id for audit logs.
  const res = NextResponse.next();
  res.headers.set("x-user-id", payload.sub);
  res.headers.set("x-user-role", payload.role);
  return res;
}

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  // Preserve the target so we can redirect after login
  if (req.nextUrl.pathname !== "/admin") {
    url.searchParams.set("next", req.nextUrl.pathname);
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
