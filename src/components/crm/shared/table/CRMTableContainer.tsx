import type { ReactNode } from 'react';

interface CRMTableContainerProps {

    title?: string;

    description?: string;

    toolbar?: ReactNode;

    footer?: ReactNode;

    children: ReactNode;

    className?: string;

}

export default function CRMTableContainer({
    title,
    description,
    toolbar,
    footer,
    children,
    className = '',
}: CRMTableContainerProps) {

    return (

        <div
            className={`rounded-xl border bg-card shadow-sm ${className}`}
        >

            {(title || description || toolbar) && (

                <div className="border-b p-6">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                        <div>

                            {title && (

                                <h2 className="text-xl font-semibold">
                                    {title}
                                </h2>

                            )}

                            {description && (

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {description}
                                </p>

                            )}

                        </div>

                        {toolbar && (

                            <div className="flex flex-wrap gap-2">
                                {toolbar}
                            </div>

                        )}

                    </div>

                </div>

            )}

            <div className="overflow-x-auto">

                {children}

            </div>

            {footer && (

                <div className="border-t p-4">

                    {footer}

                </div>

            )}

        </div>

    );

}