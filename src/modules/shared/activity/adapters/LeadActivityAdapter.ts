import type { LeadTimeline } from "@/modules/leads/types/lead";

import type {
  ActivityAdapter,
  ActivityItem,
} from "../types/activity";

export class LeadActivityAdapter
  implements ActivityAdapter<LeadTimeline>
{
  toActivity(source: LeadTimeline): ActivityItem {
    return {
      id: source.id,

      organization_id: "",

      module: "crm",

      entity_type: "lead",

      entity_id: source.lead_id,

      event_type: source.event_type,

      title: source.message,

      description: null,

      metadata: {},

      actor: null,

      created_at: source.created_at ?? new Date().toISOString(),
    };
  }

  toActivities(source: LeadTimeline[]): ActivityItem[] {
    return source.map((item) => this.toActivity(item));
  }
}