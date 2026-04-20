"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle, Lock, Mail } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/Button";

const errorMessages: Record<string, string> = {
  forbidden: "You don't have permission to access that page.",
};

export function LoginForm({
  next,
  initialError,
}: {
  next?: string;
  initialError?: string;
}) {
  const initialState: LoginState = initialError
    ? { error: errorMessages[initialError] ?? "Something went wrong." }
    : {};
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <Link href="/" className="inline-flex items-center gap-2 mb-8">
        <LogoMark />
        <span className="text-h4 font-semibold tracking-tight text-fg">Wevnix</span>
      </Link>

      <div className="bg-bg-surface border border-border-subtle rounded-lg p-6 sm:p-8 shadow-elev-1">
        <h1 className="text-h2 text-fg">Sign in</h1>
        <p className="mt-2 text-body-sm text-fg-secondary">
          Admin access only. Questions?{" "}
          <a href="mailto:admin@wevnix.com" className="text-accent hover:underline">
            Email an admin
          </a>
          .
        </p>

        {state?.error && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-2 rounded-md border border-danger/30 bg-danger/5 p-3 text-body-sm text-danger"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="mt-6 space-y-4" noValidate>
          <input type="hidden" name="next" value={next ?? "/admin"} />

          <div>
            <label htmlFor="email" className="block text-caption text-fg-secondary mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-tertiary pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                spellCheck="false"
                className="w-full h-11 pl-10 pr-3 bg-bg border border-border-default rounded-md text-body text-fg placeholder:text-fg-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors"
                placeholder="admin@wevnix.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-caption text-fg-secondary mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-tertiary pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full h-11 pl-10 pr-3 bg-bg border border-border-default rounded-md text-body text-fg placeholder:text-fg-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <SubmitButton />
        </form>
      </div>

      <p className="mt-6 text-center text-caption text-fg-tertiary">
        Protected area · Activity is logged
      </p>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="md" fullWidth disabled={pending}>
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect width="28" height="28" rx="7" className="fill-brand" />
      <path
        d="M8 10l3 8 3-6 3 6 3-8"
        stroke="rgb(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
