import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Activity,
  ActivityPriority,
  ActivitySearchFilters,
  ActivityStatus,
  ActivitySummary,
  ActivityType,
} from "@/types/crm/Activities";

type ActivityRow = {
  id?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  activity_type?: string | null;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
};

function asRecord(
  value: unknown
): Record<string, unknown> {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(
  value: unknown,
  fallback = ""
): string {
  return typeof value === "string"
    ? value
    : fallback;
}

function asActivityType(
  value: unknown
): ActivityType {
  return typeof value === "string"
    ? (value as ActivityType)
    : ("Other" as ActivityType);
}

function asActivityStatus(
  value: unknown
): ActivityStatus {
  return typeof value === "string"
    ? (value as ActivityStatus)
    : ("Planned" as ActivityStatus);
}

function asActivityPriority(
  value: unknown
): ActivityPriority {
  return typeof value === "string"
    ? (value as ActivityPriority)
    : ("Medium" as ActivityPriority);
}

function mapActivity(
  row: ActivityRow
): Activity {
  const metadata = asRecord(
    row.metadata
  );

  const id =
    asString(row.id) ||
    crypto.randomUUID();

  const createdAt =
    asString(
      row.created_at
    ) ||
    new Date().toISOString();

  const updatedAt =
    asString(
      row.updated_at
    ) ||
    createdAt;

  const entityId =
    asString(
      row.entity_id
    ) ||
    id;

  const activityNumber =
    asString(
      metadata.activityNumber
    ) ||
    id;

  const title =
    asString(
      metadata.title
    ) ||
    asString(
      row.description
    ) ||
    "Activity";

  return {
    id,

    entityType:
      "Activity",

    entityId,

    type:
      asActivityType(
        row.activity_type
      ),

    activityNumber,

    title,

    description:
      row.description ??
      undefined,

    status:
      asActivityStatus(
        metadata.status
      ),

    priority:
      asActivityPriority(
        metadata.priority
      ),

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

    createdAt,

    updatedAt,
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

  /**
   * Resolve the authenticated Supabase user.
   *
   * Tenant isolation is enforced by database RLS.
   * This repository intentionally does not depend on a
   * TenantContextManager because the current project
   * does not expose that module.
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

    return user.id;
  }

  /**
   * Returns the query builder intentionally so callers
   * can continue chaining Supabase filters.
   */
  private queryOwnedActivities(
    profileId: string
  ) {
    return this.supabase
      .from("activities")
      .select("*")
      .eq(
        "created_by",
        profileId
      );
  }

  async list(): Promise<Activity[]> {
    const profileId =
      await this.currentProfileId();

    const {
      data,
      error,
    } =
      await this
        .queryOwnedActivities(
          profileId
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

  /**
   * Current activities schema has no archive column.
   */
  async listArchived(): Promise<Activity[]> {
    return [];
  }

  async findById(
    id: string
  ): Promise<Activity | null> {
    const profileId =
      await this.currentProfileId();

    const {
      data,
      error,
    } =
      await this
        .queryOwnedActivities(
          profileId
        )
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
    };

    if (
      data.activityNumber !==
      undefined
    ) {
      metadata.activityNumber =
        data.activityNumber;
    }

    if (
      data.title !==
      undefined
    ) {
      metadata.title =
        data.title;
    }

    if (
      data.status !==
      undefined
    ) {
      metadata.status =
        data.status;
    }

    if (
      data.priority !==
      undefined
    ) {
      metadata.priority =
        data.priority;
    }

    if (
      data.companyId !==
      undefined
    ) {
      metadata.companyId =
        data.companyId;
    }

    if (
      data.contactId !==
      undefined
    ) {
      metadata.contactId =
        data.contactId;
    }

    if (
      data.opportunityId !==
      undefined
    ) {
      metadata.opportunityId =
        data.opportunityId;
    }

    if (
      data.scheduledAt !==
      undefined
    ) {
      metadata.scheduledAt =
        data.scheduledAt;
    }

    if (
      data.startedAt !==
      undefined
    ) {
      metadata.startedAt =
        data.startedAt;
    }

    if (
      data.startDate !==
      undefined
    ) {
      metadata.startDate =
        data.startDate;
    }

    if (
      data.completedAt !==
      undefined
    ) {
      metadata.completedAt =
        data.completedAt;
    }

    if (
      data.dueAt !==
      undefined
    ) {
      metadata.dueAt =
        data.dueAt;
    }

    if (
      data.dueDate !==
      undefined
    ) {
      metadata.dueDate =
        data.dueDate;
    }

    if (
      data.durationMinutes !==
      undefined
    ) {
      metadata.durationMinutes =
        data.durationMinutes;
    }

    if (
      data.reminderAt !==
      undefined
    ) {
      metadata.reminderAt =
        data.reminderAt;
    }

    if (
      data.reminderMinutes !==
      undefined
    ) {
      metadata.reminderMinutes =
        data.reminderMinutes;
    }

    if (
      data.outcome !==
      undefined
    ) {
      metadata.outcome =
        data.outcome;
    }

    if (
      data.nextAction !==
      undefined
    ) {
      metadata.nextAction =
        data.nextAction;
    }

    if (
      data.location !==
      undefined
    ) {
      metadata.location =
        data.location;
    }

    if (
      data.ownerId !==
      undefined
    ) {
      metadata.ownerId =
        data.ownerId;
    }

    if (
      data.assignedTo !==
      undefined
    ) {
      metadata.assignedTo =
        data.assignedTo;
    }

    if (
      data.notes !==
      undefined
    ) {
      metadata.notes =
        data.notes;
    }

    const row = {
      id:
        data.id ??
        crypto.randomUUID(),

      entity_type:
        "Activity",

      entity_id:
        data.entityId ??
        data.id ??
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

    if (
      data.activityNumber !==
      undefined
    ) {
      metadata.activityNumber =
        data.activityNumber;
    }

    if (
      data.title !==
      undefined
    ) {
      metadata.title =
        data.title;
    }

    if (
      data.status !==
      undefined
    ) {
      metadata.status =
        data.status;
    }

    if (
      data.priority !==
      undefined
    ) {
      metadata.priority =
        data.priority;
    }

    if (
      data.companyId !==
      undefined
    ) {
      metadata.companyId =
        data.companyId;
    }

    if (
      data.contactId !==
      undefined
    ) {
      metadata.contactId =
        data.contactId;
    }

    if (
      data.opportunityId !==
      undefined
    ) {
      metadata.opportunityId =
        data.opportunityId;
    }

    if (
      data.scheduledAt !==
      undefined
    ) {
      metadata.scheduledAt =
        data.scheduledAt;
    }

    if (
      data.startedAt !==
      undefined
    ) {
      metadata.startedAt =
        data.startedAt;
    }

    if (
      data.startDate !==
      undefined
    ) {
      metadata.startDate =
        data.startDate;
    }

    if (
      data.completedAt !==
      undefined
    ) {
      metadata.completedAt =
        data.completedAt;
    }

    if (
      data.dueAt !==
      undefined
    ) {
      metadata.dueAt =
        data.dueAt;
    }

    if (
      data.dueDate !==
      undefined
    ) {
      metadata.dueDate =
        data.dueDate;
    }

    if (
      data.durationMinutes !==
      undefined
    ) {
      metadata.durationMinutes =
        data.durationMinutes;
    }

    if (
      data.outcome !==
      undefined
    ) {
      metadata.outcome =
        data.outcome;
    }

    if (
      data.nextAction !==
      undefined
    ) {
      metadata.nextAction =
        data.nextAction;
    }

    if (
      data.reminderAt !==
      undefined
    ) {
      metadata.reminderAt =
        data.reminderAt;
    }

    if (
      data.reminderMinutes !==
      undefined
    ) {
      metadata.reminderMinutes =
        data.reminderMinutes;
    }

    if (
      data.ownerId !==
      undefined
    ) {
      metadata.ownerId =
        data.ownerId;
    }

    if (
      data.assignedTo !==
      undefined
    ) {
      metadata.assignedTo =
        data.assignedTo;
    }

    if (
      data.location !==
      undefined
    ) {
      metadata.location =
        data.location;
    }

    if (
      data.notes !==
      undefined
    ) {
      metadata.notes =
        data.notes;
    }

    if (
      data.metadata !==
      undefined
    ) {
      Object.assign(
        metadata,
        data.metadata
      );
    }

    const payload = {
      entity_type:
        "Activity",

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
    };

    const {
      data: updated,
      error,
    } =
      await this.supabase
        .from("activities")
        .update(payload)
        .eq(
          "id",
          id
        )
        .eq(
          "created_by",
          profileId
        )
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
      await this.update(
        id,
        {
          status,
        }
      );

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
    const profileId =
      await this.currentProfileId();

    let builder =
      this.queryOwnedActivities(
        profileId
      );

    if (
      filters?.entityType
    ) {
      builder =
        builder.eq(
          "entity_type",
          filters.entityType
        );
    }

    if (
      filters?.entityId
    ) {
      builder =
        builder.eq(
          "entity_id",
          filters.entityId
        );
    }

    if (
      filters?.type
    ) {
      builder =
        builder.eq(
          "activity_type",
          filters.type
        );
    }

    if (
      filters?.keyword
    ) {
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

    if (
      filters?.status
    ) {
      activities =
        activities.filter(
          (activity) =>
            activity.status ===
            filters.status
        );
    }

    if (
      filters?.priority
    ) {
      activities =
        activities.filter(
          (activity) =>
            activity.priority ===
            filters.priority
        );
    }

    if (
      filters?.companyId
    ) {
      activities =
        activities.filter(
          (activity) =>
            activity.companyId ===
            filters.companyId
        );
    }

    if (
      filters?.contactId
    ) {
      activities =
        activities.filter(
          (activity) =>
            activity.contactId ===
            filters.contactId
        );
    }

    if (
      filters?.opportunityId
    ) {
      activities =
        activities.filter(
          (activity) =>
            activity.opportunityId ===
            filters.opportunityId
        );
    }

    if (
      filters?.ownerId
    ) {
      activities =
        activities.filter(
          (activity) =>
            activity.ownerId ===
            filters.ownerId
        );
    }

    if (
      filters?.assignedTo
    ) {
      activities =
        activities.filter(
          (activity) =>
            activity.assignedTo ===
            filters.assignedTo
        );
    }

    if (
      filters?.fromDate
    ) {
      activities =
        activities.filter(
          (activity) =>
            !!activity.startDate &&
            activity.startDate >=
              filters.fromDate!
        );
    }

    if (
      filters?.toDate
    ) {
      activities =
        activities.filter(
          (activity) =>
            !!activity.startDate &&
            activity.startDate <=
              filters.toDate!
        );
    }

    if (
      filters?.page !==
        undefined &&
      filters?.limit !==
        undefined
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
        .substring(
          0,
          10
        );

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
              ) *
                100
            ),
    };
  }

  async findByEntity(
    entityType: string,
    entityId: string
  ): Promise<Activity[]> {
    const profileId =
      await this.currentProfileId();

    const {
      data,
      error,
    } =
      await this
        .queryOwnedActivities(
          profileId
        )
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