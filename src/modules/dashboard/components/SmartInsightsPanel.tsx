type Insight = {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
};

const insights: Insight[] = [
  {
    title: "Follow-up Opportunities",
    description: "Leads without recent activity require attention.",
    priority: "High",
  },
  {
    title: "Pipeline Monitoring",
    description: "Review deals approaching expected closure dates.",
    priority: "Medium",
  },
  {
    title: "CRM Data Quality",
    description: "Complete missing customer information for better insights.",
    priority: "Low",
  },
];

export default function SmartInsightsPanel() {
  return (
    <section className="rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Smart CRM Insights
        </h2>
        <p className="text-sm text-slate-400">
          Recommended actions to improve sales performance.
        </p>
      </div>

      <div className="space-y-3">
        {insights.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                {item.title}
              </h3>

              <span className="text-xs text-emerald-400">
                {item.priority}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}






