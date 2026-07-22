import type { ReactNode } from 'react';

interface CRMStatCardProps {

    title: string;

    value: ReactNode;

    subtitle?: ReactNode;

    icon?: ReactNode;

    footer?: ReactNode;

    className?: string;

}

export default function CRMStatCard({
    title,
    value,
    subtitle,
    icon,
    footer,
    className = '',
}: CRMStatCardProps) {

    return (

        <div
            className={`rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}
        >

            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0 flex-1">

                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>

                    <div className="mt-2 text-3xl font-bold tracking-tight">
                        {value}
                    </div>

                    {subtitle && (

                        <div className="mt-2 text-sm text-muted-foreground">
                            {subtitle}
                        </div>

                    )}

                </div>

                {icon && (

                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted">
                        {icon}
                    </div>

                )}

            </div>

            {footer && (

                <div className="mt-5 border-t pt-4 text-sm">
                    {footer}
                </div>

            )}

        </div>

    );

}
