'use client';

import type {
    KnowledgeSummary,
} from '@/types/crm/KnowledgeBase';

interface Props {

    summary: KnowledgeSummary;

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

            <div className="mt-2 text-3xl font-semibold">
                {value}
            </div>

        </div>

    );

}

export default function KnowledgeBaseSummary({
    summary,
}: Props) {

    return (

        <div className="grid gap-4 md:grid-cols-5">

            <SummaryCard
                title="Total Articles"
                value={summary.total}
            />

            <SummaryCard
                title="Draft"
                value={summary.draft}
            />

            <SummaryCard
                title="Published"
                value={summary.published}
            />

            <SummaryCard
                title="Archived"
                value={summary.archived}
            />

            <SummaryCard
                title="Featured"
                value={summary.featured}
            />

        </div>

    );

}