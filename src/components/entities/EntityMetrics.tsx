interface Metric {
  label: string;
  value: string | number;
}

interface Props {
  metrics: Metric[];
}

export default function EntityMetrics({
  metrics,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-xl border bg-background p-5"
        >
          <p className="text-sm text-muted-foreground">
            {metric.label}
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            {metric.value}
          </h3>
        </div>
      ))}

    </div>
  );
}