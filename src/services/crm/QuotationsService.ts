import {
    QuotationsRepositoryInstance,
} from '@/repositories/crm/QuotationsRepository';

import type {
    Quotation,
    QuotationStatus, 
} from '@/types/crm/Quotations';


class QuotationsService {

    async list() {
        return QuotationsRepositoryInstance.list();
    }


    async listArchived() {
        return QuotationsRepositoryInstance.listArchived();
    }


    async details(
        id: string
    ) {
        return QuotationsRepositoryInstance.details(id);
    }


    async create(
        data: Partial<Quotation>
    ) {
        return QuotationsRepositoryInstance.create(data);
    }


    async update(
        id: string,
        data: Partial<Quotation>
    ) {
        return QuotationsRepositoryInstance.update(
            id,
            data
        );
    }


    async delete(
        id: string
    ) {
        return QuotationsRepositoryInstance.delete(id);
    }


    async restore(
        id: string
    ) {
        return QuotationsRepositoryInstance.restore(id);
    }


    async updateStatus(
        id: string,
        status: QuotationStatus
    ) {
        return QuotationsRepositoryInstance.updateStatus(
            id,
            status
        );
    }


    async summary() {

        const quotations =
            await this.list();

        return {

            total:
                quotations.length,

            draft:
                quotations.filter(
                    q => q.status === 'Draft'
                ).length,

            sent:
                quotations.filter(
                    q => q.status === 'Sent'
                ).length,

            accepted:
                quotations.filter(
                    q => q.status === 'Accepted'
                ).length,

            rejected:
                quotations.filter(
                    q => q.status === 'Rejected'
                ).length,

            value:
                quotations.reduce(
                    (sum, q) => sum + q.total,
                    0
                ),

        };

    }
    async search(
        filters?: {
            status?: QuotationStatus;
            search?: string;
        }
    ) {
        return QuotationsRepositoryInstance.search(
            filters
        );
    }
    
}


export const QuotationsServiceInstance =
    new QuotationsService();