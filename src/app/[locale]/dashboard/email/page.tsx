"use client";

import { useState } from "react";

export default function EmailCenterPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const sendEmail = async () => {
    setStatus("");

    if (!email || !subject || !message) {
      setStatus("Please complete all fields.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Failed to send email.");
      } else {
        setStatus("Email sent successfully.");
        setSubject("");
        setMessage("");
      }
    } catch {
      setStatus("Something went wrong.");
    }

    setSending(false);
  };

  return (
    <main className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Email Center
        </h1>

        <p className="text-slate-400 mt-1">
          Send emails directly to prospects and clients.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Recipient Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
            placeholder="client@example.com"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Subject
          </label>

          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
            placeholder="Project Discussion"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Message
          </label>

          <textarea
            rows={10}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
            placeholder="Write your email..."
          />
        </div>

        {status && (
          <div className="text-sm text-slate-300">
            {status}
          </div>
        )}

        <button
          onClick={sendEmail}
          disabled={sending}
          className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl"
        >
          {sending ? "Sending..." : "Send Email"}
        </button>
      </div>
    </main>
  );
}