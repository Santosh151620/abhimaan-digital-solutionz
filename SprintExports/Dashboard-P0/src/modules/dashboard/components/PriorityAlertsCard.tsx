const alerts = [
  "3 leads require follow-up",
  "Pipeline opportunities need review",
  "Customer information completeness can improve",
];

export default function PriorityAlertsCard() {
  return (
    <section className="rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-amber-500/20 bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1">

      <h2 className="text-lg font-semibold text-white">
        Priority Alerts
      </h2>

      <div className="mt-4 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert}
            className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300"
          >
            âš¡ {alert}
          </div>
        ))}
      </div>

    </section>
  );
}

