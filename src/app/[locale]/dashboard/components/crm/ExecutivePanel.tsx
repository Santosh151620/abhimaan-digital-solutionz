import KPICard from "@/components/dashboard/KPICard";
import type {
  ExecutiveSnapshot,
  ExecutiveAction,
  ExecutiveAlert,
} from "@/services/crm/executive-intelligence";

interface Props {
  executive: ExecutiveSnapshot;
}

const alertColors: Record<
  ExecutiveAlert["severity"],
  string
> = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-slate-400",
};

const actionColors: Record<
  ExecutiveAction["priority"],
  string
> = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-emerald-400",
};

export default function ExecutivePanel({
  executive,
}: Props) {
  return (
    <section className="space-y-6">

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-2xl font-semibold">
              Executive Intelligence
            </h2>

            <p className="mt-2 text-slate-400">
              {executive.summary}
            </p>
          </div>

          <KPICard
            title="Business Momentum"
            value={executive.momentum.replace(
              "_",
              " "
            )}
            valueClassName="text-cyan-400"
            className="min-w-[220px]"
          />

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

          <h3 className="mb-4 text-lg font-semibold">
            Executive Alerts
          </h3>

          <div className="space-y-3">

            {executive.alerts.length === 0 ? (
              <p className="text-sm text-slate-500">
                No alerts.
              </p>
            ) : (
              executive.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex justify-between rounded-lg border border-slate-800 p-3"
                >
                  <span>{alert.title}</span>

                  <span
                    className={`text-sm font-semibold uppercase ${alertColors[alert.severity]}`}
                  >
                    {alert.severity}
                  </span>
                </div>
              ))
            )}

          </div>

        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

          <h3 className="mb-4 text-lg font-semibold">
            Recommended Actions
          </h3>

          <div className="space-y-3">

            {executive.actions.map((action) => (
              <div
                key={action.id}
                className="flex justify-between rounded-lg border border-slate-800 p-3"
              >
                <span>{action.title}</span>

                <span
                  className={`text-sm font-semibold uppercase ${actionColors[action.priority]}`}
                >
                  {action.priority}
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}