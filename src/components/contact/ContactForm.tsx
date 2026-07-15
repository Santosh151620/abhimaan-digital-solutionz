"use client";

import { useState } from "react";

interface ContactFormData {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  service_interest: string;
  message: string;
  website?: string;
}

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const [form, setForm] = useState<ContactFormData>({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    service_interest: "",
    message: "",
    website: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(
          "Your enquiry has been submitted successfully."
        );

        setError("");

        setForm({
          full_name: "",
          email: "",
          phone: "",
          company: "",
          service_interest: "",
          message: "",
          website: "",
        });
      } else {
        setError("Unable to submit form.");
        setSuccess("");
      }
    } catch (error) {
      console.error("Submission error:", error);

      setError(
        "Something went wrong processing your request."
      );

      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-white p-10 shadow-xl">
        <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-emerald-100 mb-6">
          <svg
            className="w-10 h-10 text-emerald-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3 className="text-3xl font-bold text-center text-slate-900 mb-4">
          Thank You!
        </h3>

        <p className="text-center text-slate-600 max-w-xl mx-auto leading-7">
          We have successfully received your enquiry.
          Our team will review your requirements and
          contact you shortly.
        </p>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setSuccess("")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          name="full_name"
          type="text"
          placeholder="Full Name"
          required
          pattern="^[a-zA-Z\s]+$"
          title="Please enter a valid name (letters and spaces only)."
          value={form.full_name}
          onChange={handleChange}
          className="w-full border border-slate-300 p-3 rounded text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          title="Please enter a valid email address"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-slate-300 p-3 rounded text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          required
          pattern="[0-9]{10}"
          title="Please enter a valid 10-digit phone number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border border-slate-300 p-3 rounded text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <input
          name="company"
          type="text"
          placeholder="Company Name (Optional)"
          value={form.company}
          onChange={handleChange}
          className="w-full border border-slate-300 p-3 rounded text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <select
          name="service_interest"
          required
          title="Please select a service of interest"
          value={form.service_interest}
          onChange={handleChange}
          className="w-full border border-slate-300 p-3 rounded text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled hidden>
            Select Service Interested In...
          </option>
          <option value="Web Development">
            Web Development
          </option>
          <option value="Mobile App Development">
            Mobile App Development
          </option>
          <option value="UI/UX Design">
            UI/UX Design
          </option>
          <option value="Consulting / Strategy">
            Consulting &amp; Strategy
          </option>
          <option value="Other">
            Other / General Enquiry
          </option>
        </select>
      </div>

      <div>
        <textarea
          name="message"
          placeholder="Your Message..."
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="w-full border border-slate-300 p-3 rounded text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="hidden">
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={handleChange}
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded shadow transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Submit Enquiry"}
      </button>
    </form>
  );
}





