import {
    createClient,
} from '@/lib/supabase/server';

import {
    createPaymentsRepository,
} from '@/repositories/crm/PaymentsRepository';

import type {
    Payment,
    PaymentStatus,
    PaymentSummary,
    PaymentSearchFilters,
} from '@/types/crm/Payments';



class PaymentsService {


    private async repository() {

        const supabase =
            await createClient();


        return createPaymentsRepository(
            supabase,
        );

    }





    async list(): Promise<Payment[]> {

        const repository =
            await this.repository();


        return repository.list();

    }





    async listArchived(): Promise<Payment[]> {

        const repository =
            await this.repository();


        return repository.listArchived();

    }





    async details(
        id: string,
    ): Promise<Payment | null> {

        const repository =
            await this.repository();


        return repository.details(
            id,
        );

    }





    async findById(
        id: string,
    ): Promise<Payment | null> {

        const repository =
            await this.repository();


        return repository.findById(
            id,
        );

    }





    async search(
        filters?: PaymentSearchFilters,
    ): Promise<Payment[]> {

        const repository =
            await this.repository();


        return repository.search(
            filters,
        );

    }





    async create(
        data: Partial<Payment>,
    ): Promise<Payment> {

        const repository =
            await this.repository();


        return repository.create(
            data,
        );

    }





    async update(
        id: string,
        data: Partial<Payment>,
    ): Promise<Payment> {

        const repository =
            await this.repository();


        return repository.update(
            id,
            data,
        );

    }





    async updateStatus(
        id: string,
        status: PaymentStatus,
    ): Promise<Payment> {

        const repository =
            await this.repository();


        return repository.updateStatus(
            id,
            status,
        );

    }

async delete(
    id: string,
): Promise<boolean> {

    const repository =
        await this.repository();


    try {

        await repository.delete(
            id,
        );


        return true;

    } catch {

        return false;

    }

}


async restore(
    id: string,
): Promise<boolean> {

    const repository =
        await this.repository();


    return repository.restore(
        id,
    );

}

    async summary(): Promise<PaymentSummary> {

        const repository =
            await this.repository();


        return repository.summary();

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