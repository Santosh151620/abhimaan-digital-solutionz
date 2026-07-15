"use client";

import type { EntitySummary } from "@/types/entity";

interface Props {
  summary: EntitySummary;
}

export default function EntitySummaryCard({
  summary,
}: Props) {
  const items = [
    ["Activities", summary.activityCount],
    ["Notes", summary.notesCount],
    ["Tasks", summary.tasksCount],
    ["Attachments", summary.attachmentsCount],
    ["Notifications", summary.notificationsCount],
  ] as const;

  return (
    <div className="rounded-lg border bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold">
        Entity Summary
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="rounded border p-3 text-center"
          >
            <div className="text-2xl font-bold">
              {value}
            </div>

            <div className="text-xs text-gray-500">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





