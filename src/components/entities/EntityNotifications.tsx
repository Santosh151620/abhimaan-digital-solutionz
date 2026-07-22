"use client";

import NotificationPanel from "./NotificationPanel";
import type { Notification } from "@/types/notifications";

interface EntityNotificationsProps {
    notifications: Notification[];
}

export default function EntityNotifications({
    notifications,
}: EntityNotificationsProps) {

    return (
        <NotificationPanel
            notifications={notifications}
        />
    );
}