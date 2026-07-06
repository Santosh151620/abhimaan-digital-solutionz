import React from "react";
//import { LeadEntity } from "@/modules/entities/LeadEntity";
import type { LeadEntity } from "../types/lead.entity";
/**
 * LeadCard
 * Strict LeadEntity-only UI contract
 */

export type LeadCardProps = {
  lead: LeadEntity;
  onClick?: (lead: LeadEntity) => void;
  className?: string;
};

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onClick,
  className = "",
}) => {
  if (!lead) return null;

  return (
    <div
      className={`lead-card ${className}`}
      onClick={() => onClick?.(lead)}
    >
      <div className="lead-card__header">
        <div className="lead-card__title">{lead.entityId}</div>
        <div className="lead-card__meta">{lead.status}</div>
      </div>

      <div className="lead-card__body">
        <div className="lead-card__row">
          <span>Email:</span> {lead.email}
        </div>

        <div className="lead-card__row">
          <span>Phone:</span> {lead.phone}
        </div>

        <div className="lead-card__row">
          <span>Source:</span> {lead.source}
        </div>
      </div>

      <div className="lead-card__footer">
        ID: {lead.entityId}
      </div>
    </div>
  );
};