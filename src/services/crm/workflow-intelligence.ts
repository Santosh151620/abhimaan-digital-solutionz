import { getInactiveLeads } from "./lead-intelligence";
import { getPipelineData } from "./pipeline";
import { getRevenueIntelligence } from "./revenue-intelligence";
import { getProjects } from "@/modules/projects/services/projects";

export interface WorkflowLead {
  id: string;
  name: string;
  email: string;
}

export interface TodayTask {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  type: "call" | "follow_up" | "deal" | "task";
}

export interface WorkflowSnapshot {
  inactiveLeads: Awaited<ReturnType<typeof getInactiveLeads>>;

  pipeline: Awaited<ReturnType<typeof getPipelineData>>;

  revenue: Awaited<ReturnType<typeof getRevenueIntelligence>>;

  projects: Awaited<ReturnType<typeof getProjects>>;

  copilot: {
    callToday: WorkflowLead[];
    followUpUrgent: WorkflowLead[];
    highConversionLeads: WorkflowLead[];
  };

  today: TodayTask[];
}

export async function getWorkflowIntelligence(): Promise<WorkflowSnapshot> {
  const [
    inactiveLeads,
    pipeline,
    revenue,
    projects,
  ] = await Promise.all([
    getInactiveLeads(),
    getPipelineData(),
    getRevenueIntelligence(),
    getProjects(),
  ]);

  const activeLeads = [
    ...pipeline.stages.new,
    ...pipeline.stages.contacted,
    ...pipeline.stages.qualified,
    ...pipeline.stages.proposal,
  ];

  const callToday: WorkflowLead[] = activeLeads
    .slice(0, 5)
    .map((lead) => ({
      id: lead.id,
      name: lead.full_name,
      email: lead.email,
    }));

  const followUpUrgent: WorkflowLead[] = inactiveLeads
    .slice(0, 5)
    .map((lead) => ({
      id: lead.id,
      name: lead.full_name,
      email: lead.email,
    }));

  const highConversionLeads: WorkflowLead[] = activeLeads
    .filter((lead) => lead.priority === "hot")
    .slice(0, 5)
    .map((lead) => ({
      id: lead.id,
      name: lead.full_name,
      email: lead.email,
    }));

  const today: TodayTask[] = [
    ...callToday.map((lead) => ({
      id: `call-${lead.id}`,
      title: `Call ${lead.name}`,
      description: lead.email,
      priority: "high" as const,
      type: "call" as const,
    })),

    ...followUpUrgent.map((lead) => ({
      id: `follow-${lead.id}`,
      title: `Follow up with ${lead.name}`,
      description: lead.email,
      priority: "medium" as const,
      type: "follow_up" as const,
    })),

    ...highConversionLeads.map((lead) => ({
      id: `deal-${lead.id}`,
      title: `Close deal with ${lead.name}`,
      description: lead.email,
      priority: "high" as const,
      type: "deal" as const,
    })),
  ];

  return {
    inactiveLeads,

    pipeline,

    revenue,

    projects,

    copilot: {
      callToday,
      followUpUrgent,
      highConversionLeads,
    },

    today,
  };
}
