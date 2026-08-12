"use client";

import { useMemo } from "react";

export default function WelcomeBanner() {
    const greeting = useMemo(() => {
        const hour = new Date().getHours();

        if (hour < 12) {
            return "Good Morning";
        }

        if (hour < 17) {
            return "Good Afternoon";
        }

        return "Good Evening";
    }, []);

    return (
        <section
            aria-labelledby="crm-welcome-title"
            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-[#111111]
                p-6
                shadow-xl
                shadow-black/20
                sm:p-8
                lg:p-10
            "
        >
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-amber-300/10
                    via-transparent
                    to-black/30
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-64
                    w-64
                    rounded-full
                    bg-amber-300/[0.04]
                    blur-3xl
                "
            />

            <div className="relative max-w-4xl">
                <p
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-amber-300
                        sm:text-sm
                        sm:tracking-[0.25em]
                    "
                >
                    {greeting}
                </p>

                <h1
                    id="crm-welcome-title"
                    className="
                        mt-3
                        text-3xl
                        font-black
                        tracking-tight
                        text-white
                        sm:text-4xl
                        lg:text-5xl
                    "
                >
                    Welcome to CRM Workspace
                </h1>

                <p
                    className="
                        mt-4
                        max-w-3xl
                        text-sm
                        leading-6
                        text-slate-300
                        sm:mt-5
                        sm:text-base
                        sm:leading-relaxed
                        lg:text-lg
                    "
                >
                    Manage customers, sales pipeline, revenue,
                    activities, projects, contracts, and business
                    operations from one intelligent workspace.
                </p>

                <div
                    aria-hidden="true"
                    className="
                        mt-7
                        h-px
                        w-full
                        bg-gradient-to-r
                        from-transparent
                        via-amber-300/40
                        to-transparent
                        sm:mt-8
                    "
                />
            </div>
        </section>
    );
}