"use client";
import "@/app/globals.css";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { navigationLinks } from "@/constants/navigation";
import { useTransition, useState } from "react";

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navT = useTranslations("Navigation");
  const btnT = useTranslations("Buttons");

  const languages = [
   { "code": "en", "name": "English" },
  { "code": "hi", "name": "हिंदी (Hindi)" },
  { "code": "kn", "name": "ಕನ್ನಡ (Kannada)" },
  { "code": "te", "name": "తెలుగు (Telugu)" },
  { "code": "mr", "name": "मराठी (Marathi)" }
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    // FIX: Declare segments with 'let' instead of 'const' to allow mutation
    const segments = pathname.split("/");
    segments[1] = newLocale;

    startTransition(() => {
      router.push(segments.join("/"));
    });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-900/60 shadow-[0_6px_35px_rgba(0,0,0,0.6)] transition-all duration-200 ${isPending ? "opacity-70" : "opacity-100"}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-3 flex items-center justify-between">

        {/* 1. BRAND LOGO - Particle snow emitter enabled */}
        <Link href={`/${locale}`} className="group relative flex-shrink-0 pr-12 sm:pr-9">
          <div className="absolute -inset-x-2 -inset-y-2 rounded-2xl bg-gradient-to-r from-teal-500/25 via-blue-500/40 to-teal-500/25 opacity-80 blur-md group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 animate-stream-light" />

          <div className="relative px-4 py-2 bg-slate-950/50 rounded-x1 border border-slate-500/90 group-hover:border-teal-600/50 transition duration-800 overflow-hidden">
            <span className="absolute top-0 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-snow-1 pointer-events-none filter blur-[0.5px]" />
            <span className="absolute top-0 left-2/4 w-1.5 h-1.5 bg-teal-300 rounded-full animate-snow-2 pointer-events-none filter blur-[0.5px]" />
            <span className="absolute top-0 left-3/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-snow-3 pointer-events-none filter blur-[0.5px]" />

            <h1 className="font-black text-xl sm:text-3xl tracking-tight text-white drop-shadow-[0_0_34px_rgba(45,212,191,0.4)]">
              Abhimaan <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-stream-light">Digital Solutionz</span>
            </h1>
          </div>
        </Link>

        {/* 2. 3D LABELS NAVIGATION */}
        <nav className="hidden xl:flex items-center gap-2 flex-grow justify-center px-4">
          {navigationLinks.map((item) => {
            const cleanHref = item.href.startsWith("/") ? item.href.slice(1) : item.href;
            const translationKey = item.name.toLowerCase();

            return (
              <Link
                key={item.href}
                href={`/${locale}/${cleanHref}`}
                className="relative text-[14px] font-extrabold text-slate-200 px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/40 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_3px_6px_rgba(0,0,0,0.4)] transition-all duration-300 transform hover:-translate-y-1.5 hover:text-teal-400 hover:bg-slate-900/90 hover:border-slate-700/60 hover:shadow-[0_12px_24px_rgba(0,0,0,0.5),0_0_15px_rgba(45,212,191,0.25)] whitespace-nowrap active:translate-y-0"
              >
                {navT(translationKey)}
              </Link>
            );
          })}
        </nav>

        {/* 3. CONTROL ACTIONS - Resized elite button */}
        <div className="hidden xl:flex items-center gap-6 flex-shrink-0">
          <select
            value={locale}
            onChange={handleLanguageChange}
            disabled={isPending}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-teal-500 cursor-pointer shadow-md"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-950 text-white font-medium">
                {lang.name}
              </option>
            ))}
          </select>

          <Link href={`/${locale}/contact`}>
            <button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-[11px] tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/10 hover:shadow-teal-400/30 transform hover:-translate-y-0.5 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap">
              {btnT("consultation")}
            </button>
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex xl:hidden items-center gap-3">
          <select
            value={locale}
            onChange={handleLanguageChange}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-bold rounded-xl px-2 py-1.5 focus:outline-none max-w-[100px]"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="text-white">{lang.name}</option>
            ))}
          </select>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-400 hover:text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/95 border-b border-slate-900 px-6 py-4 space-y-3 shadow-2xl">
          {navigationLinks.map((item) => {
            return (
              <Link
                key={item.href}
                href={`/${locale}/${item.href.startsWith("/") ? item.href.slice(1) : item.href}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-bold text-slate-300 hover:text-teal-400 py-2"
              >
                {navT(item.name.toLowerCase())}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

