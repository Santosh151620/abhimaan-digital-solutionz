"use client";

import { useState } from "react";

import LeadModal from "@/components/dashboard/LeadModal";
import LeadTable from "@/components/dashboard/LeadTable";

import { useLeads } from "@/modules/leads/hooks/useLeads";
import { updateLead } from "@/modules/leads/api/lead.api";

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
        leads={leads}
        loading={loading}
        onOpenLead={handleOpenLead}
        onConvertLead={() => {}}
      />

      <LeadModal
        lead={selectedLead}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}