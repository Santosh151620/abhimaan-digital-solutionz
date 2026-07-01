"use client";

import type { Activity } from "@/types/activity";

interface ActivityPanelProps {
  activities: Activity[];
}

export default function ActivityPanel({
  activities,
}: ActivityPanelProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-sm text-gray-500">
        No activity available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="rounded-lg border p-4"
        >
          <div className="font-medium">
            {activity.type}
          </div>

          {activity.description && (
            <p className="mt-1 text-sm text-gray-600">
              {activity.description}
            </p>
          )}

          <div className="mt-2 text-xs text-gray-400">
            {activity.createdAt}
          </div>
        </div>
      ))}
    </div>
  );
}