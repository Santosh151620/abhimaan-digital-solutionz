export type EntityType = string;

export interface EntityReference {
  entityType: EntityType;
  entityId: string;
}

export interface AuditFields {
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedAt?: string | null;
  deletedBy?: string | null;
}

export interface BaseEntity extends AuditFields {
  id: string;
  entityType: EntityType;
  isDeleted?: boolean;
}

export interface ServiceResult<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}