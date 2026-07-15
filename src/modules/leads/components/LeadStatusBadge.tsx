import type { LeadStatus } from "../types/lead.entity";
interface LeadStatusBadgeProps {
  status: LeadStatus;
}

const statusStyles: Record<
  LeadStatus,
  {
    label: string;
    className: string;
  }
> = {
  new: {
    label: "New",
    className:
      "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  },

  contacted: {
    label: "Contacted",
    className:
      "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
  },

  qualified: {
    label: "Qualified",
    className:
      "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  },

  converted: {
    label: "Converted",
    className:
      "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  },

  lost: {
    label: "Lost",
    className:
      "bg-rose-500/20 text-rose-300 border border-rose-500/30",
  },
};

export default function LeadStatusBadge({
  status,
}: LeadStatusBadgeProps) {
  const config = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}





