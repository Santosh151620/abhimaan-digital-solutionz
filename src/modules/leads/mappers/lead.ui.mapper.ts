import type { Lead } from "@/types/lead";
import type { LeadEntity } from "../types/lead.entity";

export function toLead(entity: LeadEntity): Lead {
  return {
    id: entity.entityId,

    created_at: entity.createdAt,

    full_name: entity.title,

    email: entity.email ?? "",

    phone: entity.phone ?? null,

    company: null,

    service_interest: null,

    message: null,

    source: entity.source ?? null,

    status: entity.status as Lead["status"],

    client_id: null,
  };
}
