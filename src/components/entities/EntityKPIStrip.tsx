interface KPIItem {
    label: string;
    value: string | number;
}

interface EntityKPIStripProps {
    items: KPIItem[];
}

export default function EntityKPIStrip({
    items,
}: EntityKPIStripProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
                <div
                    key={item.label}
                    className="rounded-xl border bg-background p-5"
                >
                    <p className="text-sm text-muted-foreground">
                        {item.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {item.value}
                    </p>
                </div>
            ))}
        </div>
    );
}




