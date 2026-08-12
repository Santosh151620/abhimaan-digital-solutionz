import { customerSuccess } from "./data";

export default function CustomerSuccessPanel() {
    return (
        <section
            aria-labelledby="customer-success-heading"
            className="
                min-w-0
                overflow-hidden
                rounded-2xl
                border
                border-amber-300/10
                bg-slate-950/70
                shadow-xl
                shadow-black/10
            "
        >
            <div className="border-b border-white/10 px-5 py-4">
                <div className="flex items-center justify-between gap-4">

                    <div className="min-w-0">

                        <p
                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.18em]
                                text-amber-300
                            "
                        >
                            Customer Intelligence
                        </p>

                        <h3
                            id="customer-success-heading"
                            className="
                                mt-1
                                text-base
                                font-semibold
                                text-white
                            "
                        >
                            Customer Success
                        </h3>

                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-slate-400
                            "
                        >
                            Key indicators for customer health,
                            retention, engagement, and relationship quality.
                        </p>

                    </div>


                    <span
                        className="
                            shrink-0
                            rounded-full
                            border
                            border-amber-300/20
                            bg-amber-300/10
                            px-2.5
                            py-1
                            text-[10px]
                            font-medium
                            text-amber-200
                        "
                    >
                        Live
                    </span>

                </div>
            </div>


            {customerSuccess.length === 0 ? (

                <div
                    className="
                        m-4
                        rounded-xl
                        border
                        border-dashed
                        border-white/10
                        bg-white/[0.02]
                        px-4
                        py-8
                        text-center
                    "
                >
                    <p className="text-sm text-slate-500">
                        No customer success data available.
                    </p>
                </div>

            ) : (

                <div
                    className="
                        grid
                        min-w-0
                        gap-4
                        p-4
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    {customerSuccess.map((item) => (

                        <article
                            key={item.metric}
                            className="
                                group
                                min-w-0
                                rounded-xl
                                border
                                border-white/10
                                bg-white/[0.03]
                                p-4
                                transition-all
                                hover:border-amber-300/30
                                hover:bg-white/[0.05]
                            "
                        >

                            <p
                                className="
                                    whitespace-normal
                                    text-xs
                                    font-semibold
                                    uppercase
                                    leading-5
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                {item.metric}
                            </p>


                            <p
                                className="
                                    mt-2
                                    break-words
                                    text-2xl
                                    font-black
                                    tracking-tight
                                    tabular-nums
                                    text-white
                                "
                            >
                                {item.value}
                            </p>


                            <p
                                className="
                                    mt-3
                                    text-xs
                                    leading-relaxed
                                    text-slate-400
                                "
                            >
                                This indicator helps evaluate customer
                                health, retention risk, and engagement
                                quality so the team can prioritize
                                relationship actions.
                            </p>


                            <button
                                type="button"
                                className="
                                    mt-4
                                    text-xs
                                    font-semibold
                                    text-amber-300
                                    transition-colors
                                    hover:text-amber-200
                                    focus-visible:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-amber-300/50
                                    focus-visible:ring-offset-2
                                    focus-visible:ring-offset-slate-950
                                "
                            >
                                Read More →
                            </button>

                        </article>

                    ))}

                </div>

            )}
        </section>
    );
}
