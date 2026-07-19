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

export default function RevenueForecast(
  props: RevenueForecastProps
) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-5">
      {cards.map((card) => {
        const value = props[card.key];

        return (
          <div
            key={card.key}
            className={`rounded-xl border ${card.border} bg-slate-900 p-4`}
          >
            <p className="text-sm text-slate-400">
              {card.title}
            </p>

            <p
              className={`mt-2 text-2xl font-bold ${card.value}`}
            >
              {card.prefix}
              {value}
              {card.suffix}
            </p>
          </div>
        );
      })}
    </section>
  );
}