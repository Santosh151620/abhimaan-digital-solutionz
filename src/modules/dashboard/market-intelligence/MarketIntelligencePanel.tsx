"use client";

import { marketIntelligence } from "./data";

export default function MarketIntelligencePanel() {
    return (
        <section
            aria-labelledby="market-intelligence-title"
            className="
                rounded-2xl
                border
                border-amber-300/10
                bg-slate-950/70
                p-5
                shadow-xl
            "
        >

            <div
                className="
                    mb-5
                    flex
                    items-center
                    justify-between
                    gap-4
                "
            >

                <div>

                    <h3
                        id="market-intelligence-title"
                        className="
                            text-lg
                            font-bold
                            text-white
                        "
                    >
                        Market Intelligence
                    </h3>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-400
                        "
                    >
                        External market signals and business opportunities.
                    </p>

                </div>


                <span
                    className="
                        rounded-full
                        border
                        border-amber-300/20
                        bg-amber-300/10
                        px-3
                        py-1
                        text-xs
                        text-amber-200
                    "
                >
                    Live Signals
                </span>

            </div>


            {marketIntelligence.length === 0 ? (

                <p
                    className="
                        rounded-xl
                        border
                        border-dashed
                        border-white/10
                        bg-white/[0.03]
                        p-4
                        text-sm
                        text-slate-500
                    "
                >
                    No market intelligence is available right now.
                </p>

            ) : (

                <div
                    className="
                        grid
                        gap-4
                        md:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    {marketIntelligence.map((item) => (

                        <article
                            key={item.title}
                            className="
                                group
                                rounded-xl
                                border
                                border-white/10
                                bg-white/[0.03]
                                p-4
                                transition-all
                                hover:border-amber-300/30
                                hover:bg-white/[0.06]
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                {item.title}
                            </p>


                            <p
                                className="
                                    mt-3
                                    text-2xl
                                    font-black
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
                                This metric represents current market movement
                                and helps identify growth opportunities,
                                customer trends, and strategic decisions.
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