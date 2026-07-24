'use client';

import type {
    OpportunitySummary,
} from '@/types/crm/Opportunities';

interface Props {

    summary: OpportunitySummary;

}

export default function OpportunitiesSummary({
    summary,
}: Props) {

    return (

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

            <div className="rounded border p-4">
                <div className="text-sm text-gray-500">
                    Total
                </div>

                <div className="text-2xl font-semibold">
                    {summary.total}
                </div>
            </div>

            <div className="rounded border p-4">
                <div className="text-sm text-gray-500">
                    Open
                </div>

                <div className="text-2xl font-semibold">
                    {summary.open}
                </div>
            </div>

            <div className="rounded border p-4">
                <div className="text-sm text-gray-500">
                    Won
                </div>

                <div className="text-2xl font-semibold">
                    {summary.won}
                </div>
            </div>

            <div className="rounded border p-4">
                <div className="text-sm text-gray-500">
                    Lost
                </div>

                <div className="text-2xl font-semibold">
                    {summary.lost}
                </div>
            </div>

            <div className="rounded border p-4">
                <div className="text-sm text-gray-500">
                    Pipeline Value
                </div>

                <div className="text-lg font-semibold">
                    {summary.pipelineValue.toLocaleString()}
                </div>
            </div>

            <div className="rounded border p-4">
                <div className="text-sm text-gray-500">
                    Weighted Value
                </div>

                <div className="text-lg font-semibold">
                    {summary.weightedValue.toLocaleString()}
                </div>
            </div>

        </div>

    );

}