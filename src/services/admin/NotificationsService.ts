import {
    NotificationsRepository,
} from "@/repositories/admin/NotificationsRepository";


import type {
    Notification,
} from "@/types/admin/Notification";


export class NotificationsService {


    private readonly repository:
        NotificationsRepository;


    constructor(

        repository:
            NotificationsRepository =
                new NotificationsRepository(),

    ) {

        this.repository =
            repository;

    }


    async getAll():

    Promise<Notification[]> {

        return this.repository.findAll();

    }


    async getById(

        id: string,

    ):

    Promise<Notification | null> {

        const normalizedId =
            this.validateId(
                id,
            );


        return this.repository.findById(

            normalizedId,

        );

    }


    async getByUser(

        userId: string,

    ):

    Promise<Notification[]> {

        const normalizedUserId =
            this.validateUserId(
                userId,
            );


        return this.repository.findByUser(

            normalizedUserId,

        );

    }


    async create(

        notification:
            Partial<Notification>,

    ):

    Promise<Notification> {

        if (!notification) {

            throw new Error(

                "Notification is required.",

            );

        }


        return this.repository.create(

            notification,

        );

    }


    async markAsRead(

        id: string,

    ):

    Promise<void> {

        const normalizedId =
            this.validateId(
                id,
            );


        await this.repository.markAsRead(

            normalizedId,

        );

    }


    async delete(

        id: string,

    ):

    Promise<void> {

        const normalizedId =
            this.validateId(
                id,
            );


        await this.repository.delete(

            normalizedId,

        );

    }


    private validateId(

        id: string,

    ): string {

        const normalizedId =
            typeof id ===
            "string"
                ? id.trim()
                : "";


        if (!normalizedId) {

            throw new Error(

                "Notification id is required.",

            );

        }


        return normalizedId;

    }


    private validateUserId(

        userId: string,

    ): string {

        const normalizedUserId =
            typeof userId ===
            "string"
                ? userId.trim()
                : "";


        if (!normalizedUserId) {

            throw new Error(

                "Notification user id is required.",

            );

        }


        return normalizedUserId;

    }

}