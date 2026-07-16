import type { Asset } from '@/types/crm/Assets';

interface Props {
    assets: Asset[];
}

export default function AssetsSummary({
    assets,
}: Props) {

    const total = assets.length;

    const available = assets.filter(
        (asset) => asset.status === 'Available'
    ).length;

    const allocated = assets.filter(
        (asset) => asset.status === 'Allocated'
    ).length;

    const maintenance = assets.filter(
        (asset) => asset.status === 'Maintenance'
    ).length;

    const retired = assets.filter(
        (asset) => asset.status === 'Retired'
    ).length;

    const totalValue = assets.reduce(
        (sum, asset) =>
            sum + (asset.currentValue ?? 0),
        0
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
            value: totalValue.toLocaleString(),
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">

            {cards.map((card) => (

                <div
                    key={card.title}
                    className="rounded-xl border bg-white p-5"
                >

                    <div className="text-sm text-muted-foreground">
                        {card.title}
                    </div>

                    <div className="mt-2 text-2xl font-bold">
                        {card.value}
                    </div>

                </div>

            ))}

        </div>
    );

}