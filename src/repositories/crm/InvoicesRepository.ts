import type {
    Invoice,
    InvoiceStatus,
    InvoiceSummary,
} from '@/types/crm/Invoices';

class InvoicesRepository {

    private invoices =
        new Map<string, Invoice>();


    list(): Invoice[] {

        return [
            ...this.invoices.values(),
        ]
            .filter(
                invoice =>
                    !invoice.archived,
            )
            .sort(
                (a, b) =>
                    b.createdAt.localeCompare(
                        a.createdAt,
                    ),
            );

    }


    listArchived(): Invoice[] {

        return [
            ...this.invoices.values(),
        ]
            .filter(
                invoice =>
                    invoice.archived,
            )
            .sort(
                (a, b) =>
                    b.updatedAt.localeCompare(
                        a.updatedAt,
                    ),
            );

    }


    findById(
        id: string,
    ): Invoice | null {

        return (
            this.invoices.get(id)
            ??
            null
        );

    }


    details(
        id: string,
    ): Invoice | null {

        return this.findById(
            id,
        );

    }


    create(
        data: Partial<Invoice>,
    ): Invoice {

        const now =
            new Date()
                .toISOString();

        const today =
            now.substring(
                0,
                10,
            );

        const subtotal =
            data.subtotal
            ??
            0;

        const tax =
            data.tax
            ??
            0;

        const total =
            data.total
            ??
            (
                subtotal +
                tax
            );

        const paidAmount =
            data.paidAmount
            ??
            0;

        const invoice: Invoice = {

            id:
                crypto.randomUUID(),

            invoiceNumber:
                data.invoiceNumber
                ??
                `INV-${Date.now()}`,

            companyId:
                data.companyId
                ??
                '',

            customerName:
                data.customerName
                ??
                '',

            contractId:
                data.contractId,

            quotationId:
                data.quotationId,

            status:
                data.status
                ??
                'Draft',

            issueDate:
                data.issueDate
                ??
                today,

            dueDate:
                data.dueDate
                ??
                today,

            subtotal,

            tax,

            total,

            currency:
                data.currency
                ??
                'INR',

            title:
                data.title,

            amount:
                total,

            paidAmount,

            balanceAmount:
                total -
                paidAmount,

            notes:
                data.notes,

            archived:
                false,

            createdAt:
                now,

            updatedAt:
                now,

        };

        this.invoices.set(
            invoice.id,
            invoice,
        );

        return invoice;

    }


    update(
        id: string,
        data: Partial<Invoice>,
    ): Invoice | null {

        const existing =
            this.invoices.get(id);

        if (!existing) {

            return null;

        }

        const subtotal =
            data.subtotal
            ??
            existing.subtotal;

        const tax =
            data.tax
            ??
            existing.tax;

        const total =
            data.total
            ??
            (
                subtotal +
                tax
            );

        const paidAmount =
            data.paidAmount
            ??
            existing.paidAmount
            ??
            0;

        const updated: Invoice = {

            ...existing,

            ...data,

            subtotal,

            tax,

            total,

            amount:
                total,

            paidAmount,

            balanceAmount:
                total -
                paidAmount,

            updatedAt:
                new Date()
                    .toISOString(),

        };

        this.invoices.set(
            id,
            updated,
        );

        return updated;

    }


    updateStatus(
        id: string,
        status: InvoiceStatus,
    ): Invoice | null {

        return this.update(
            id,
            {
                status,
            },
        );

    }


    delete(
        id: string,
    ): boolean {

        const invoice =
            this.invoices.get(id);

        if (!invoice) {

            return false;

        }

        invoice.archived =
            true;

        invoice.updatedAt =
            new Date()
                .toISOString();

        this.invoices.set(
            id,
            invoice,
        );

        return true;

    }


    restore(
        id: string,
    ): boolean {

        const invoice =
            this.invoices.get(id);

        if (!invoice) {

            return false;

        }

        invoice.archived =
            false;

        invoice.updatedAt =
            new Date()
                .toISOString();

        this.invoices.set(
            id,
            invoice,
        );

        return true;

    }


    summary(): InvoiceSummary {

        const invoices =
            this.list();

        const totalValue =
            invoices.reduce(
                (
                    sum,
                    invoice,
                ) =>
                    sum +
                    invoice.total,
                0,
            );

        const outstandingValue =
            invoices.reduce(
                (
                    sum,
                    invoice,
                ) =>
                    sum +
                    (
                        invoice.balanceAmount
                        ??
                        0
                    ),
                0,
            );

        const archived =
            this.listArchived()
                .length;

        return {

            total:
                invoices.length,

            draft:
                invoices.filter(
                    invoice =>
                        invoice.status ===
                        'Draft',
                ).length,

            sent:
                invoices.filter(
                    invoice =>
                        invoice.status ===
                        'Sent',
                ).length,

            paid:
                invoices.filter(
                    invoice =>
                        invoice.status ===
                        'Paid',
                ).length,

            overdue:
                invoices.filter(
                    invoice =>
                        invoice.status ===
                        'Overdue',
                ).length,

            cancelled:
                invoices.filter(
                    invoice =>
                        invoice.status ===
                        'Cancelled',
                ).length,

            archived,

            totalValue,

            outstandingValue,

            value:
                totalValue,

        };

    }
search(filters?: {
    status?: InvoiceStatus;
    companyId?: string;
    search?: string;
}): Invoice[] {

    let invoices = this.list();

    if (filters?.status) {
        invoices = invoices.filter(
            invoice => invoice.status === filters.status,
        );
    }

    if (filters?.companyId) {
        invoices = invoices.filter(
            invoice => invoice.companyId === filters.companyId,
        );
    }

    if (filters?.search) {

        const keyword = filters.search.toLowerCase();

        invoices = invoices.filter(
            invoice =>
                invoice.invoiceNumber.toLowerCase().includes(keyword) ||
                invoice.customerName.toLowerCase().includes(keyword) ||
                (invoice.title ?? '').toLowerCase().includes(keyword),
        );
    }

    return invoices;
}
}

export const InvoicesRepositoryInstance =
    new InvoicesRepository();
