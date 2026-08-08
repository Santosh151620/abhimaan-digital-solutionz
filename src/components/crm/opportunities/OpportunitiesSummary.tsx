'use client';

import type {
    OpportunitySummary,
} from '@/types/crm/Opportunities';


interface Props {

    summary: OpportunitySummary;

}


function formatNumber(
    value: number | null | undefined,
): string {

    return Number(
        value ?? 0,
    ).toLocaleString();

}


export default function OpportunitiesSummary({

    summary,

}: Props) {


    return (

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

            <div className="rounded-xl border bg-background p-4">

                <div className="text-sm text-muted-foreground">
                    Total
                </div>

                <div className="text-2xl font-semibold">
                    {formatNumber(summary.total)}
                </div>

            </div>


            <div className="rounded-xl border bg-background p-4">

                <div className="text-sm text-muted-foreground">
                    Open
                </div>

                <div className="text-2xl font-semibold">
                    {formatNumber(summary.open)}
                </div>

            </div>


            <div className="rounded-xl border bg-background p-4">

                <div className="text-sm text-muted-foreground">
                    Won
                </div>

                <div className="text-2xl font-semibold">
                    {formatNumber(summary.won)}
                </div>

            </div>


            <div className="rounded-xl border bg-background p-4">

                <div className="text-sm text-muted-foreground">
                    Lost
                </div>

                <div className="text-2xl font-semibold">
                    {formatNumber(summary.lost)}
                </div>

            </div>


            <div className="rounded-xl border bg-background p-4">

                <div className="text-sm text-muted-foreground">
                    Pipeline Value
                </div>

                <div className="text-lg font-semibold">
                    {formatNumber(summary.pipelineValue)}
                </div>

            </div>


            <div className="rounded-xl border bg-background p-4">

                <div className="text-sm text-muted-foreground">
                    Weighted Value
                </div>

                <div className="text-lg font-semibold">
                    {formatNumber(summary.weightedValue)}
                </div>

            </div>

        </div>

    );

}
