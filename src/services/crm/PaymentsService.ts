import {
    PaymentsRepositoryInstance,
} from '@/repositories/crm/PaymentsRepository';

import type {
    Payment,
    PaymentStatus,
} from '@/types/crm/Payments';

class PaymentsService {

    list() {

        return PaymentsRepositoryInstance.list();

    }

    listArchived() {

        return PaymentsRepositoryInstance.listArchived();

    }

    details(
        id: string,
    ) {

        return PaymentsRepositoryInstance.details(
            id,
        );

    }

    create(
        data: Partial<Payment>,
    ) {

        return PaymentsRepositoryInstance.create(
            data,
        );

    }

    update(
        id: string,
        data: Partial<Payment>,
    ) {

        return PaymentsRepositoryInstance.update(
            id,
            data,
        );

    }

    updateStatus(
        id: string,
        status: PaymentStatus,
    ) {

        return PaymentsRepositoryInstance.updateStatus(
            id,
            status,
        );

    }

    delete(
        id: string,
    ) {

        return PaymentsRepositoryInstance.delete(
            id,
        );

    }

    restore(
        id: string,
    ) {

        return PaymentsRepositoryInstance.restore(
            id,
        );

    }

    summary() {

        return PaymentsRepositoryInstance.summary();

    }

}

export async function createPaymentsService() {

    return new PaymentsService();

}

export const PaymentsServiceInstance =
    new PaymentsService();