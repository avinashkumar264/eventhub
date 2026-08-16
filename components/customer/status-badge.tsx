import type { EventStatus } from "@prisma/client";

const STATUS_STYLE: Record<EventStatus, string> = {
  DRAFT: "bg-ink/10 text-ink/70",
  OPEN: "bg-sage/15 text-sage",
  QUOTATIONS_RECEIVED: "bg-gold/20 text-ink",
  BOOKED: "bg-plum/15 text-plum",
  COMPLETED: "bg-ink/10 text-ink/70",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<EventStatus, string> = {
  DRAFT: "Draft",
  OPEN: "Open",
  QUOTATIONS_RECEIVED: "Quotations received",
  BOOKED: "Booked",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
