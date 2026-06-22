"use client";
import "@/app/globals.css";
import { useTranslations } from "next-intl";

export default function WhatsAppButton() {
  const btnT = useTranslations("Buttons");

  const whatsappNumber = "919876543210"; 
  const messageText = encodeURIComponent("Hello Abhimaan Digital Solutionz, I would like to inquire about your web development and digital services.");
  const whatsappUrl = `https://wa.me{whatsappNumber}?text=${messageText}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      // Resized from w-14/h-14 down to w-12/h-12 (1.5 units smaller) and added strong radiant aura glowing filters
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-[#25D366] hover:bg-[#22c35e] text-white rounded-full transition-all duration-300 group shadow-[0_0_25px_rgba(37,211,102,0.65)] hover:shadow-[0_0_35px_rgba(37,211,102,0.95)] border border-white/30 transform hover:-translate-y-1 hover:scale-105 animate-pulse-slow"
    >
      {/* Hyper-sharpened layout graphic vector layer using enhanced contrast drop-shadow matrices */}
      <svg 
        className="w-6 h-6 fill-current filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.55)] contrast-[1.15]" 
        viewBox="0 0 24 24"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.705 1.456h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      
      {/* High-end glassmorphism tooltip prompt */}
      <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-200 rounded-xl bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-[11px] text-emerald-400 font-extrabold border border-emerald-500/30 whitespace-nowrap shadow-2xl tracking-wide">
        {btnT("whatsapp")}
      </span>
    </a>
  );
}
