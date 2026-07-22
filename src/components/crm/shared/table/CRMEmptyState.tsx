import Link from 'next/link';

interface CRMEmptyStateProps {

    title: string;

    description: string;

    actionHref?: string;

    actionLabel?: string;

}

export default function CRMEmptyState({

    title,

    description,

    actionHref,

    actionLabel = 'Create',

}: CRMEmptyStateProps) {

    return (

        <div className="rounded-xl border bg-card p-12 text-center">

            <div className="mx-auto max-w-lg space-y-4">

                <h2 className="text-2xl font-semibold">

                    {title}

                </h2>

                <p className="text-muted-foreground">

                    {description}

                </p>

                {actionHref && (

                    <Link
                        href={actionHref}
                        className="inline-flex rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"
                    >
                        {actionLabel}
                    </Link>

                )}

            </div>

        </div>

    );

}