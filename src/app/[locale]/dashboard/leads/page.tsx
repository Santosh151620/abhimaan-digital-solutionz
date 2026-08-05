"use client";

import {
    useState,
} from "react";

import LeadModal from "@/modules/leads/components/LeadModal";
import LeadTable from "@/modules/leads/components/LeadTable";

import {
    useLeads,
} from "@/modules/leads/hooks/useLeads";

import {
    updateLead,
} from "@/modules/leads/api/lead.api";

import type {
    LeadEntity,
    LeadStatus,
} from "@/modules/leads/types/lead.entity";


import ExportButton from "@/components/crm/import-export/ExportButton";

import ImportUploadDialog from "@/components/crm/import-export/ImportUploadDialog";

import type {
    ImportRequest,
} from "@/types/crm/ImportExport";



export default function LeadsPage() {


    const {
        leads,
        loading,
        refetch,
    } = useLeads();



    const [
        selectedLead,
        setSelectedLead,
    ] = useState<LeadEntity | null>(null);



    const [
        modalOpen,
        setModalOpen,
    ] = useState(false);



    const [
        importOpen,
        setImportOpen,
    ] = useState(false);




    function handleOpenLead(
        lead: LeadEntity,
    ) {

        setSelectedLead(lead);

        setModalOpen(true);

    }




    function handleCloseModal() {

        setSelectedLead(null);

        setModalOpen(false);

    }





    async function handleUpdateStatus(
        entityId: string,
        status: LeadStatus,
    ) {

        await updateLead(
            entityId,
            {
                entityId,
                status,
            },
        );


        await refetch();

    }





    async function handleImport(
        request: ImportRequest,
    ) {


        const response =
            await fetch(
                "/api/crm/import",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify(
                            request,
                        ),
                },
            );



        if (!response.ok) {

            throw new Error(
                "Lead import failed",
            );

        }


        await refetch();

        setImportOpen(false);

    }





    return (

        <div
            className="p-6 space-y-6"
        >


            <div
                className="flex items-center justify-between"
            >

                <div>

                    <h1
                        className="text-2xl font-bold text-white"
                    >
                        Leads Management
                    </h1>


                    <p
                        className="mt-1 text-sm text-slate-400"
                    >
                        Entity Driven Lead Workspace
                    </p>

                </div>



                <div
                    className="flex gap-3"
                >

                    <button

                        type="button"

                        onClick={() =>
                            setImportOpen(true)
                        }

                        className="
                            rounded-md
                            border
                            px-4
                            py-2
                            text-sm
                            hover:bg-muted
                        "

                    >

                        Import Leads

                    </button>



                    <ExportButton

                        request={{
                            entityType:
                                "Lead",

                            format:
                                "CSV",
                        }}

                        label="Export Leads"

                    />


                </div>


            </div>





            <LeadTable

                leads={leads}

                loading={loading}

                onOpenLead={
                    handleOpenLead
                }

                onConvertLead={() => {}}

            />





            {
                importOpen
                &&
                (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-black/50
                        "
                    >

                        <ImportUploadDialog

                            entityType="Lead"

                            onSubmit={
                                async (
                                    request,
                                ) => {

                                    await handleImport(
                                        request,
                                    );

                                }
                            }


                            onClose={() =>
                                setImportOpen(false)
                            }

                        />

                    </div>

                )

            }






            <LeadModal

                lead={selectedLead}

                isOpen={modalOpen}

                onClose={
                    handleCloseModal
                }


                onUpdateStatus={
                    async (
                        leadId,
                        status,
                    ) => {

                        await handleUpdateStatus(
                            leadId,
                            status as LeadStatus,
                        );

                    }
                }

            />



        </div>

    );

}