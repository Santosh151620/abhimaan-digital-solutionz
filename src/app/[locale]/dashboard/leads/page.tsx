"use client";

import { useState } from "react";
import LeadModal from "@/modules/leads/components/LeadModal";
import LeadTable from "@/modules/leads/components/LeadTable";
import { useLeads } from "@/modules/leads/hooks/useLeads";
import { updateLead } from "@/modules/leads/api/lead.api";
import { toLead } from "@/modules/leads/mappers/lead.ui.mapper";
import type { LeadEntity, LeadStatus } from "@/modules/leads/types/lead.entity";



export default function LeadsPage() {
  const {
    leads,
    loading,
    refetch,
  } = useLeads();


  const [selectedLead, setSelectedLead] =
    useState<LeadEntity | null>(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const uiLeads = leads.map(toLead);

  const selectedUiLead =
    selectedLead ? toLead(selectedLead) : null;

  function handleOpenLead(
    lead: LeadEntity
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
    status: LeadStatus
  ) {
    await updateLead(entityId, {
      entityId,
      status,
    });

    await refetch();
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Leads Management
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Entity Driven Lead Workspace
        </p>
      </div>

      <LeadTable
        leads={uiLeads}
        loading={loading}
        onOpenLead={(lead) => {
          const entity = leads.find(
            (l) => l.entityId === lead.id
          );

          if (entity) {
            handleOpenLead(entity);
          }
        }}
        onConvertLead={() => { }}
      />

      <LeadModal
        lead={selectedUiLead}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onUpdateStatus={async (leadId, status) => {
          await handleUpdateStatus(
            leadId,
            status as LeadStatus
          );
        }}
      />
    </div>
  );
}