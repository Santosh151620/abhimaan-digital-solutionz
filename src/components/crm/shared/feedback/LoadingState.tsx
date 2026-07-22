import type { ReactNode } from 'react';

interface LoadingStateProps {
    title?: string;
    description?: string;
    children?: ReactNode;
}

export default function LoadingState({
    title = 'Loading...',
    description = 'Please wait while we prepare your data.',
    children,
}: LoadingStateProps) {

    return (

        <div className="rounded-xl border bg-card p-8">

            <div className="animate-pulse space-y-6">

                <div className="space-y-2">

                    <div className="h-7 w-56 rounded bg-muted" />

                    <div className="h-4 w-80 rounded bg-muted" />

                </div>

                <div className="grid gap-4 md:grid-cols-4">

                    {Array.from({
                        length: 4,
                    }).map((_, index) => (

                        <div
                            key={index}
                            className="h-28 rounded-xl border bg-muted"
                        />

                    ))}

                </div>

                <div className="space-y-3">

                    {Array.from({
                        length: 6,
                    }).map((_, index) => (

                        <div
                            key={index}
                            className="h-12 rounded-lg bg-muted"
                        />

                    ))}

                </div>

            </div>

            <div className="mt-8">

                <h3 className="text-lg font-semibold">
                    {title}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>

                {children && (
                    <div className="mt-6">
                        {children}
                    </div>
                )}

            </div>

        </div>

    );

}