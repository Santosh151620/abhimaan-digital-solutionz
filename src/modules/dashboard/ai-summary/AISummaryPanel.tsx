"use client";

import { aiSummary } from "./data";

export default function AISummaryPanel() {
    return (
        <section
            aria-labelledby="ai-summary-heading"
            className="
                min-w-0
                overflow-hidden
                rounded-2xl
                border
                border-amber-300/10
                bg-slate-950/70
                p-5
                shadow-xl
                shadow-black/10
            "
        >

            <div className="mb-5">

                <p
                    className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-amber-300
                    "
                >
                    Executive Intelligence
                </p>


                <h3
                    id="ai-summary-heading"
                    className="
                        mt-1
                        text-base
                        font-semibold
                        text-white
                    "
                >
                    AI Executive Summary
                </h3>


                <p
                    className="
                        mt-1
                        text-xs
                        leading-5
                        text-slate-400
                    "
                >
                    AI interpretation of business signals,
                    risks, and recommended attention areas.
                </p>

            </div>



            <div
                className="
                    rounded-xl
                    border
                    border-amber-300/10
                    bg-white/[0.03]
                    p-4
                "
            >

                <p
                    className="
                        text-sm
                        font-semibold
                        leading-6
                        text-white
                    "
                >
                    {aiSummary.headline}
                </p>


                <p
                    className="
                        mt-3
                        text-xs
                        leading-relaxed
                        text-slate-400
                    "
                >
                    This summary is generated from available
                    business signals to help leadership
                    understand priorities, opportunities,
                    and possible risks.
                </p>


                <button
                    type="button"
                    className="
                        mt-4
                        text-xs
                        font-semibold
                        text-amber-300
                        hover:text-amber-200
                    "
                >
                    Read More →
                </button>

            </div>



            {aiSummary.insights.length === 0 ? (

                <div
                    className="
                        mt-4
                        rounded-xl
                        border
                        border-dashed
                        border-white/10
                        bg-white/[0.02]
                        px-4
                        py-6
                        text-center
                    "
                >

                    <p
                        className="
                            text-sm
                            text-slate-500
                        "
                    >
                        No additional AI insights available.
                    </p>

                </div>

            ) : (

                <div
                    className="
                        mt-4
                        space-y-3
                    "
                >

                    {aiSummary.insights.map(
                        (item) => (

                            <article
                                key={item}
                                className="
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    px-4
                                    py-3
                                    text-sm
                                    leading-6
                                    text-slate-300
                                    transition-all
                                    hover:border-amber-300/30
                                    hover:bg-white/[0.05]
                                "
                            >

                                {item}

                            </article>

                        ),
                    )}

                </div>

            )}

        </section>
    );
}