import Link from 'next/link';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';
import CRMTableContainer from '@/components/crm/shared/table/CRMTableContainer';

import {
    listOpportunities,
} from './actions';

export default async function OpportunitiesPage() {

    const opportunities =
        await listOpportunities();

    return (

        <CRMPageLayout>

            <CRMHeader
                title="Opportunities"
                description="Manage CRM sales opportunities."
                actions={[
                    {
                        label: 'New Opportunity',
                        href: '/crm/opportunities/new',
                    },
                ]}
            />

            <CRMTableContainer>

                <table className="w-full">

                    <thead>

                        <tr className="border-b text-left">

                            <th className="p-3">
                                Title
                            </th>

                            <th className="p-3">
                                Company
                            </th>

                            <th className="p-3">
                                Stage
                            </th>

                            <th className="p-3">
                                Value
                            </th>

                            <th className="p-3">
                                Action
                            </th>

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

            </CRMTableContainer>

        </CRMPageLayout>

    );

}