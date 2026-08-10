"use client";

export default function WelcomeBanner() {
    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 17
                ? "Good Afternoon"
                : "Good Evening";

    return (
        <section
            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-amber-200/30
                bg-gradient-to-r
                from-[#3b2a1a]
                via-[#8b6b3f]
                to-[#d4c4a8]
                p-8
                text-white
                shadow-2xl
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
                    from-white/10
                    via-transparent
                    to-black/10
                "
            />

            <div className="relative max-w-4xl">

                <p className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-amber-100
                ">
                    {greeting}
                </p>


                <h1 className="
                    mt-3
                    text-3xl
                    font-black
                    tracking-tight
                    sm:text-4xl
                    lg:text-5xl
                ">
                    Welcome to CRM Workspace
                </h1>


                <p className="
                    mt-5
                    max-w-3xl
                    text-base
                    leading-relaxed
                    text-white/85
                    sm:text-lg
                ">
                    Enterprise Business Platform connecting
                    Sales, CRM, Assets, Contracts, Invoices,
                    Support, and Projects — everything together
                    in one intelligent workspace.
                </p>


                <div
                    aria-hidden="true"
                    className="
                        mt-8
                        h-px
                        w-full
                        bg-gradient-to-r
                        from-transparent
                        via-white/40
                        to-transparent
                    "
                />

            </div>

        </section>
    );
}