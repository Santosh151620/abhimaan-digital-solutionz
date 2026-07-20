import Link from "next/link";
import { notFound } from "next/navigation";

import CRMPageLayout from "@/components/crm/shared/layout/CRMPageLayout";
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

    const { id } = await params;

    const contact =
        await ContactsServiceInstance.details(id);

    if (!contact) {
        notFound();
    }

    return (
        <CRMPageLayout>

            <div className="flex items-start justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        {contact.firstName} {contact.lastName}
                    </h1>

                    <p className="text-muted-foreground">
                        Contact Details
                    </p>

                </div>

                <div className="flex gap-2">

                    <Link
                        href="/crm/contacts"
                        className="rounded-lg border px-4 py-2 hover:bg-muted"
                    >
                        Back
                    </Link>

                    <Link
                        href={`/crm/contacts/${contact.id}/edit`}
                        className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"
                    >
                        Edit
                    </Link>

                </div>

            </div>

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
                                value: contact.companyName ?? "—",
                            },
                            {
                                title: "Designation",
                                value: contact.designation ?? "—",
                            },
                            {
                                title: "Department",
                                value: contact.department ?? "—",
                            },
                            {
                                title: "Email",
                                value: contact.email ?? "—",
                            },
                            {
                                title: "Phone",
                                value: contact.phone ?? "—",
                            },
                            {
                                title: "Mobile",
                                value: contact.mobile ?? "—",
                            },
                            {
                                title: "City",
                                value: contact.city ?? "—",
                            },
                            {
                                title: "State",
                                value: contact.state ?? "—",
                            },
                            {
                                title: "Country",
                                value: contact.country ?? "—",
                            },
                            {
                                title: "Opportunities",
                                value: contact.opportunities,
                            },
                            {
                                title: "Last Activity",
                                value: contact.lastActivity ?? "—",
                            },
                        ]}
                    />
                }
            />

        </CRMPageLayout>
    );

}