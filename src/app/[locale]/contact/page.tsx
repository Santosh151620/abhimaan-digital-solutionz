"use client";

import "@/app/globals.css";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    service_interest: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      alert("Thank you! Your message has been sent.");

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        company: "",
        service_interest: "",
        message: "",
      });
    } else {
      alert("Failed to send message");
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 pt-32">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-teal-400">
          Contact Us
        </h1>

        <p className="mt-3 text-slate-400">
          Let&apos;s discuss your project and business goals.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-teal-400">
              Full Name *
            </label>

            <input
              type="text"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-teal-500"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  full_name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-teal-400">
              Email *
            </label>

            <input
              type="email"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-teal-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-teal-400">
              Phone
            </label>

            <input
              type="text"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-teal-500"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-teal-400">
              Company
            </label>

            <input
              type="text"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-teal-500"
              value={formData.company}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  company: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-teal-400">
            Service Interest *
          </label>

          <select
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-teal-500"
            value={formData.service_interest}
            onChange={(e) =>
              setFormData({
                ...formData,
                service_interest: e.target.value,
              })
            }
          >
            <option value="">Select Service</option>
            <option value="Website Development">Website Development</option>
            <option value="E-Commerce Website">E-Commerce Website</option>
            <option value="CRM Development">CRM Development</option>
            <option value="SEO Services">SEO Services</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="AI Automation">AI Automation</option>
            <option value="WhatsApp Automation">WhatsApp Automation</option>
            <option value="Consultation">Consultation</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-teal-400">
            Message *
          </label>

          <textarea
            required
            rows={6}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-teal-500"
            value={formData.message}
            onChange={(e) =>
              setFormData({
                ...formData,
                message: e.target.value,
              })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-4 font-bold text-slate-950 transition hover:scale-105 md:w-auto"
        >
          Send Message
        </button>
      </form>
    </main>
  );
}