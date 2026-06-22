"use client";

import { useState } from "react";

// Explicit data interface for your 6 required form fields
interface ContactFormData {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  service_interest: string;
  message: string;
}

export default function ContactForm() {
  //const [loading, setLoading] = useState<boolean>(false);
const [loading, setLoading] =
  useState(false);

const [success, setSuccess] =
  useState("");

const [error, setError] =
  useState("");

  const [form, setForm] = useState<ContactFormData>({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    service_interest: "",
    message: "",
    website: "", // Honeypot field for spam prevention

    
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
       // alert("Thank you. Your enquiry has been submitted.");
       setSuccess(
  "Thank you. We received your enquiry."
);

setError("");

       setForm({
          full_name: "",
          email: "",
          phone: "",
          company: "",
          service_interest: "",
          message: "",
        });
      } else {
        //alert(data.error || "Submission failed.");
        setError(
  "Unable to submit form."
);

setSuccess("");
      }
    } catch (error) {
      console.error("Submission error:", error);
      //alert("Something went wrong processing your request.");
setError("Something went wrong processing your request.");
setSuccess("");
    } 
    finally {
      setLoading(false);
    }
  };

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
          <option value="Web Development">Web Development</option>
          <option value="Mobile App Development">Mobile App Development</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Consulting / Strategy">Consulting &amp; Strategy</option>
          <option value="Other">Other / General Enquiry</option>
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
{success && (
  <p className="text-green-600">
    {success}
  </p>
)}

{error && (
  <p className="text-red-600">
    {error}
  </p>
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
