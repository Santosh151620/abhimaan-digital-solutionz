import { generateSEO } from "@/lib/seo";

const faqs = [
  {
    q: "Do you develop custom websites?",
    a: "Yes, fully customized."
  },

  {
    q: "Do you provide CRM solutions?",
    a: "Yes."
  },

  {
    q: "Do you offer support?",
    a: "Yes."
  },
];

export default function FAQPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20">

      <h1 className="text-5xl font-bold">
        Frequently Asked Questions
      </h1>

      <div className="mt-16 space-y-6">

        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="border rounded-xl p-6"
          >
            <h3 className="font-bold">
              {faq.q}
            </h3>

            <p className="mt-3">
              {faq.a}
            </p>
          </div>
        ))}

      </div>

    </main>
  );
}

export const metadata = generateSEO({
  title: "Frequently Asked Questions",
  description: "Find clear answers about our web development and digital marketing processes.",
  path: "/faq",
});

export default function FAQPage() {
  const faqs = [
    { q: "How long does a typical project take?", a: "Most custom business website pipelines take between 3 to 6 weeks from initial design strategy to production deployment." },
    { q: "Do you offer post-launch site maintenance?", a: "Yes, we provide ongoing secure hosting optimizations, framework dependency updates, and content management packages." }
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 text-white">
      <div className="space-y-4 text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-teal-400 sm:text-5xl">Frequently Asked Questions</h1>
        <p className="text-slate-400">Got questions? We have transparent answers to help guide your project onboarding process.</p>
      </div>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <h3 className="text-xl font-bold text-teal-400 mb-2">Q: {faq.q}</h3>
            <p className="text-slate-300 leading-relaxed">A: {faq.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
