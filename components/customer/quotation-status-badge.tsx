import type { QuotationStatus } from "@prisma/client";

const STATUS_STYLE: Record<QuotationStatus, string> = {
  DRAFT: "bg-ink/10 text-ink/70",
  SUBMITTED: "bg-gold/20 text-ink",
  EXPIRED: "bg-ink/10 text-ink/50",
  WITHDRAWN: "bg-ink/10 text-ink/50",
  ACCEPTED: "bg-sage/20 text-sage",
  REJECTED: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<QuotationStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  EXPIRED: "Expired",
  WITHDRAWN: "Withdrawn",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export function QuotationStatusBadge({ status }: { status: QuotationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
