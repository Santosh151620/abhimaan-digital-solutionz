'use client';

import Link from 'next/link';

import type {
    Opportunity,
} from '@/types/crm/Opportunities';

interface Props {

    opportunities: Opportunity[];

}

export default function OpportunitiesTable({

    opportunities,

}: Props) {

    if (opportunities.length === 0) {

        return (

            <div className="rounded-xl border p-10 text-center text-muted-foreground">

                No opportunities found.

            </div>

        );

    }

    return (

        <div className="overflow-x-auto rounded-xl border">

            <table className="w-full">

                <thead>

                    <tr className="border-b bg-muted/40 text-left">

                        <th className="p-3">
                            Opportunity
                        </th>

                        <th className="p-3">
                            Company
                        </th>

                        <th className="p-3">
                            Stage
                        </th>

                        <th className="p-3">
                            Status
                        </th>

                        <th className="p-3 text-right">
                            Value
                        </th>

                        <th className="p-3 text-right">
                            Probability
                        </th>

                        <th className="p-3">
                            Expected Close
                        </th>

                        <th className="p-3">
                            Owner
                        </th>

                        <th className="p-3 text-right">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {opportunities.map(

                        opportunity => (

                            <tr
                                key={opportunity.id}
                                className="border-b hover:bg-muted/30"
                            >

                                <td className="p-3">

                                    <div className="font-medium">

                                        {opportunity.name}

                                    </div>

                                    <div className="text-xs text-muted-foreground">

                                        {opportunity.opportunityNumber}

                                    </div>

                                </td>

                                <td className="p-3">

                                    {opportunity.companyId ?? '-'}

                                </td>

                                <td className="p-3">

                                    {opportunity.stage}

                                </td>

                                <td className="p-3">

                                    {opportunity.status}

                                </td>

                                <td className="p-3 text-right">

                                    {opportunity.value.toLocaleString()}

                                </td>

                                <td className="p-3 text-right">

                                    {opportunity.probability}%

                                </td>

                                <td className="p-3">

                                    {opportunity.expectedCloseDate ?? '-'}

                                </td>

                                <td className="p-3">

                                    {opportunity.owner ??
                                        opportunity.ownerId ??
                                        '-'}

                                </td>

                                <td className="p-3 text-right">

                                    <Link
                                        href={`/crm/opportunities/${opportunity.id}`}
                                        className="rounded border px-3 py-1 text-sm"
                                    >

                                        View

                                    </Link>

                                </td>

                            </tr>

                        ),

                    )}

                </tbody>

            </table>

        </div>

    );

}
