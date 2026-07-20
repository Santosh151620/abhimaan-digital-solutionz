import { InvoicesRepositoryInstance } from '@/repositories/crm/InvoicesRepository';

import type {
    Invoice,
    InvoiceStatus,
} from '@/types/crm/Invoices';

class InvoicesService {

    list() {
        return InvoicesRepositoryInstance.list();
    }

    listArchived() {
        return InvoicesRepositoryInstance.listArchived();
    }

    details(id: string) {
        return InvoicesRepositoryInstance.details(id);
    }

    create(data: Partial<Invoice>) {
        return InvoicesRepositoryInstance.create(data);
    }

    update(
        id: string,
        data: Partial<Invoice>,
    ) {
        return InvoicesRepositoryInstance.update(
            id,
            data,
        );
    }

    delete(id: string) {
        return InvoicesRepositoryInstance.delete(id);
    }

    restore(id: string) {
        return InvoicesRepositoryInstance.restore(id);
    }

    updateStatus(
        id: string,
        status: InvoiceStatus,
    ) {
        return this.update(
            id,
            { status },
        );
    }

    summary() {
    return InvoicesRepositoryInstance.summary();
}

}

export const InvoicesServiceInstance =
    new InvoicesService();