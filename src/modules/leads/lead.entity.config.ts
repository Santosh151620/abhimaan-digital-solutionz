import { LEAD_ENTITY_TYPE } from './types/lead.entity';

/**
 * CENTRAL ENTITY CONFIG
 * Used later for unified CRM entity registry
 */

export const LeadEntityConfig = {
  entityType: LEAD_ENTITY_TYPE,

  table: 'leads',

  routes: {
    list: '/leads',
    detail: '/leads/:entityId',
  },

  api: {
    base: '/api/leads',
  },

  features: {
    activities: true,
    notes: true,
    attachments: false,
    notifications: false,
  },
};





