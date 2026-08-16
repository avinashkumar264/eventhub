import type { LeadStatus } from "@prisma/client";

const STATUS_STYLE: Record<LeadStatus, string> = {
  NEW: "bg-gold/20 text-ink",
  CONTACTED: "bg-sage/15 text-sage",
  QUALIFIED: "bg-plum/15 text-plum",
  CONVERTED: "bg-sage/25 text-sage",
  LOST: "bg-ink/10 text-ink/60",
};

const STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  CONVERTED: "Converted",
  LOST: "Lost",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
