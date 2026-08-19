import type { BookingStatus } from "@prisma/client";

const STATUS_STYLE: Record<BookingStatus, string> = {
  PENDING: "bg-gold/20 text-ink",
  CONFIRMED: "bg-sage/20 text-sage",
  IN_PROGRESS: "bg-plum/15 text-plum",
  COMPLETED: "bg-sage/25 text-sage",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Awaiting advance payment",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
