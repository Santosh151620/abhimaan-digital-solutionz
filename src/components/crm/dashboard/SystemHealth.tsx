interface SystemHealthItem {
    name: string;
    status: string;
    tone: "success" | "warning" | "error";
}

const items: SystemHealthItem[] = [
    {
        name: "API",
        status: "Operational",
        tone: "success",
    },
    {
        name: "Database",
        status: "Healthy",
        tone: "success",
    },
    {
        name: "Storage",
        status: "Healthy",
        tone: "success",
    },
    {
        name: "Email",
        status: "Connected",
        tone: "success",
    },
    {
        name: "Backup",
        status: "Running",
        tone: "success",
    },
];

const toneClasses: Record<
    SystemHealthItem["tone"],
    {
        dot: string;
        badge: string;
        text: string;
    }
> = {
    success: {
        dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
        badge:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        text: "text-emerald-700",
    },
    warning: {
        dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
        badge:
            "border-amber-200 bg-amber-50 text-amber-700",
        text: "text-amber-700",
    },
    error: {
        dot: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
        badge:
            "border-red-200 bg-red-50 text-red-700",
        text: "text-red-700",
    },
};

export default function SystemHealth() {
    return (
        <section
            aria-labelledby="system-health-title"
            className="
                overflow-hidden
                rounded-3xl
                border
                border-amber-200/40
                bg-gradient-to-br
                from-white
                via-[#faf7f0]
                to-[#e7dcc8]
                p-5
                shadow-xl
                sm:p-6
            "
        >
            <div className="mb-6">
                <h2
                    id="system-health-title"
                    className="
                        text-xl
                        font-black
                        tracking-tight
                        text-slate-900
                    "
                >
                    System Health
                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    Platform service availability
                </p>
            </div>

            <div
                className="space-y-3"
                role="list"
                aria-label="Platform service status"
            >
                {items.map((item) => {
                    const tone = toneClasses[item.tone];

                    return (
                        <div
                            key={item.name}
                            role="listitem"
                            className="
                                flex
                                min-h-14
                                items-center
                                justify-between
                                gap-4
                                rounded-2xl
                                border
                                border-white/70
                                bg-white/60
                                px-4
                                py-3
                                transition-all
                                duration-200
                                hover:bg-white
                                hover:shadow-sm
                            "
                        >
                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-3
                                "
                            >
                                <span
                                    aria-hidden="true"
                                    className={`
                                        h-2.5
                                        w-2.5
                                        shrink-0
                                        rounded-full
                                        ${tone.dot}
                                    `}
                                />

                                <span
                                    className="
                                        truncate
                                        font-semibold
                                        text-slate-800
                                    "
                                >
                                    {item.name}
                                </span>
                            </div>

                            <span
                                className={`
                                    shrink-0
                                    rounded-full
                                    border
                                    px-3
                                    py-1
                                    text-xs
                                    font-bold
                                    ${tone.badge}
                                `}
                            >
                                {item.status}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}