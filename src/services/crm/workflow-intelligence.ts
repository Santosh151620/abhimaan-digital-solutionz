import { getInactiveLeads } from "./lead-intelligence";
import { getPipelineData } from "./pipeline";
import { getRevenueIntelligence } from "./revenue-intelligence";
import { getProjects } from "@/modules/projects/services/projects";

interface WorkflowLead {
  id: string;
  name: string;
  email: string;
}

interface TodayTask {
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

function toWorkflowLead(lead: {
  id: string;
  full_name: string;
  email: string;
}): WorkflowLead {
  return {
    id: lead.id,
    name: lead.full_name,
    email: lead.email,
  };
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
    .map(toWorkflowLead);

  const followUpUrgent: WorkflowLead[] = inactiveLeads
    .slice(0, 5)
    .map(toWorkflowLead);

  const highConversionLeads: WorkflowLead[] = activeLeads
    .filter((lead) => lead.priority === "hot")
    .slice(0, 5)
    .map(toWorkflowLead);

  const today: TodayTask[] = [
    ...callToday.map((lead): TodayTask => ({
      id: `call-${lead.id}`,
      title: `Call ${lead.name}`,
      description: lead.email,
      priority: "high",
      type: "call",
    })),

    ...followUpUrgent.map((lead): TodayTask => ({
      id: `follow-${lead.id}`,
      title: `Follow up with ${lead.name}`,
      description: lead.email,
      priority: "medium",
      type: "follow_up",
    })),

    ...highConversionLeads.map((lead): TodayTask => ({
      id: `deal-${lead.id}`,
      title: `Close deal with ${lead.name}`,
      description: lead.email,
      priority: "high",
      type: "deal",
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
