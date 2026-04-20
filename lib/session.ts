/**
 * Session helpers that require DB access. Must run in node runtime
 * (server components, server actions, API routes) — NOT in edge middleware.
 *
 * Middleware uses a lightweight JWT-only check (see middleware.ts). These
 * functions add the server-side session-row lookup that lets us revoke.
 */

import "server-only";
import { redirect } from "next/navigation";
import { readSessionCookie, verifySessionJwt } from "./auth";
import { prisma } from "./prisma";
import type { User } from "@prisma/client";

export interface AuthenticatedSession {
  user: Pick<User, "id" | "email" | "name" | "role">;
  sessionId: string;
}

/**
 * Returns the current session if valid, otherwise null.
 * Use in pages that show different UI to logged-in vs. guest users.
 */
export async function getSession(): Promise<AuthenticatedSession | null> {
  const token = await readSessionCookie();
  if (!token) return null;

  const payload = await verifySessionJwt(token);
  if (!payload) return null;

  // Verify the session row still exists and hasn't expired — this is the
  // revocation check that JWT-only auth skips.
  const session = await prisma.session.findUnique({
    where: { id: payload.sid },
    include: {
      user: { select: { id: true, email: true, name: true, role: true, active: true } },
    },
  });

  if (!session || session.expiresAt < new Date()) return null;
  if (!session.user.active) return null;

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    },
    sessionId: session.id,
  };
}

/**
 * Redirects to /admin/login if not authenticated.
 * Use at the top of every admin server component.
 */
export async function requireSession(): Promise<AuthenticatedSession> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/**
 * Requires admin role. Editors get a 403-style redirect.
 */
export async function requireAdmin(): Promise<AuthenticatedSession> {
  const session = await requireSession();
  if (session.user.role !== "admin") redirect("/admin?error=forbidden");
  return session;
}
