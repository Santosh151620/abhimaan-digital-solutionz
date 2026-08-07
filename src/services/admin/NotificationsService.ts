import {
    NotificationsRepository,
} from "@/repositories/admin/NotificationsRepository";

import type {
    Notification,
} from "@/types/admin/Notification";

export class NotificationsService {

    private readonly repository =
        new NotificationsRepository();

    async getAll(): Promise<Notification[]> {

        return this.repository.findAll();

    }

    async getById(
        id: string,
    ): Promise<Notification | null> {

        return this.repository.findById(
            id,
        );

    }

    async getByUser(
        userId: string,
    ): Promise<Notification[]> {

        return this.repository.findByUser(
            userId,
        );

    }

    async create(
        notification: Partial<Notification>,
    ): Promise<Notification> {

        return this.repository.create(
            notification,
        );

    }

    async markAsRead(
        id: string,
    ): Promise<void> {

        await this.repository.markAsRead(
            id,
        );

    }

    async delete(
        id: string,
    ): Promise<void> {

        await this.repository.delete(
            id,
        );

    }

}