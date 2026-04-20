"use server";

/**
 * Login action — used by /admin/login.
 *
 * Without a DB (the default for this starter), this falls back to env-var
 * credentials so you can log in before setting up Prisma. With Prisma, it
 * validates against the User table and creates a Session row.
 */

import { redirect } from "next/navigation";
import {
  hashPassword,
  verifyPassword,
  signSessionJwt,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // ---- Try Prisma first; fall back to env credentials for the starter ----
  let userId: string | null = null;
  let role: "admin" | "editor" = "admin";
  let sessionId: string | null = null;

  try {
    // Dynamic import so the file works before Prisma is installed.
    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.active && (await verifyPassword(password, user.passwordHash))) {
      userId = user.id;
      role = user.role;
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      sessionId = session.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    }
  } catch {
    // Prisma not installed / DB not reachable — fall through to env fallback.
  }

  // ---- Env-var fallback (remove once Prisma is wired) ----
  if (!userId) {
    const envEmail = (process.env.ADMIN_EMAIL ?? "admin@wevnix.com").toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD;
    if (!envPassword) {
      return { error: "Admin credentials aren't configured." };
    }
    if (email === envEmail && password === envPassword) {
      userId = "env-admin";
      role = "admin";
      sessionId = `env-${Date.now()}`;
    }
  }

  if (!userId || !sessionId) {
    // Generic message — don't leak whether the email exists
    return { error: "Invalid email or password." };
  }

  const token = await signSessionJwt({ sub: userId, sid: sessionId, role });
  await setSessionCookie(token);

  // Only allow relative next paths — block open-redirect attacks
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
  redirect(safeNext);
}

export async function logoutAction() {
  const token = (await import("@/lib/auth")).readSessionCookie;
  const raw = await token();
  if (raw) {
    try {
      const { verifySessionJwt } = await import("@/lib/auth");
      const payload = await verifySessionJwt(raw);
      if (payload?.sid && !payload.sid.startsWith("env-")) {
        const { prisma } = await import("@/lib/prisma");
        await prisma.session.delete({ where: { id: payload.sid } }).catch(() => {});
      }
    } catch {
      // Ignore — we're logging out anyway
    }
  }
  await clearSessionCookie();
  redirect("/admin/login");
}

// Exposed for seeding/scripts
export { hashPassword };
