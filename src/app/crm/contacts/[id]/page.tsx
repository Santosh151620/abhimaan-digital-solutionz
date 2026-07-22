import Link from "next/link";
import { notFound } from "next/navigation";

import CRMPageLayout from "@/components/crm/shared/layout/CRMPageLayout";
import CRMHeader from "@/components/crm/shared/layout/CRMHeader";

import EntityOverviewGrid from "@/components/entities/EntityOverviewGrid";
import EntityWorkspace from "@/components/entities/EntityWorkspace";

import {
    ContactsServiceInstance,
} from "@/services/crm/ContactsService";


interface Props {
    params: Promise<{
        id: string;
    }>;
}


export default async function ContactPage({
    params,
}: Props) {

    const {
        id,
    } = await params;


    const contact =
        await ContactsServiceInstance.details(id);


    if (!contact) {
        notFound();
    }


    return (

        <CRMPageLayout>

            <CRMHeader
                title={`${contact.firstName} ${contact.lastName}`}
                description="Contact details and related CRM activity."
                actions={[
                    {
                        label: "Back",
                        href: "/crm/contacts",
                    },
                    {
                        label: "Edit",
                        href: `/crm/contacts/${contact.id}/edit`,
                    },
                ]}
            />


            <EntityWorkspace

                entityType="Contact"

                entityId={contact.id}

                overview={

                    <EntityOverviewGrid

                        items={[

                            {
                                title: "Status",
                                value: contact.status,
                            },

                            {
                                title: "Company",
                                value: contact.companyName ?? "-",
                            },

                            {
                                title: "Designation",
                                value: contact.designation ?? "-",
                            },

                            {
                                title: "Department",
                                value: contact.department ?? "-",
                            },

                            {
                                title: "Email",
                                value: contact.email ?? "-",
                            },

                            {
                                title: "Phone",
                                value: contact.phone ?? "-",
                            },

                            {
                                title: "Mobile",
                                value: contact.mobile ?? "-",
                            },

                            {
                                title: "City",
                                value: contact.city ?? "-",
                            },

                            {
                                title: "State",
                                value: contact.state ?? "-",
                            },

                            {
                                title: "Country",
                                value: contact.country ?? "-",
                            },

                            {
                                title: "Opportunities",
                                value: contact.opportunities ?? 0,
                            },

                            {
                                title: "Last Activity",
                                value: contact.lastActivity ?? "-",
                            },

                        ]}

                    />

                }

            />

        </CRMPageLayout>

    );

}