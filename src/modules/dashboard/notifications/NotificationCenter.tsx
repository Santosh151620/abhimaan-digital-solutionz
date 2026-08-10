"use client";

import { dashboardNotifications } from "./data";

export default function NotificationCenter() {
  return (
    <section
      aria-labelledby="notification-center-title"
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3
          id="notification-center-title"
          className="text-lg font-semibold text-white"
        >
          Notifications
        </h3>

        {dashboardNotifications.length > 0 && (
          <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">
            {dashboardNotifications.length}
          </span>
        )}
      </div>

      {dashboardNotifications.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-800 bg-slate-950 p-4 text-sm text-slate-500">
          You&apos;re all caught up. No new notifications.
        </p>
      ) : (
        <div className="space-y-3">
          {dashboardNotifications.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-3 transition-colors hover:border-slate-700"
            >
              <div className="font-medium text-white">
                {item.title}
              </div>

              <div className="mt-1 text-sm leading-5 text-slate-400">
                {item.description}
              </div>

              <time
                className="mt-2 block text-xs text-slate-500"
                dateTime={item.createdAt}
              >
                {item.createdAt}
              </time>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}