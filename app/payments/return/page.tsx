"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { formatBdt } from "@/lib/utils";

type Status = "pending" | "processing" | "succeeded" | "failed" | "refunded" | "expired";

interface PaymentStatusResponse {
  id: string;
  status: Status;
  amountBdt: number;
  merchantInvoice: string;
  method: string;
  paidAt?: string;
  failureReason?: string;
}

export default function PaymentReturnPage() {
  return (
    <>
      <Header />
      <main id="main" className="min-h-[70vh] py-14 sm:py-20">
        <Container>
          <Inner />
        </Container>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}

function Inner() {
  const params = useSearchParams();
  const paymentId = params.get("paymentId");
  const urlStatus = params.get("status"); // success | fail | cancel — advisory only
  const [payment, setPayment] = useState<PaymentStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId) {
      setError("No payment reference. If you just paid, check your email.");
      return;
    }

    // The gateway redirect fires before the IPN reaches our webhook. Poll for
    // up to 30 seconds — if still pending after that, surface a gentle message.
    let cancelled = false;
    const pollingStart = Date.now();

    async function check() {
      try {
        const res = await fetch(`/api/payments/${paymentId}/status`, { cache: "no-store" });
        if (!res.ok) throw new Error("status unavailable");
        const data = (await res.json()) as PaymentStatusResponse;
        if (cancelled) return;

        setPayment(data);

        // Keep polling if still in a non-terminal state
        const terminal = ["succeeded", "failed", "refunded", "expired"].includes(data.status);
        const elapsed = Date.now() - pollingStart;
        if (!terminal && elapsed < 30_000) {
          setTimeout(check, 2000);
        }
      } catch {
        if (cancelled) return;
        setError("Could not fetch payment status. Refresh in a moment.");
      }
    }
    check();

    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  if (error) {
    return (
      <Panel icon="warn" title="Something went wrong" body={error}>
        <LinkButton href="/pricing" variant="secondary">
          Back to pricing
        </LinkButton>
      </Panel>
    );
  }

  if (!payment) {
    return (
      <Panel icon="pending" title="Confirming your payment…" body="This usually takes a few seconds.">
        <p className="text-caption text-fg-tertiary">Please don&apos;t close this tab.</p>
      </Panel>
    );
  }

  if (payment.status === "succeeded") {
    return (
      <Panel
        icon="success"
        title="Payment received — thank you!"
        body={`We've charged ${formatBdt(payment.amountBdt)} to your ${capitalize(payment.method)}. Our team will reach out on WhatsApp within one business day to start your project.`}
      >
        <div className="bg-bg-raised rounded-md p-4 text-left text-body-sm text-fg-secondary max-w-sm mx-auto">
          <div className="flex justify-between">
            <span>Invoice</span>
            <span className="font-mono">{payment.merchantInvoice}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Amount</span>
            <span className="tabular-nums font-medium text-fg">
              {formatBdt(payment.amountBdt)}
            </span>
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <LinkButton href="/" variant="primary">
            Back to home
          </LinkButton>
          <LinkButton href="/projects" variant="secondary">
            See our work
          </LinkButton>
        </div>
      </Panel>
    );
  }

  if (payment.status === "failed" || payment.status === "expired" || urlStatus === "cancel") {
    return (
      <Panel
        icon="error"
        title={urlStatus === "cancel" ? "Payment cancelled" : "Payment didn't go through"}
        body={
          payment.failureReason ??
          (urlStatus === "cancel"
            ? "You cancelled before completing the payment."
            : "The gateway reported a problem. Your card or wallet was not charged.")
        }
      >
        <div className="mt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <LinkButton href="/pricing" variant="primary">
            Try again
          </LinkButton>
          <LinkButton
            href="https://wa.me/8801700000000?text=I%20had%20trouble%20with%20payment"
            variant="secondary"
          >
            Message us on WhatsApp
          </LinkButton>
        </div>
      </Panel>
    );
  }

  // pending / processing — keep polling
  return (
    <Panel
      icon="pending"
      title="Still confirming…"
      body="Banks occasionally take a few extra seconds. We'll update this page as soon as we hear back."
    >
      <Link
        href="/"
        className="text-body-sm text-fg-secondary hover:text-fg underline underline-offset-2"
      >
        You can safely leave this page — we'll email you.
      </Link>
    </Panel>
  );
}

function Panel({
  icon,
  title,
  body,
  children,
}: {
  icon: "success" | "error" | "pending" | "warn";
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  const Icon =
    icon === "success"
      ? CheckCircle2
      : icon === "error"
      ? XCircle
      : icon === "warn"
      ? AlertCircle
      : Loader2;

  const iconColor =
    icon === "success"
      ? "text-success"
      : icon === "error"
      ? "text-danger"
      : icon === "warn"
      ? "text-warning"
      : "text-fg-tertiary";

  return (
    <div className="max-w-xl mx-auto text-center">
      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-full bg-bg-raised ${iconColor} mb-6`}>
        <Icon size={28} className={icon === "pending" ? "animate-spin" : ""} aria-hidden="true" />
      </div>
      <h1 className="text-h2 text-fg">{title}</h1>
      <p className="mt-3 text-body text-fg-secondary">{body}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
