"use client";

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

const priorityStyles = {
  high: "border-red-500/40 bg-red-500/10 text-red-400",
  medium:
    "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  low: "border-slate-700 bg-slate-800/30 text-slate-300",
};

const icons = {
  call: "📞",
  follow_up: "🔁",
  deal: "💰",
  task: "📝",
};

export default function TodayWorkPanel({
  items = [],
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          Today&apos;s Work
        </h2>

        <p className="text-sm text-slate-400">
          Recommended actions for today
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
          Nothing pending.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 ${
                priorityStyles[item.priority]
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <span className="text-lg">
                    {icons[item.type]}
                  </span>

                  <div>
                    <p className="font-medium text-white">
                      {item.title}
                    </p>

                    {item.description && (
                      <p className="mt-1 text-xs text-slate-400">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-[10px] uppercase tracking-wider">
                  {item.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}