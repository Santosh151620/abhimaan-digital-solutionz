"use client";

import type { Notification } from "@/types/notifications";

interface NotificationPanelProps {
  notifications: Notification[];
}

export default function NotificationPanel({
  notifications,
}: NotificationPanelProps) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-sm text-gray-500">
        No notifications available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="rounded-lg border p-4"
        >
          <div className="font-medium">
            {notification.title}
          </div>

          <p className="mt-1 text-sm">
            {notification.message}
          </p>
        </div>
      ))}
    </div>
  );
}
