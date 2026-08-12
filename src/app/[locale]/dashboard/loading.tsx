export default function DashboardLoading() {
    return (
        <main
            aria-label="Loading CRM dashboard"
            aria-busy="true"
            className="
                min-h-screen
                space-y-6
                bg-slate-950
                p-4
                text-white
                sm:space-y-8
                sm:p-6
            "
        >
            {/* Dashboard heading */}
            <div className="space-y-3">
                <div
                    aria-hidden="true"
                    className="
                        h-8
                        w-56
                        animate-pulse
                        rounded-xl
                        bg-slate-800
                        sm:h-10
                        sm:w-64
                    "
                />

                <div
                    aria-hidden="true"
                    className="
                        h-4
                        w-80
                        max-w-full
                        animate-pulse
                        rounded-lg
                        bg-slate-900
                    "
                />
            </div>

            {/* KPI cards */}
            <section
                aria-label="Loading dashboard metrics"
                className="
                    grid
                    gap-4
                    sm:gap-6
                    md:grid-cols-2
                    xl:grid-cols-4
                "
            >
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={`kpi-${index}`}
                        aria-hidden="true"
                        className="
                            h-36
                            animate-pulse
                            rounded-2xl
                            border
                            border-slate-800
                            bg-slate-900
                            sm:h-40
                        "
                    />
                ))}
            </section>

            {/* Primary dashboard panel */}
            <section
                aria-label="Loading primary dashboard panel"
                aria-hidden="true"
                className="
                    h-64
                    animate-pulse
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900
                    sm:h-72
                "
            />

            {/* Secondary panels */}
            <section
                aria-label="Loading dashboard panels"
                className="
                    grid
                    gap-4
                    sm:gap-6
                    md:grid-cols-2
                "
            >
                {Array.from({ length: 2 }).map((_, index) => (
                    <div
                        key={`panel-${index}`}
                        aria-hidden="true"
                        className="
                            h-56
                            animate-pulse
                            rounded-2xl
                            border
                            border-slate-800
                            bg-slate-900
                            sm:h-64
                        "
                    />
                ))}
            </section>
        </main>
    );
}