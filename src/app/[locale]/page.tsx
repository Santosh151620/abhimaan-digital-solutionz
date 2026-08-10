import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function HomePage() {
    const heroT = useTranslations("Hero");
    const btnT = useTranslations("Buttons");
    const locale = useLocale();

    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            {/* Ambient background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <div className="absolute left-1/2 top-[-12rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />
                <div className="absolute bottom-[-12rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-amber-400/8 blur-3xl" />
                <div className="absolute right-[-8rem] top-1/3 h-[24rem] w-[24rem] rounded-full bg-slate-400/8 blur-3xl" />

                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-12">
                <div className="grid w-full items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
                    {/* Hero content */}
                    <section className="text-center lg:text-left">
                        <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 shadow-2xl shadow-black/20 backdrop-blur-xl">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-400" />
                            </span>

                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
                                {heroT("tagline")}
                            </span>
                        </div>

                        <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:mx-0">
                            {heroT("title")}
                        </h1>

                        <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg lg:mx-0">
                            {heroT("description")}
                        </p>

                        <div className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start">
                            <Link
                                href={`/${locale}/contact`}
                                className="group inline-flex items-center justify-center rounded-2xl bg-teal-400 px-7 py-4 font-bold text-slate-950 shadow-xl shadow-teal-500/20 transition duration-300 hover:-translate-y-1 hover:bg-teal-300 hover:shadow-2xl hover:shadow-teal-400/25 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                            >
                                {btnT("start")}

                                <span
                                    aria-hidden="true"
                                    className="ml-3 transition-transform duration-300 group-hover:translate-x-1"
                                >
                                    →
                                </span>
                            </Link>

                            <Link
                                href={`/${locale}/services`}
                                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-7 py-4 font-semibold text-white shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-slate-950"
                            >
                                {btnT("explore")}
                            </Link>
                        </div>

                        <div className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm text-slate-500 lg:justify-start">
                            <span className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                                CRM
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                                ERP
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                                Digital Solutions
                            </span>
                        </div>
                    </section>

                    {/* Visual system preview */}
                    <section
                        aria-label="Platform preview"
                        className="relative mx-auto w-full max-w-md lg:max-w-none"
                    >
                        <div className="absolute -inset-8 rounded-[3rem] bg-teal-400/10 blur-3xl" />

                        <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-5">
                                {/* Window header */}
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                                    </div>

                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                        ADS Platform
                                    </span>
                                </div>

                                {/* Dashboard cards */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-teal-400/10 bg-teal-400/[0.07] p-4">
                                        <div className="mb-4 h-2 w-12 rounded-full bg-teal-300/40" />
                                        <div className="h-7 w-20 rounded-lg bg-white/10" />
                                        <div className="mt-3 h-2 w-16 rounded-full bg-teal-300/20" />
                                    </div>

                                    <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.06] p-4">
                                        <div className="mb-4 h-2 w-12 rounded-full bg-amber-200/40" />
                                        <div className="h-7 w-20 rounded-lg bg-white/10" />
                                        <div className="mt-3 h-2 w-16 rounded-full bg-amber-200/20" />
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <div className="h-2.5 w-24 rounded-full bg-white/15" />
                                            <div className="mt-2 h-2 w-16 rounded-full bg-white/7" />
                                        </div>

                                        <div className="h-7 w-16 rounded-full bg-white/5" />
                                    </div>

                                    <div className="flex h-28 items-end gap-2">
                                        <div className="h-[38%] flex-1 rounded-t-lg bg-white/8" />
                                        <div className="h-[55%] flex-1 rounded-t-lg bg-white/10" />
                                        <div className="h-[46%] flex-1 rounded-t-lg bg-teal-400/20" />
                                        <div className="h-[72%] flex-1 rounded-t-lg bg-teal-400/30" />
                                        <div className="h-[64%] flex-1 rounded-t-lg bg-teal-300/40" />
                                        <div className="h-[88%] flex-1 rounded-t-lg bg-teal-300/60" />
                                    </div>
                                </div>

                                {/* Activity */}
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3">
                                        <span className="h-8 w-8 rounded-lg bg-teal-400/15" />
                                        <span className="h-2 w-28 rounded-full bg-white/10" />
                                        <span className="ml-auto h-2 w-10 rounded-full bg-white/5" />
                                    </div>

                                    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3">
                                        <span className="h-8 w-8 rounded-lg bg-amber-300/15" />
                                        <span className="h-2 w-24 rounded-full bg-white/10" />
                                        <span className="ml-auto h-2 w-10 rounded-full bg-white/5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating depth element */}
                        <div className="absolute -right-5 -top-5 hidden rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 shadow-xl backdrop-blur-xl sm:block">
                            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                                Connected
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-sm font-bold text-white">
                                <span className="h-2 w-2 rounded-full bg-teal-400" />
                                Business Intelligence
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
