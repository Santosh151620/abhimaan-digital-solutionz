"use client";

import NotificationPanel from "./NotificationPanel";
import type { Notification } from "@/types/crm/Notifications";

interface EntityNotificationsProps {
    notifications: Notification[];
}

function EntityNotifications({
    notifications,
}: EntityNotificationsProps) {

    return (
        <NotificationPanel
            notifications={notifications}
        />
    );
}

