import { useTranslations } from "next-intl";
import Link from "next/link";

export default function HomePage() {
  // 1. Hook into the Hero and Buttons mapping blocks inside your JSON dictionaries
  const heroT = useTranslations("Hero");
  const btnT = useTranslations("Buttons");

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        {/* Dynamic Tagline */}
        <span className="text-teal-400 text-xs font-bold tracking-widest uppercase block">
          {heroT("tagline")}
        </span>

        {/* Dynamic Title */}
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl max-w-4xl mx-auto leading-tight">
          {heroT("title")}
        </h1>

        {/* Dynamic Description */}
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {heroT("description")}
        </p>

        {/* Dynamic Interactive Action Buttons mapped to the Buttons object */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/contact">
            <button className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-8 py-4 rounded-xl transition duration-300 shadow-lg shadow-teal-500/20 cursor-pointer">
              {btnT("start")}
            </button>
          </Link>
          
          <Link href="/services">
            <button className="border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-white font-medium px-8 py-4 rounded-xl transition duration-300 cursor-pointer">
              {btnT("explore")}
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
