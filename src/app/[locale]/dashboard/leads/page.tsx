"use client";
import type { LeadStatus } from "@/types/lead";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import LeadTable, {
  LeadTableItem,
} from "@/components/dashboard/LeadTable";

import LeadModal from "@/components/dashboard/LeadModal";

const supabase = createClient();

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadTableItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLead, setSelectedLead] =
    useState<LeadTableItem | null>(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  /* ================= FETCH LEADS ================= */

  async function fetchLeads() {
    setLoading(true);

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLeads(data as LeadTableItem[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  /* ================= OPEN MODAL ================= */

  function handleOpenLead(lead: LeadTableItem) {
    setSelectedLead(lead);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setSelectedLead(null);
    setModalOpen(false);
  }

  /* ================= REFRESH ================= */

  async function handleRefresh() {
    await fetchLeads();
  }

  /* ================= STATUS UPDATE HANDLER ================= */

  async function handleUpdateStatus(
  leadId: string,
  status: LeadStatus
)
{
    const { error } = await supabase
      .from("leads")
      .update({ status: status as LeadStatus })
      .eq("id", leadId);

    if (!error) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, status } : l
        )
      );
    }
  }

  /* ================= RENDER ================= */

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Leads Management
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Clean CRM orchestration layer with modular components
        </p>
      </div>

      {/* TABLE */}
      <LeadTable
        leads={leads}
        loading={loading}
        onOpenLead={handleOpenLead}
        onConvertLead={() => {}}
      />

      {/* MODAL */}
      <LeadModal
        lead={selectedLead}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}