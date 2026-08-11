import type { CRMAnalytics } from "@/services/analytics";

type ExecutiveSummaryCardProps = {
  metrics: CRMAnalytics;
};

function formatCount(value: number | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString("en-IN")
    : "—";
}

function formatRevenue(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ExecutiveSummaryCard({
  metrics,
}: ExecutiveSummaryCardProps) {
  const items = [
    {
      label: "Total Leads",
      value: formatCount(metrics.overview.totalLeads),
      description: "Active sales opportunities",
    },
    {
      label: "Active Clients",
      value: formatCount(metrics.overview.activeClients),
      description: "Current customer relationships",
    },
    {
      label: "Active Projects",
      value: formatCount(metrics.overview.activeProjects),
      description: "Running business engagements",
    },
    {
      label: "Total Revenue",
      value: formatRevenue(metrics.revenue.totalRevenue),
      description: "Recorded revenue performance",
    },
  ];

  return (
    <section
      aria-labelledby="executive-summary-title"
      className="
        min-w-0
        rounded-2xl
        border
        border-white/10
        bg-slate-950/80
        p-5
        shadow-xl
        shadow-black/20
        transition-all
        duration-300
        hover:border-amber-300/30
        sm:p-6
      "
    >
      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-amber-300
            "
          >
            Executive Overview
          </p>


          <h2
            id="executive-summary-title"
            className="
              mt-2
              text-xl
              font-black
              tracking-tight
              text-white
            "
          >
            Executive Summary
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-400
            "
          >
            Current business performance snapshot.
          </p>

        </div>


        <span
          aria-hidden="true"
          className="
            mt-2
            h-2.5
            w-2.5
            shrink-0
            rounded-full
            bg-amber-300
            shadow-[0_0_12px_rgba(252,211,77,0.45)]
          "
        />

      </div>


      <div
        className="
          mt-6
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {items.map((item) => (

          <div
            key={item.label}
            className="
              min-w-0
              rounded-2xl
              border
              border-white/10
              bg-white/[0.04]
              p-4
              transition-all
              duration-200
              hover:bg-white/[0.07]
            "
          >

            <p
              className="
                whitespace-normal
                text-xs
                font-bold
                uppercase
                leading-5
                tracking-wide
                text-slate-400
              "
            >
              {item.label}
            </p>


            <p
              className="
                mt-3
                whitespace-normal
                break-words
                text-2xl
                font-black
                tracking-tight
                text-white
                sm:text-3xl
              "
            >
              {item.value}
            </p>


            <p
              className="
                mt-2
                text-xs
                leading-relaxed
                text-slate-500
              "
            >
              {item.description}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}