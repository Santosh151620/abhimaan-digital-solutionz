import type { ReactNode } from "react";

interface CRMPageLayoutProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function CRMPageLayout({
  title,
  subtitle,
  actions,
  children,
  className = "",
  contentClassName = "",
}: CRMPageLayoutProps) {
  const hasHeader = Boolean(title || subtitle || actions);

  return (
    <main
      className={[
        "crm-page min-w-0 w-full max-w-full",
        "animate-in fade-in duration-300",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto w-full max-w-[1800px] min-w-0">
        {hasHeader && (
          <header
            className={[
              "mb-5 w-full min-w-0",
              "rounded-2xl border border-white/10",
              "bg-slate-950/55",
              "backdrop-blur-xl",
              "shadow-lg shadow-black/10",
            ].join(" ")}
          >
            <div
              className={[
                "flex min-w-0 flex-col gap-4",
                "px-4 py-4 sm:px-5 sm:py-5",
                "md:px-6 md:py-5",
                "lg:flex-row lg:items-center lg:justify-between",
                "xl:px-7",
              ].join(" ")}
            >
              <div className="min-w-0 flex-1">
                {title && (
                  <h1
                    className={[
                      "truncate font-bold tracking-tight text-white",
                      "text-xl sm:text-2xl lg:text-3xl",
                    ].join(" ")}
                  >
                    {title}
                  </h1>
                )}

                {subtitle && (
                  <p
                    className={[
                      "mt-1.5 max-w-3xl",
                      "text-xs leading-relaxed text-slate-400",
                      "sm:text-sm",
                    ].join(" ")}
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              {actions && (
                <div
                  className={[
                    "flex min-w-0 shrink-0 flex-wrap items-center",
                    "gap-2 sm:gap-3",
                    "lg:justify-end",
                  ].join(" ")}
                >
                  {actions}
                </div>
              )}
            </div>
          </header>
        )}

        <section
          className={[
            "min-w-0 w-full",
            "space-y-5 sm:space-y-6",
            contentClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </section>
      </div>
    </main>
  );
}
