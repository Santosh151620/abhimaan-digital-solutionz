import EntityOverviewGrid from "@/components/entities/EntityOverviewGrid";

import type { Lead } from "../types/lead";

interface Props {
  lead: Lead;
}

export default function LeadOverview({
  lead,
}: Props) {
  return (
    <EntityOverviewGrid
  items={[
    {
      title: "Status",
      value: lead.status,
    },
    {
      title: "Source",
      value: lead.source ?? "-",
    },
    {
      title: "Company",
      value: lead.company ?? "-",
    },
    {
      title: "Service",
      value: lead.service_interest ?? "-",
    },
    {
      title: "Created",
      value: lead.created_at
        ? new Date(lead.created_at).toLocaleDateString()
        : "-",
    },
  ]}
/>
  );
}




