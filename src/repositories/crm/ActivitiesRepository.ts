import type {
  SupabaseClient,

} from "@supabase/supabase-js";

import {
  TenantContextManager,
} from "@/lib/tenant/tenantContext";

import type {
  Activity,
  ActivitySearchFilters,
  ActivityStatus,
  ActivitySummary,
  ActivityType,
} from "@/types/crm/Activities";

interface ActivityRow {
  id: string;
  entity_type: string;
  entity_id: string;
  activity_type: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  created_by: string;
}

function mapActivity(
  row: ActivityRow
): Activity {
  const metadata =
    row.metadata ?? {};

  const status =
    typeof metadata.status === "string"
      ? (metadata.status as ActivityStatus)
      : "Completed";

  const priority =
    typeof metadata.priority === "string"
      ? (metadata.priority as Activity["priority"])
      : "Medium";

  const title =
    typeof metadata.title === "string"
      ? metadata.title
      : row.activity_type;

  return {
    id: row.id,

    activityNumber:
      typeof metadata.activityNumber === "string"
        ? metadata.activityNumber
        : `ACT-${row.id.slice(0, 8)}`,

    organizationId:
      undefined,

    entityType: "Activity",

    entityId:
      row.entity_id,

    companyId:
      typeof metadata.companyId === "string"
        ? metadata.companyId
        : undefined,

    contactId:
      typeof metadata.contactId === "string"
        ? metadata.contactId
        : undefined,

    opportunityId:
      typeof metadata.opportunityId === "string"
        ? metadata.opportunityId
        : undefined,

    title,

    description:
      row.description ?? undefined,

    type:
      row.activity_type as ActivityType,

    status,

    priority,

    scheduledAt:
      typeof metadata.scheduledAt === "string"
        ? metadata.scheduledAt
        : undefined,

    startedAt:
      typeof metadata.startedAt === "string"
        ? metadata.startedAt
        : undefined,

    startDate:
      typeof metadata.startDate === "string"
        ? metadata.startDate
        : undefined,

    completedAt:
      typeof metadata.completedAt === "string"
        ? metadata.completedAt
        : undefined,

    dueAt:
      typeof metadata.dueAt === "string"
        ? metadata.dueAt
        : undefined,

    dueDate:
      typeof metadata.dueDate === "string"
        ? metadata.dueDate
        : undefined,

    durationMinutes:
      typeof metadata.durationMinutes === "number"
        ? metadata.durationMinutes
        : undefined,

    outcome:
      typeof metadata.outcome === "string"
        ? metadata.outcome
        : undefined,

    nextAction:
      typeof metadata.nextAction === "string"
        ? metadata.nextAction
        : undefined,

    reminderAt:
      typeof metadata.reminderAt === "string"
        ? metadata.reminderAt
        : undefined,

    reminderMinutes:
      typeof metadata.reminderMinutes === "number"
        ? metadata.reminderMinutes
        : undefined,

    ownerId:
      typeof metadata.ownerId === "string"
        ? metadata.ownerId
        : undefined,

    assignedTo:
      typeof metadata.assignedTo === "string"
        ? metadata.assignedTo
        : undefined,

    location:
      typeof metadata.location === "string"
        ? metadata.location
        : undefined,

    archived:
      false,

    isArchived:
      false,

    deletedAt:
      null,

    notes:
      typeof metadata.notes === "string"
        ? metadata.notes
        : undefined,

    metadata,

    createdAt:
      row.created_at,

    updatedAt:
      row.created_at,
  };
}

export class ActivitiesRepository {
  private readonly supabase: SupabaseClient;

  constructor(
    supabase: SupabaseClient
  ) {
    this.supabase =
      supabase;
  }

  private get organizationId(): string {
    return TenantContextManager
      .require()
      .organizationId;
  }

  /**
   * Resolve the current authenticated profile.
   *
   * Application-level membership validation.
   * Database RLS remains authoritative.
   */
  private async currentProfileId(): Promise<string> {
    const {
      data: {
        user,
      },
      error,
    } =
      await this.supabase.auth.getUser();

    if (error) {
      throw error;
    }

    if (!user) {
      throw new Error(
        "Authentication required."
      );
    }

    const {
      data,
      error: membershipError,
    } =
      await this.supabase
        .from("organization_members")
        .select("profile_id")
        .eq(
          "profile_id",
          user.id
        )
        .eq(
          "organization_id",
          this.organizationId
        )
        .eq(
          "is_active",
          true
        )
        .maybeSingle();

    if (membershipError) {
      throw membershipError;
    }

    if (!data) {
      throw new Error(
        "Authenticated user is not an active member of the current organization."
      );
    }

    return data.profile_id;
  }

