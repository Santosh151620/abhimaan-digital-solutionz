"use client";

const feed = [
  "Lead assigned to Sales",
  "Proposal sent to Acme Pvt Ltd",
  "Payment received from Nova Tech",
  "Follow-up scheduled for tomorrow",
  "Support ticket resolved"
];

export default function LiveActivityTicker() {

  return (

    <section className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-emerald-300">
        Live Activity
      </h3>

      <div className="space-y-2">

        {feed.map((item) => (

          <div
            key={item}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300"
          >
            {item}
          </div>

        ))}

      </div>

    </section>

  );

}
