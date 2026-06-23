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
        <main className="min-h-screen pt-32 px-6 max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-5xl font-extrabold text-teal-400">
                    Contact Us
                </h1>
                <p className="text-slate-400 mt-3">
                    Let's discuss your project and business goals.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl"
            >
                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-sm font-semibold text-teal-400 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
                            value={formData.full_name}
                            onChange={(e) =>
                                setFormData({ ...formData, full_name: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-teal-400 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-teal-400 mb-2">
                            Phone
                        </label>
                        <input
                            type="text"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-teal-400 mb-2">
                            Company
                        </label>
                        <input
                            type="text"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
                            value={formData.company}
                            onChange={(e) =>
                                setFormData({ ...formData, company: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-teal-400 mb-2">
                        Service Interest *
                    </label>
                    <select
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
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
                    <label className="block text-sm font-semibold text-teal-400 mb-2">
                        Message *
                    </label>
                    <textarea
                        required
                        rows={6}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
                        value={formData.message}
                        onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                        }
                    />
                </div>

                <button
                    type="submit"
                    className="w-full md:w-auto bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold px-8 py-4 rounded-xl hover:scale-105 transition"
                >
                    Send Message
                </button>
            </form>
        </main>
    );
}