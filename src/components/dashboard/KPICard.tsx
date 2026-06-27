interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  valueClassName?: string;
  className?: string;
}

export default function KPICard({
  title,
  value,
  subtitle,
  valueClassName = "text-white",
  className = "",
}: KPICardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900 p-5 ${className}`}
    >
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${valueClassName}`}
      >
        {value}
      </p>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}