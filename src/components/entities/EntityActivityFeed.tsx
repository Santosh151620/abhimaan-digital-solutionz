"use client";

import ActivityPanel from "./ActivityPanel";
import type { Activity } from "@/types/crm/Activity";

interface EntityActivityFeedProps {
    activities: Activity[];
}

export default function EntityActivityFeed({
    activities,
}: EntityActivityFeedProps) {

    return (
        <ActivityPanel
            activities={activities}
        />
    );
}
