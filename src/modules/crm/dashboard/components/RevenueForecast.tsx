type RevenueForecastProps = {
  estimatedMonthlyRevenue: number;
  pipelineValue: number;
  winProbability: number;
  averageDealSize: number;
  velocityScore: number;
};

type Card = {
  key: keyof RevenueForecastProps;
  title: string;
  border: string;
  value: string;
  prefix?: string;
  suffix?: string;
};

const cards: readonly Card[] = [
  {
    key: "estimatedMonthlyRevenue",
    title: "Monthly Revenue",
    border: "border-emerald-500/30",
    value: "text-emerald-400",
    prefix: "₹",
  },
  {
    key: "pipelineValue",
    title: "Pipeline Value",
    border: "border-sky-500/30",
    value: "text-sky-400",
    prefix: "₹",
  },
  {
    key: "winProbability",
    title: "Win Probability",
    border: "border-yellow-500/30",
    value: "text-yellow-400",
    suffix: "%",
  },
  {
    key: "averageDealSize",
    title: "Average Deal",
    border: "border-purple-500/30",
    value: "text-purple-400",
    prefix: "₹",
  },
  {
    key: "velocityScore",
    title: "Velocity",
    border: "border-rose-500/30",
    value: "text-rose-400",
  },
];

function formatValue(
  value: number,
  key: keyof RevenueForecastProps,
): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  if (key === "winProbability") {
    return Math.max(0, Math.min(100, value)).toFixed(0);
  }

  if (key === "velocityScore") {
    return value.toFixed(0);
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RevenueForecast(props: RevenueForecastProps) {
  return (
    <section
      aria-label="Revenue forecast"
      className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      {cards.map((card) => {
        const rawValue = Number(props[card.key]);
        const value = formatValue(rawValue, card.key);

        return (
          <article
            key={card.key}
            className={`min-w-0 rounded-xl border ${card.border} bg-slate-900/70 p-4 shadow-lg shadow-black/5 transition-colors hover:bg-slate-900`}
          >
            <p className="truncate text-sm font-medium text-slate-400">
              {card.title}
            </p>

            <p
              className={`mt-2 truncate text-2xl font-bold tracking-tight ${card.value}`}
            >
              {card.prefix}
              {value}
              {card.suffix}
            </p>
          </article>
        );
      })}
    </section>
  );
}
