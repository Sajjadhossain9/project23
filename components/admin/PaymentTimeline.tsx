import type { PaymentEvent } from "@/lib/payments/types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

export function PaymentTimeline({ events }: { events: PaymentEvent[] }) {
  if (events.length === 0) {
    return <p className="text-body-sm text-fg-tertiary">No events yet.</p>;
  }

  // Render newest first so the current state is at the top
  const sorted = [...events].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <ol className="space-y-4" role="list">
      {sorted.map((event, index) => (
        <li key={event.id} className="relative pl-5">
          {/* Connector line */}
          {index < sorted.length - 1 && (
            <span
              className="absolute left-[5px] top-3 bottom-[-1rem] w-px bg-border-subtle"
              aria-hidden="true"
            />
          )}
          {/* Dot */}
          <span
            className={`absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full ${dotColor(event.toStatus)}`}
            aria-hidden="true"
          />

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <PaymentStatusBadge status={event.toStatus} />
              <span className="text-caption text-fg-tertiary">via {event.source}</span>
            </div>
            <p className="text-caption text-fg-tertiary tabular-nums">
              {formatTime(event.createdAt)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function dotColor(status: string): string {
  if (status === "succeeded") return "bg-success";
  if (status === "failed" || status === "expired") return "bg-danger";
  if (status === "refunded") return "bg-warning";
  if (status === "processing") return "bg-accent";
  return "bg-fg-tertiary";
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-BD", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
