import {
    PaymentsRepositoryInstance,
} from '@/repositories/crm/PaymentsRepository';

import type {
    Payment,
    PaymentStatus,
    PaymentSummary,
    PaymentSearchFilters,
} from '@/types/crm/Payments';


class PaymentsService {

    async list(): Promise<Payment[]> {

        return PaymentsRepositoryInstance.list();

    }

    async listArchived(): Promise<Payment[]> {

        return PaymentsRepositoryInstance.listArchived();

    }

    async details(
        id: string,
    ): Promise<Payment | null> {

        return PaymentsRepositoryInstance.details(
            id,
        );

    }

    async findById(
        id: string,
    ): Promise<Payment | null> {

        return PaymentsRepositoryInstance.findById(
            id,
        );

    }

    async search(
        filters?: PaymentSearchFilters,
    ): Promise<Payment[]> {

        return PaymentsRepositoryInstance.search(
            filters,
        );

    }

    async create(
        data: Partial<Payment>,
    ): Promise<Payment> {

        return PaymentsRepositoryInstance.create(
            data,
        );

    }

    async update(
        id: string,
        data: Partial<Payment>,
    ): Promise<Payment | null> {

        return PaymentsRepositoryInstance.update(
            id,
            data,
        );

    }

    async updateStatus(
        id: string,
        status: PaymentStatus,
    ): Promise<Payment | null> {

        return PaymentsRepositoryInstance.updateStatus(
            id,
            status,
        );

    }

    async delete(
        id: string,
    ): Promise<boolean> {

        return PaymentsRepositoryInstance.delete(
            id,
        );

    }

    async restore(
        id: string,
    ): Promise<boolean> {

        return PaymentsRepositoryInstance.restore(
            id,
        );

    }

    async summary(): Promise<PaymentSummary> {

        return PaymentsRepositoryInstance.summary();

    }

}

export async function createPaymentsService(): Promise<PaymentsService> {

    return new PaymentsService();

}

export const PaymentsServiceInstance =
    new PaymentsService();

export {
    PaymentsService,
};

