import type { ProjectStatus } from "@/modules/projects/types/project";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

const statusStyles: Record<
  ProjectStatus,
  {
    label: string;
    className: string;
  }
> = {
  planning: {
    label: "Planning",
    className:
      "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  },

  active: {
    label: "Active",
    className:
      "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  },

  on_hold: {
    label: "On Hold",
    className:
      "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  },

  completed: {
    label: "Completed",
    className:
      "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  },

  cancelled: {
    label: "Cancelled",
    className:
      "bg-rose-500/20 text-rose-300 border border-rose-500/30",
  },
};

export default function ProjectStatusBadge({
  status,
}: ProjectStatusBadgeProps) {
  const config = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
