import type { Notification } from "@/types/notifications";
import { NotificationsRepository } from "@/repositories/notifications.repository";

export class NotificationsService {
  constructor(
    private readonly repository: NotificationsRepository,
  ) {}

  getByEntity(
    entityType: string,
    entityId: string,
  ): Promise<Notification[]> {
    return this.repository.findByEntity(
      entityType,
      entityId,
    );
  }

  create(
    notification: Partial<Notification>,
  ): Promise<Notification> {
    return this.repository.create(
      notification,
    );
  }
}
