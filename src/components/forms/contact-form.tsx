"use client";

import { useState } from "react";

type ContactResponse = {
  message?: string;
  error?: string;
};

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          source: "website",
        }),
      });

      const result: ContactResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Submission failed"
        );
      }

      setSuccess(
        result.message ?? "Message sent successfully."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Submission failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value,
          })
        }
        className="w-full rounded-lg border p-3"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData({
            ...formData,
            email: e.target.value,
          })
        }
        className="w-full rounded-lg border p-3"
        required
      />

      <input
        type="text"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) =>
          setFormData({
            ...formData,
            phone: e.target.value,
          })
        }
        className="w-full rounded-lg border p-3"
      />

      <input
        type="text"
        placeholder="Service Interested In"
        value={formData.service}
        onChange={(e) =>
          setFormData({
            ...formData,
            service: e.target.value,
          })
        }
        className="w-full rounded-lg border p-3"
      />

      <textarea
        rows={5}
        placeholder="Message"
        value={formData.message}
        onChange={(e) =>
          setFormData({
            ...formData,
            message: e.target.value,
          })
        }
        className="w-full rounded-lg border p-3"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

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
    </form>
  );
}