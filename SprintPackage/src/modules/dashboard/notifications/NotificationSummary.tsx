"use client";

const items = [
  "2 proposals awaiting approval",
  "5 follow-ups due today",
  "1 payment reminder pending",
  "Lead imported successfully"
];

export default function NotificationSummary() {

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-white">
        Notifications
      </h3>

      <div className="space-y-3">

        {items.map((item)=>(

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
