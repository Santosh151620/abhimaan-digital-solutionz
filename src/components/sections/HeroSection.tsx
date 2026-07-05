export default function HeroSection() {
  return (
    <section className="bg-slate-950 text-white py-24">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Digital transformation for growing brands
        </p>

        <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
          Build modern websites, CRM systems, and automation.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          We help startups and enterprises launch fast, scale with confidence, and convert more customers online.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="rounded-full bg-cyan-400 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            Start Your Project
          </button>
          <button className="rounded-full border border-slate-700 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10">
            Explore Services
          </button>
        </div>
      </div>
    </section>
  );
}

