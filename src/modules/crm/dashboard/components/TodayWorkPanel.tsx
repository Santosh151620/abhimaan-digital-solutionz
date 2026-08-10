"use client";

import {
  CalendarCheck2,
  CheckCircle2,
  CircleDollarSign,
  Phone,
  UserRound,
} from "lucide-react";

type WorkflowItem = {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  type: "call" | "follow_up" | "deal" | "task";
};

interface Props {
  items?: WorkflowItem[];
}

const priorityStyles: Record<
  WorkflowItem["priority"],
  {
    badge: string;
    dot: string;
    label: string;
  }
> = {
  high: {
    badge: "border-red-400/20 bg-red-400/10 text-red-300",
    dot: "bg-red-400",
    label: "High",
  },
  medium: {
    badge: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
    label: "Medium",
  },
  low: {
    badge: "border-slate-700 bg-slate-800/50 text-slate-300",
    dot: "bg-slate-400",
    label: "Low",
  },
};

const typeConfig: Record<
  WorkflowItem["type"],
  {
    label: string;
    icon: typeof Phone;
  }
> = {
  call: {
    label: "Call",
    icon: Phone,
  },
  follow_up: {
    label: "Follow-up",
    icon: UserRound,
  },
  deal: {
    label: "Deal",
    icon: CircleDollarSign,
  },
  task: {
    label: "Task",
    icon: CalendarCheck2,
  },
};

export default function TodayWorkPanel({ items = [] }: Props) {
  const hasItems = items.length > 0;

  return (
    <section
      aria-labelledby="today-work-title"
      className="min-w-0 rounded-2xl border border-slate-800/90 bg-slate-900/70 p-4 shadow-lg shadow-black/10 sm:p-5"
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
            Daily Priorities
          </p>

          <h2
            id="today-work-title"
            className="mt-1.5 text-base font-semibold tracking-tight text-white sm:text-lg"
          >
            Today&apos;s Work
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Recommended actions for today.
          </p>
        </div>

        <span
          className="shrink-0 rounded-full border border-cyan-400/15 bg-cyan-400/5 px-2.5 py-1 text-[10px] font-semibold text-cyan-300"
          aria-label={`${items.length} actions`}
        >
          {items.length} {items.length === 1 ? "Action" : "Actions"}
        </span>
      </div>

      <div className="mt-4">
        {hasItems ? (
          <div className="divide-y divide-slate-800/80 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/40">
            {items.map((item) => {
              const priority = priorityStyles[item.priority];
              const type = typeConfig[item.type];
              const TypeIcon = type.icon;

              return (
                <div
                  key={item.id}
                  className="group flex min-w-0 flex-col gap-3 px-3 py-3.5 transition-colors duration-200 hover:bg-white/[0.025] sm:flex-row sm:items-center sm:px-4"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.035] text-slate-400 transition-colors group-hover:border-cyan-400/15 group-hover:text-cyan-300">
                      <TypeIcon
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h3 className="min-w-0 truncate text-sm font-semibold text-white">
                          {item.title}
                        </h3>

                        <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                          {type.label}
                        </span>
                      </div>

                      {item.description ? (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                          {item.description}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-slate-600">
                          No additional details available.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 pl-12 sm:pl-0">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${priority.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${priority.dot}`}
                        aria-hidden="true"
                      />
                      {priority.label}
                    </span>

                    <button
                      type="button"
                      aria-label={`Mark ${item.title} as complete`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-600 transition-colors hover:border-emerald-400/15 hover:bg-emerald-400/5 hover:text-emerald-300"
                    >
                      <CheckCircle2
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900">
              <CheckCircle2
                className="h-5 w-5 text-slate-600"
                aria-hidden="true"
              />
            </div>

            <p className="mt-3 text-sm font-medium text-slate-400">
              No actions available
            </p>

            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-600">
              Recommended work will appear here when tasks, follow-ups,
              calls, or deal actions become available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
