import { QuotationsRepositoryInstance } from '@/repositories/crm/QuotationsRepository';

import type {
    Quotation,
    QuotationStatus,
} from '@/types/crm/Quotations';

class QuotationsService {

    list() {
        return QuotationsRepositoryInstance.list();
    }

    listArchived() {
        return QuotationsRepositoryInstance.listArchived();
    }

    details(id: string) {
        return QuotationsRepositoryInstance.details(id);
    }

    create(data: Partial<Quotation>) {
        return QuotationsRepositoryInstance.create(data);
    }

    update(
        id: string,
        data: Partial<Quotation>
    ) {
        return QuotationsRepositoryInstance.update(id, data);
    }

    delete(id: string) {
        return QuotationsRepositoryInstance.delete(id);
    }

    restore(id: string) {
        return QuotationsRepositoryInstance.restore(id);
    }

    updateStatus(
        id: string,
        status: QuotationStatus
    ) {
        return QuotationsRepositoryInstance.updateStatus(
            id,
            status
        );
    }

    summary() {

        const quotations = this.list();

        return {

            total: quotations.length,

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

}

export const QuotationsServiceInstance =
    new QuotationsService();