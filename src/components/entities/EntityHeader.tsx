import Link from "next/link";

interface EntityHeaderProps {
    title: string;
    subtitle?: string;
    backHref?: string;
    actions?: React.ReactNode;
}

export default function EntityHeader({
    title,
    subtitle,
    backHref,
    actions,
}: EntityHeaderProps) {
    return (
        <div className="flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

                {backHref && (
                    <Link
                        href={backHref}
                        className="mb-3 inline-block text-sm text-muted-foreground hover:text-primary"
                    >
                        ← Back
                    </Link>
                )}

                <h1 className="text-3xl font-bold">
                    {title}
                </h1>

                {subtitle && (
                    <p className="mt-2 text-muted-foreground">
                        {subtitle}
                    </p>
                )}

            </div>

            {actions && (
                <div className="flex flex-wrap gap-2">
                    {actions}
                </div>
            )}

        </div>
    );
}