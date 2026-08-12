'use client';

import type {
    KnowledgeSummary,
} from '@/types/crm/KnowledgeBase';

interface Props {
    summary: KnowledgeSummary;
}

interface SummaryCardProps {
    title: string;
    value: number;
    tone?: 'default' | 'success' | 'warning' | 'muted';
}

const toneClasses: Record<
    NonNullable<SummaryCardProps['tone']>,
    string
> = {
    default:
        'border-white/10 bg-white/[0.035] text-white',
    success:
        'border-emerald-400/15 bg-emerald-400/[0.045] text-white',
    warning:
        'border-amber-300/15 bg-amber-300/[0.045] text-white',
    muted:
        'border-stone-400/10 bg-stone-400/[0.03] text-white',
};

function SummaryCard({
    title,
    value,
    tone = 'default',
}: SummaryCardProps) {
    return (
        <article
            className={[
                'min-w-0 rounded-xl border p-4',
                'shadow-sm shadow-black/10',
                'transition-colors duration-200',
                'hover:border-white/15',
                toneClasses[tone],
            ].join(' ')}
        >
            <div className="flex items-center justify-between gap-3">
                <p className="truncate text-xs font-medium uppercase tracking-[0.12em] text-stone-400">
                    {title}
                </p>
            </div>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {value}
            </p>
        </article>
    );
}

export default function KnowledgeBaseSummary({
    summary,
}: Props) {
    return (
        <section
            aria-label="Knowledge base summary"
            className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
            <SummaryCard
                title="Total Articles"
                value={summary.total}
            />

            <SummaryCard
                title="Draft"
                value={summary.draft}
                tone="warning"
            />

            <SummaryCard
                title="Published"
                value={summary.published}
                tone="success"
            />

            <SummaryCard
                title="Archived"
                value={summary.archived}
                tone="muted"
            />

            <SummaryCard
                title="Featured"
                value={summary.featured}
                tone="default"
            />
        </section>
    );
}