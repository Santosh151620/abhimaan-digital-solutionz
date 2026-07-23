'use client';

import type {
    SettingsSummary as SettingsSummaryModel,
} from '@/types/crm/Settings';

interface Props {

    summary: SettingsSummaryModel;

}

interface CardProps {

    title: string;

    value: number;

}

function SummaryCard({
    title,
    value,
}: CardProps) {

    return (

        <div className="rounded-xl border bg-background p-5">

            <div className="text-sm text-muted-foreground">
                {title}
            </div>

            <div className="mt-2 text-3xl font-bold">
                {value}
            </div>

        </div>

    );

}

export default function SettingsSummary({
    summary,
}: Props) {

    return (

        <div className="grid gap-4 md:grid-cols-5">

            <SummaryCard
                title="Total"
                value={summary.total}
            />

            <SummaryCard
                title="Active"
                value={summary.active}
            />

            <SummaryCard
                title="Inactive"
                value={summary.inactive}
            />

            <SummaryCard
                title="Editable"
                value={summary.editable}
            />

            <SummaryCard
                title="Encrypted"
                value={summary.encrypted}
            />

        </div>

    );

}