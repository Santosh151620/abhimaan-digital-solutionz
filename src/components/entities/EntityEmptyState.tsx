interface EntityEmptyStateProps {
    title: string;
    description?: string;
}

export default function EntityEmptyState({
    title,
    description,
}: EntityEmptyStateProps) {
    return (
        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-8 text-center">

            <div className="text-4xl">📭</div>

            <h3 className="mt-4 text-lg font-semibold">
                {title}
            </h3>

            {description && (
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    {description}
                </p>
            )}

        </div>
    );
}




