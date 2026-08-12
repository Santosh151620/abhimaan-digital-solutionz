"use client";

type DashboardErrorProps = {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
};

export default function DashboardError({
    error,
    reset,
}: DashboardErrorProps) {
    const hasDigest = Boolean(error.digest);

    return (
        <main
            role="alert"
            aria-labelledby="dashboard-error-title"
            className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-slate-950
                px-4
                py-8
                text-white
                sm:px-6
            "
        >
            <section
                className="
                    w-full
                    max-w-lg
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900
                    p-6
                    text-center
                    shadow-2xl
                    shadow-black/30
                    sm:p-8
                "
            >
                <div
                    aria-hidden="true"
                    className="
                        mx-auto
                        mb-6
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-amber-400/20
                        bg-amber-400/10
                        text-4xl
                    "
                >
                    ⚠️
                </div>

                <h1
                    id="dashboard-error-title"
                    className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-white
                        sm:text-3xl
                    "
                >
                    Dashboard Unavailable
                </h1>

                <p
                    className="
                        mx-auto
                        mt-3
                        max-w-md
                        text-sm
                        leading-6
                        text-slate-400
                        sm:text-base
                    "
                >
                    We couldn&apos;t load your CRM dashboard
                    right now. This is usually temporary.
                    Please try again.
                </p>

                <div
                    aria-hidden="true"
                    className="
                        mx-auto
                        my-7
                        h-px
                        w-full
                        max-w-xs
                        bg-gradient-to-r
                        from-transparent
                        via-slate-700
                        to-transparent
                    "
                />

                <button
                    type="button"
                    onClick={reset}
                    className="
                        inline-flex
                        min-h-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-teal-500
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        text-slate-950
                        shadow-lg
                        shadow-teal-950/20
                        transition
                        hover:bg-teal-400
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-teal-300
                        focus-visible:ring-offset-2
                        focus-visible:ring-offset-slate-900
                        active:scale-[0.98]
                    "
                >
                    Retry
                </button>

                {hasDigest && (
                    <p
                        className="
                            mt-5
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.16em]
                            text-slate-600
                        "
                    >
                        Reference: {error.digest}
                    </p>
                )}
            </section>
        </main>
    );
}