import {
    notFound,
} from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';

import EntityOverviewGrid from '@/components/entities/EntityOverviewGrid';
import EntityWorkspace from '@/components/entities/EntityWorkspace';

import {
    QuotationsServiceInstance,
} from '@/services/crm/QuotationsService';


interface Props {

    params: Promise<{
        id: string;
    }>;

}


export default async function QuotationDetailsPage({
    params,
}: Props) {


    const {
        id,
    } = await params;


    const quotation =
        await QuotationsServiceInstance.details(id);


    if (!quotation) {
        notFound();
    }


    return (

        <CRMPageLayout>


            <CRMHeader

                title={quotation.title}

                description="Quotation details and related CRM activity."

                actions={[
                    {
                        label: "Back",
                        href: "/crm/quotations",
                    },
                    {
                        label: "Edit",
                        href: `/crm/quotations/${quotation.id}/edit`,
                    },
                ]}

            />


            <EntityWorkspace

                entityType="Quotation"

                entityId={quotation.id}

                overview={

                    <EntityOverviewGrid

                        items={[

                            {
                                title: "Quotation Number",
                                value: quotation.quotationNumber,
                            },

                            {
                                title: "Customer",
                                value: quotation.customerName,
                            },

                            {
                                title: "Status",
                                value: quotation.status,
                            },

                            {
                                title: "Company",
                                value: quotation.companyId || "-",
                            },

                            {
                                title: "Opportunity",
                                value: quotation.opportunityId ?? "-",
                            },

                            {
                                title: "Amount",
                                value:
                                    `${quotation.currency} ${quotation.amount}`,
                            },

                            {
                                title: "Subtotal",
                                value:
                                    `${quotation.currency} ${quotation.subtotal}`,
                            },

                            {
                                title: "Tax",
                                value:
                                    `${quotation.currency} ${quotation.tax}`,
                            },

                            {
                                title: "Discount",
                                value:
                                    `${quotation.currency} ${quotation.discount}`,
                            },

                            {
                                title: "Total",
                                value:
                                    `${quotation.currency} ${quotation.total}`,
                            },

                            {
                                title: "Valid Until",
                                value: quotation.validUntil,
                            },

                            {
                                title: "Created",
                                value:
                                    new Date(
                                        quotation.createdAt,
                                    ).toLocaleDateString(),
                            },

                            {
                                title: "Updated",
                                value:
                                    new Date(
                                        quotation.updatedAt,
                                    ).toLocaleDateString(),
                            },

                        ]}

                    />

                }

            />


        </CRMPageLayout>

    );

}