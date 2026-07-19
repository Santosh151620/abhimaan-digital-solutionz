'use client';

import type { Asset } from '@/types/crm/Assets';

interface Props {
    assets: Asset[];
}

export default function AssetsSummary({
    assets,
}: Props) {
    const total = assets.length;

    const available = assets.filter(
        a => a.status === 'Available',
    ).length;

    const allocated = assets.filter(
        a => a.status === 'Allocated',
    ).length;

    const maintenance = assets.filter(
        a => a.status === 'Maintenance',
    ).length;

    const retired = assets.filter(
        a => a.status === 'Retired',
    ).length;

    const totalValue = assets.reduce(
        (sum, a) => sum + (a.currentValue ?? 0),
        0,
    );

    const cards = [
        {
            title: 'Total Assets',
            value: total,
        },
        {
            title: 'Available',
            value: available,
        },
        {
            title: 'Allocated',
            value: allocated,
        },
        {
            title: 'Maintenance',
            value: maintenance,
        },
        {
            title: 'Retired',
            value: retired,
        },
        {
            title: 'Current Value',
            value: `₹ ${totalValue.toLocaleString()}`,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {cards.map(card => (
                <div
                    key={card.title}
                    className="rounded-xl border bg-card p-5 shadow-sm"
                >
                    <p className="text-sm text-muted-foreground">
                        {card.title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {card.value}
                    </h2>
                </div>
            ))}
        </div>
    );
}