"use client";
import "@/app/globals.css";
import ContactForm from "@/components/forms/contact-form";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function ContactPage() {
  const locale = useLocale(); // Tracks if the user is on en, hi, kn, te, or mr
  const [status, setStatus] = useState<"IDLE" | "SUBMITTING" | "SUCCESS" | "ERROR">("IDLE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Hook into translation sections inside your master JSON dictionaries
  const formT = useTranslations("Form");
  const btnT = useTranslations("Buttons");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("SUBMITTING");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // We include the locale string directly inside the payload data!
        body: JSON.stringify({ name, email, message, locale }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus("SUCCESS");
      } else {
        setStatus("ERROR");
      }
    } catch (err) {
      setStatus("ERROR");
    }
  };

  if (status === "SUCCESS") {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center text-white">
        <div className="bg-slate-900 border border-teal-500 rounded-xl p-10 space-y-4 shadow-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/10 text-teal-400 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {/* Dynamic acknowledgment translation */}
          <h2 className="text-3xl font-bold text-white">
            {formT("successTitle", { name })}
          </h2>
          <p className="text-lg text-slate-300 max-w-md mx-auto leading-relaxed">
            {formT("successText")}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-20 text-white">
      <div className="mb-8">
        <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">Connect</span>
        <h1 className="text-4xl font-extrabold text-white mt-1 mb-2 sm:text-5xl">
          {formT("title")}
        </h1>
        <p className="text-slate-400">
          {formT("subtitle")}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl">
        {status === "ERROR" && (
          <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
            {formT("errorMsg")}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {formT("labelName")}
          </label>
          <input 
            type="text" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition" 
            placeholder={formT("placeholderName")} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {formT("labelEmail")}
          </label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition" 
            placeholder={formT("placeholderEmail")} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {formT("labelMessage")}
          </label>
          <textarea 
            rows={4} 
            required 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition" 
            placeholder={formT("placeholderMessage")} 
          />
        </div>

        <button 
          type="submit" 
          disabled={status === "SUBMITTING"} 
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-700 text-slate-950 font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {status === "SUBMITTING" ? btnT("sending") : btnT("submit")}
        </button>
      </form>
    </main>
  );
}
<ContactForm />
