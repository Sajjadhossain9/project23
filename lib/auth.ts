/**
 * Auth — password hashing, JWT signing/verification, session cookies.
 *
 * Why jose + bcryptjs:
 *   - jose is edge-runtime compatible (middleware uses edge)
 *   - bcryptjs works in both Node and edge, unlike native `bcrypt`
 *   - JWT in an HTTP-only cookie = no client-side token leakage
 *
 * Session strategy:
 *   - JWT carries { sub (userId), role, sid (sessionId), iat, exp }
 *   - A Session row is created on login and checked server-side by protected
 *     routes/actions — so we can revoke (logout-everywhere, password change)
 *     without waiting for JWT expiry.
 *   - Middleware does JWT verification only (no DB, edge-fast); the
 *     session-row check happens in server components and server actions via
 *     `requireSession()`.
 */

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "wevnix_session";
const JWT_ALG = "HS256";
const SESSION_DAYS = 7;

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must be set and at least 32 characters. Generate one with: openssl rand -base64 48"
    );
  }
  return new TextEncoder().encode(secret);
}

// ---------- Password hashing ----------

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ---------- JWT ----------

export interface SessionPayload extends JWTPayload {
  sub: string; // userId
  sid: string; // sessionId (DB row)
  role: "admin" | "editor";
}

export async function signSessionJwt(payload: Omit<SessionPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

export async function verifySessionJwt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: [JWT_ALG] });
    if (!payload.sub || !payload.sid || !payload.role) return null;
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

// ---------- Cookie helpers (server components / actions only) ----------

export async function setSessionCookie(token: string): Promise<void> {
  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export async function readSessionCookie(): Promise<string | null> {
  const c = await cookies();
  return c.get(COOKIE_NAME)?.value ?? null;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
