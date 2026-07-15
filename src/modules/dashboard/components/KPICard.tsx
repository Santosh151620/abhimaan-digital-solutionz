import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string | number;

  subtitle?: string;

  valueClassName?: string;

  className?: string;

  icon?: ReactNode;

  trend?: {
    value: string;
    positive?: boolean;
  };

  loading?: boolean;

  footer?: ReactNode;

  onClick?: () => void;
}

export default function KPICard({
  title,
  value,
  subtitle,
  valueClassName = "text-white",
  className = "",
  icon,
  trend,
  loading = false,
  footer,
  onClick,
}: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        group
        rounded-xl
        border
        border-slate-800
        bg-slate-900
        p-5
        transition-all
        duration-200
        hover:border-cyan-600
        hover:shadow-lg
        hover:shadow-cyan-950/20
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          {loading ? (
            <div className="mt-3 h-9 w-28 animate-pulse rounded bg-slate-800" />
          ) : (
            <h2
              className={`mt-2 break-words text-3xl font-bold ${valueClassName}`}
            >
              {value}
            </h2>
          )}

          {subtitle && (
            <p className="mt-2 text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-800 bg-slate-800/50 text-slate-300 transition-colors group-hover:border-cyan-700 group-hover:text-cyan-400">
            {icon}
          </div>
        )}
      </div>

      {(trend || footer) && (
        <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
          {trend ? (
            <span
              className={`text-xs font-medium ${
                trend.positive
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {trend.positive ? "?" : "?"} {trend.value}
            </span>
          ) : (
            <span />
          )}

          {footer}
        </div>
      )}
    </div>
  );
}






