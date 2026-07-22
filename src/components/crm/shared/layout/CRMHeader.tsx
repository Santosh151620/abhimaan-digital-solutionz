import type { ReactNode } from "react";
import Link from "next/link";

interface CRMHeaderAction {
    label: string;
    href: string;
}

interface CRMHeaderProps {
    title: string;
    description?: string;
    badge?: ReactNode;
    actions?: CRMHeaderAction[];
    action?: ReactNode;
    children?: ReactNode;
}

export default function CRMHeader({
    title,
    description,
    badge,
    actions = [],
    action,
    children,
}: CRMHeaderProps) {

    return (
        <div className="rounded-xl border bg-card p-6">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                <div className="space-y-2">

                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">
                            {title}
                        </h1>

                        {badge}
                    </div>

                    {description && (
                        <p className="text-muted-foreground">
                            {description}
                        </p>
                    )}

                </div>

                {(actions.length > 0 || action) && (

                    <div className="flex flex-wrap gap-2">

                        {actions.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                            >
                                {item.label}
                            </Link>
                        ))}

                        {action}

                    </div>

                )}

            </div>

            {children && (
                <div className="mt-6">
                    {children}
                </div>
            )}

        </div>
    );
}