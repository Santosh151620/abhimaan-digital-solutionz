import Link from 'next/link';

import { OpportunitiesServiceInstance } from '@/services/crm/OpportunitiesService';

export default async function OpportunitiesPage() {

    const opportunities =
        await OpportunitiesServiceInstance.list();

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <h1 className="text-2xl font-bold">
                    Opportunities
                </h1>

                <Link
                    href="/crm/opportunities/new"
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    New Opportunity
                </Link>

            </div>

            <div className="rounded-xl border">

                <table className="w-full">

                    <thead>

                        <tr className="border-b text-left">

                            <th className="p-3">Title</th>
                            <th className="p-3">Company</th>
                            <th className="p-3">Stage</th>
                            <th className="p-3">Value</th>
                            <th className="p-3"></th>

                        </tr>

                    </thead>

                    <tbody>

                        {opportunities.map(item => (

                            <tr
                                key={item.id}
                                className="border-b"
                            >

                                <td className="p-3">
                                    {item.title}
                                </td>

                                <td className="p-3">
                                    {item.companyId}
                                </td>

                                <td className="p-3">
                                    {item.stage}
                                </td>

                                <td className="p-3">
                                    ₹ {item.value}
                                </td>

                                <td className="p-3">

                                    <Link
                                        href={`/crm/opportunities/${item.id}`}
                                        className="text-primary"
                                    >
                                        View
                                    </Link>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}