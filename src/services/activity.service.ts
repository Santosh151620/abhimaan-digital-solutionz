import type { Activity } from "@/types/activity";
import { ActivityRepository } from "@/repositories/activity.repository";

export class ActivityService {
  constructor(
    private readonly repository: ActivityRepository,
  ) {}

  getByEntity(
    entityType: string,
    entityId: string,
  ): Promise<Activity[]> {
    return this.repository.findByEntity(
      entityType,
      entityId,
    );
  }

  create(
    activity: Partial<Activity>,
  ): Promise<Activity> {
    return this.repository.create(activity);
  }
}
