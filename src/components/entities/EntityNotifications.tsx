"use client";

import NotificationPanel from "./NotificationPanel";
import type { Notification } from "@/types/crm/Notification";

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

