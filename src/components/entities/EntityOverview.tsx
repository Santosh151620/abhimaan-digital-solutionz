"use client";

import EntityOverviewGrid from "./EntityOverviewGrid";

interface EntityOverviewProps {
    items: Array<{
        title: string;
        value: string | number;
    }>;
}

function EntityOverview({
    items,
}: EntityOverviewProps) {

    return (
        <EntityOverviewGrid
            items={items}
        />
    );
}