  /**
   * IMPORTANT:
   * Do NOT await this method.
   *
   * It intentionally returns the Supabase query builder
   * so callers can continue chaining eq/ilike/order/etc.
   */
  private queryOwnedActivities(
    profileId: string
  ) {
    return this.supabase
      .from("activities")
      .select("*")
      .eq("created_by", profileId);
  }
  async list(): Promise<Activity[]> {
    const query =
      this.queryOwnedActivities(await this.currentProfileId());

    const {
      data,
      error,
    } =
      await query.order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {
      throw error;
    }

    return (
      (data ?? []) as ActivityRow[]
    ).map(
      mapActivity
    );
  }

  /**
   * Current activities schema has no archive column.
   *
   * Retained for service compatibility.
   */
  async listArchived(): Promise<Activity[]> {
    return [];
  }

  async findById(
    id: string
  ): Promise<Activity | null> {
    const query =
      this.queryOwnedActivities(await this.currentProfileId());

    const {
      data,
      error,
    } =
      await query
        .eq(
          "id",
          id
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data
      ? mapActivity(
          data as ActivityRow
        )
      : null;
  }

  async details(
    id: string
  ): Promise<Activity | null> {
    return this.findById(id);
  }

  async create(
    data: Partial<Activity>
  ): Promise<Activity> {
    const profileId =
      await this.currentProfileId();

    const now =
      new Date().toISOString();

    const metadata: Record<string, unknown> = {
      ...(data.metadata ?? {}),

      ...(data.activityNumber !== undefined
        ? {
            activityNumber:
              data.activityNumber,
          }
        : {}),

      ...(data.title !== undefined
        ? {
            title:
              data.title,
          }
        : {}),

      ...(data.status !== undefined
        ? {
            status:
              data.status,
          }
        : {}),

      ...(data.priority !== undefined
        ? {
            priority:
              data.priority,
          }
        : {}),

      ...(data.companyId !== undefined
        ? {
            companyId:
              data.companyId,
          }
        : {}),

      ...(data.contactId !== undefined
        ? {
            contactId:
              data.contactId,
          }
        : {}),

      ...(data.opportunityId !== undefined
        ? {
            opportunityId:
              data.opportunityId,
          }
        : {}),

      ...(data.scheduledAt !== undefined
        ? {
            scheduledAt:
              data.scheduledAt,
          }
        : {}),

      ...(data.startedAt !== undefined
        ? {
            startedAt:
              data.startedAt,
          }
        : {}),

      ...(data.startDate !== undefined
        ? {
            startDate:
              data.startDate,
          }
        : {}),

      ...(data.completedAt !== undefined
        ? {
            completedAt:
              data.completedAt,
          }
        : {}),

      ...(data.dueAt !== undefined
        ? {
            dueAt:
              data.dueAt,
          }
        : {}),

      ...(data.dueDate !== undefined
        ? {
            dueDate:
              data.dueDate,
          }
        : {}),

      ...(data.durationMinutes !== undefined
        ? {
            durationMinutes:
              data.durationMinutes,
          }
        : {}),

      ...(data.reminderAt !== undefined
        ? {
            reminderAt:
              data.reminderAt,
          }
        : {}),

      ...(data.reminderMinutes !== undefined
        ? {
            reminderMinutes:
              data.reminderMinutes,
          }
        : {}),

      ...(data.outcome !== undefined
        ? {
            outcome:
              data.outcome,
          }
        : {}),

      ...(data.nextAction !== undefined
        ? {
            nextAction:
              data.nextAction,
          }
        : {}),

      ...(data.location !== undefined
        ? {
            location:
              data.location,
          }
        : {}),

      ...(data.ownerId !== undefined
        ? {
            ownerId:
              data.ownerId,
          }
        : {}),

      ...(data.assignedTo !== undefined
        ? {
            assignedTo:
              data.assignedTo,
          }
        : {}),

      ...(data.notes !== undefined
        ? {
            notes:
              data.notes,
          }
        : {}),
    };

    const row = {
      id:
        data.id ??
        crypto.randomUUID(),

      entity_type:
        data.entityId
          ? (
              data.entityType ??
              "Activity"
            )
          : "Activity",

      entity_id:
        data.entityId ??
        crypto.randomUUID(),

      activity_type:
        data.type ??
        "Other",

      description:
        data.description ??
        null,

      metadata,

      created_at:
        now,

      created_by:
        profileId,
    };

    const {
      data: inserted,
      error,
    } =
      await this.supabase
        .from("activities")
        .insert(row)
        .select("*")
        .single();

    if (error) {
      throw error;
    }

    return mapActivity(
      inserted as ActivityRow
    );
  }

  async update(
    id: string,
    data: Partial<Activity>
  ): Promise<Activity | null> {
    const profileId =
      await this.currentProfileId();

    const existing =
      await this.findById(id);

    if (!existing) {
      return null;
    }

    const currentMetadata =
      existing.metadata ?? {};

    const metadata: Record<string, unknown> = {
      ...currentMetadata,
    };

    if (data.activityNumber !== undefined) {
      metadata.activityNumber =
        data.activityNumber;
    }

    if (data.title !== undefined) {
      metadata.title =
        data.title;
    }

    if (data.status !== undefined) {
      metadata.status =
        data.status;
    }

    if (data.priority !== undefined) {
      metadata.priority =
        data.priority;
    }

    if (data.companyId !== undefined) {
      metadata.companyId =
        data.companyId;
    }

    if (data.contactId !== undefined) {
      metadata.contactId =
        data.contactId;
    }

    if (data.opportunityId !== undefined) {
      metadata.opportunityId =
        data.opportunityId;
    }

    if (data.scheduledAt !== undefined) {
      metadata.scheduledAt =
        data.scheduledAt;
    }

    if (data.startedAt !== undefined) {
      metadata.startedAt =
        data.startedAt;
    }

    if (data.startDate !== undefined) {
      metadata.startDate =
        data.startDate;
    }

    if (data.completedAt !== undefined) {
      metadata.completedAt =
        data.completedAt;
    }

    if (data.dueAt !== undefined) {
      metadata.dueAt =
        data.dueAt;
    }

    if (data.dueDate !== undefined) {
      metadata.dueDate =
        data.dueDate;
    }

    if (data.durationMinutes !== undefined) {
      metadata.durationMinutes =
        data.durationMinutes;
    }

    if (data.outcome !== undefined) {
      metadata.outcome =
        data.outcome;
    }

    if (data.nextAction !== undefined) {
      metadata.nextAction =
        data.nextAction;
    }

    if (data.reminderAt !== undefined) {
      metadata.reminderAt =
        data.reminderAt;
    }

    if (data.reminderMinutes !== undefined) {
      metadata.reminderMinutes =
        data.reminderMinutes;
    }

    if (data.ownerId !== undefined) {
      metadata.ownerId =
        data.ownerId;
    }

    if (data.assignedTo !== undefined) {
      metadata.assignedTo =
        data.assignedTo;
    }

    if (data.location !== undefined) {
      metadata.location =
        data.location;
    }

    if (data.notes !== undefined) {
      metadata.notes =
        data.notes;
    }

    if (data.metadata !== undefined) {
      Object.assign(
        metadata,
        data.metadata
      );
    }

    const payload = {
      entity_type:
        data.entityId !== undefined
          ? (
              data.entityType ??
              existing.entityType
            )
          : undefined,

      entity_id:
        data.entityId ??
        existing.entityId,

      activity_type:
        data.type ??
        existing.type,

      description:
        data.description ??
        existing.description ??
        null,

      metadata,

      created_by:
        profileId,
    };

    if (payload.entity_type === undefined) {
      delete payload.entity_type;
    }

    const {
      data: updated,
      error,
    } =
      await this.supabase
        .from("activities")
        .update(payload)
        .eq("id", id)
        .eq("created_by", profileId)
        .select("*")
        .maybeSingle();

    if (error) {
      throw error;
    }

    return updated
      ? mapActivity(
          updated as ActivityRow
        )
      : null;
  }
  async updateStatus(
    id: string,
    status: ActivityStatus
  ): Promise<Activity> {
    const updated =
      await this.update(id, { status });

    if (!updated) {
      throw new Error(
        "Activity not found or access denied."
      );
    }

    return updated;
  }
  async delete(
    id: string
  ): Promise<void> {
    const existing =
      await this.findById(id);

    if (!existing) {
      return;
    }

    throw new Error(
      "Activity deletion is not supported by the current activities schema."
    );
  }

  async restore(
    id: string
  ): Promise<boolean> {
    const existing =
      await this.findById(id);

    return existing !== null;
  }

  async search(
    filters?: ActivitySearchFilters
  ): Promise<Activity[]> {
    const query =
      this.queryOwnedActivities(await this.currentProfileId());

    let builder =
      query;

    if (filters?.entityType) {
      builder =
        builder.eq(
          "entity_type",
          filters.entityType
        );
    }

    if (filters?.entityId) {
      builder =
        builder.eq(
          "entity_id",
          filters.entityId
        );
    }

    if (filters?.type) {
      builder =
        builder.eq(
          "activity_type",
          filters.type
        );
    }

    if (filters?.keyword) {
      builder =
        builder.ilike(
          "description",
          `%${filters.keyword}%`
        );
    } else if (
      filters?.search
    ) {
      builder =
        builder.ilike(
          "description",
          `%${filters.search}%`
        );
    }

    const {
      data,
      error,
    } =
      await builder.order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {
      throw error;
    }

    let activities =
      (
        (data ?? []) as ActivityRow[]
      ).map(
        mapActivity
      );

    if (filters?.status) {
      activities =
        activities.filter(
          (activity) =>
            activity.status ===
            filters.status
        );
    }

    if (filters?.priority) {
      activities =
        activities.filter(
          (activity) =>
            activity.priority ===
            filters.priority
        );
    }

    if (filters?.companyId) {
      activities =
        activities.filter(
          (activity) =>
            activity.companyId ===
            filters.companyId
        );
    }

    if (filters?.contactId) {
      activities =
        activities.filter(
          (activity) =>
            activity.contactId ===
            filters.contactId
        );
    }

    if (filters?.opportunityId) {
      activities =
        activities.filter(
          (activity) =>
            activity.opportunityId ===
            filters.opportunityId
        );
    }

    if (filters?.ownerId) {
      activities =
        activities.filter(
          (activity) =>
            activity.ownerId ===
            filters.ownerId
        );
    }

    if (filters?.assignedTo) {
      activities =
        activities.filter(
          (activity) =>
            activity.assignedTo ===
            filters.assignedTo
        );
    }

    if (filters?.fromDate) {
      activities =
        activities.filter(
          (activity) =>
            !!activity.startDate &&
            activity.startDate >=
              filters.fromDate!
        );
    }

    if (filters?.toDate) {
      activities =
        activities.filter(
          (activity) =>
            !!activity.startDate &&
            activity.startDate <=
              filters.toDate!
        );
    }

    if (
      filters?.page !== undefined &&
      filters?.limit !== undefined
    ) {
      const page =
        Math.max(
          filters.page,
          1
        );

      const limit =
        Math.max(
          filters.limit,
          1
        );

      const offset =
        (page - 1) *
        limit;

      activities =
        activities.slice(
          offset,
          offset + limit
        );
    }

    return activities;
  }

  async summary(): Promise<ActivitySummary> {
    const activities =
      await this.list();

    const today =
      new Date()
        .toISOString()
        .substring(0, 10);

    const completed =
      activities.filter(
        (activity) =>
          activity.status ===
          "Completed"
      ).length;

    return {
      total:
        activities.length,

      planned:
        activities.filter(
          (activity) =>
            activity.status ===
            "Planned"
        ).length,

      inProgress:
        activities.filter(
          (activity) =>
            activity.status ===
            "In Progress"
        ).length,

      completed,

      cancelled:
        activities.filter(
          (activity) =>
            activity.status ===
            "Cancelled"
        ).length,

      missed:
        activities.filter(
          (activity) =>
            activity.status ===
            "Missed"
        ).length,

      overdue:
        activities.filter(
          (activity) =>
            !!activity.startDate &&
            activity.startDate <
              today &&
            activity.status !==
              "Completed" &&
            activity.status !==
              "Cancelled"
        ).length,

      today:
        activities.filter(
          (activity) =>
            activity.startDate ===
            today
        ).length,

      upcoming:
        activities.filter(
          (activity) =>
            !!activity.startDate &&
            activity.startDate >
              today
        ).length,

      highPriority:
        activities.filter(
          (activity) =>
            activity.priority ===
              "High" ||
            activity.priority ===
              "Critical"
        ).length,

      archived:
        0,

      completionRate:
        activities.length === 0
          ? 0
          : Math.round(
              (
                completed /
                activities.length
              ) * 100
            ),
    };
  }

  async findByEntity(
    entityType: string,
    entityId: string
  ): Promise<Activity[]> {
    const query =
      this.queryOwnedActivities(await this.currentProfileId());

    const {
      data,
      error,
    } =
      await query
        .eq(
          "entity_type",
          entityType
        )
        .eq(
          "entity_id",
          entityId
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (error) {
      throw error;
    }

    return (
      (data ?? []) as ActivityRow[]
    ).map(
      mapActivity
    );
  }
}

export function createActivitiesRepository(
  supabase: SupabaseClient
): ActivitiesRepository {
  return new ActivitiesRepository(
    supabase
  );
}

export const ActivitiesRepositoryInstance =
  createActivitiesRepository;





