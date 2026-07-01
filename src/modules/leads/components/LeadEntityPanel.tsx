"use client";

import EntityWorkspace from "@/components/entities/EntityWorkspace";

import {
  LEAD_ENTITY_TYPE,
  type LeadEntity,
} from "../types/lead.entity";

interface LeadEntityPanelProps {
  lead: LeadEntity;
}

export default function LeadEntityPanel({
  lead,
}: LeadEntityPanelProps) {
  return (
    <div className="space-y-6">

      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-semibold text-white">
              {lead.title}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {lead.email ?? "No email"}
            </p>

          </div>

          <div className="rounded-lg bg-cyan-600/20 px-3 py-2 text-sm font-medium text-cyan-300">
            {lead.status}
          </div>

        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Phone
            </p>

            <p className="text-white">
              {lead.phone ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Source
            </p>

            <p className="text-white">
              {lead.source ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Score
            </p>

            <p className="text-white">
              {lead.score ?? 0}
            </p>
          </div>

        </div>

      </div>

      <EntityWorkspace
        entityType={LEAD_ENTITY_TYPE}
        entityId={lead.entityId}
        activities={[]}
        notes={[]}
        tasks={[]}
        attachments={[]}
        notifications={[]}
      />

    </div>
  );
}