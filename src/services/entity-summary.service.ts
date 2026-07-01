import type { EntitySummary } from "@/types/entity";

export class EntitySummaryService {
  createEmptySummary(
    entityType: string,
    entityId: string,
  ): EntitySummary {
    return {
      entityType,
      entityId,

      activityCount: 0,
      notesCount: 0,
      tasksCount: 0,
      attachmentsCount: 0,
      notificationsCount: 0,
    };
  }
}