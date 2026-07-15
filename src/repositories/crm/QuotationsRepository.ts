import type {
    Quotation,
    QuotationStatus,
} from '@/types/crm/Quotations';

class QuotationsRepository {

    private quotations = new Map<string, Quotation>();

    list(): Quotation[] {

        return [...this.quotations.values()]
            .filter((quotation) => !quotation.archived)
            .sort((a, b) =>
                b.createdAt.localeCompare(a.createdAt)
            );

    }

    listArchived(): Quotation[] {

        return [...this.quotations.values()]
            .filter((quotation) => quotation.archived);

    }

    details(id: string): Quotation | null {

        return this.quotations.get(id) ?? null;

    }

    create(
        data: Partial<Quotation>
    ): Quotation {

        const now = new Date().toISOString();

        const quotation: Quotation = {

            id: crypto.randomUUID(),

            quotationNumber:
                data.quotationNumber ??
                `QT-${Date.now()}`,

            companyId:
                data.companyId ?? '',

            opportunityId:
                data.opportunityId,

            title:
                data.title ?? '',
            
            customerName:
                data.customerName ?? '',

            amount:
                data.amount ?? 0,

            status:
                data.status ?? 'Draft',

            issueDate:
                data.issueDate ??
                now.substring(0, 10),

            validUntil:
                data.validUntil ??
                now.substring(0, 10),

            subtotal:
                data.subtotal ?? 0,

            tax:
                data.tax ?? 0,

            discount:
                data.discount ?? 0,

            total:
                data.total ?? 0,

            currency:
                data.currency ?? 'INR',

            notes:
                data.notes,

            items:
                data.items ?? [],

            createdAt: now,

            updatedAt: now,

            archived: false,

        };

        this.quotations.set(
            quotation.id,
            quotation
        );

        return quotation;

    }

    update(
        id: string,
        data: Partial<Quotation>
    ): Quotation | null {

        const existing =
            this.quotations.get(id);

        if (!existing) {
            return null;
        }

        const updated: Quotation = {

            ...existing,

            ...data,

            updatedAt:
                new Date().toISOString(),

        };

        this.quotations.set(
            id,
            updated
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: QuotationStatus
    ): Quotation | null {

        return this.update(
            id,
            { status }
        );

    }

    delete(
        id: string
    ): boolean {

        const quotation =
            this.quotations.get(id);

        if (!quotation) {
            return false;
        }

        quotation.archived = true;
        quotation.updatedAt =
            new Date().toISOString();

        this.quotations.set(
            id,
            quotation
        );

        return true;

    }

    restore(
        id: string
    ): boolean {

        const quotation =
            this.quotations.get(id);

        if (!quotation) {
            return false;
        }

        quotation.archived = false;
        quotation.updatedAt =
            new Date().toISOString();

        this.quotations.set(
            id,
            quotation
        );

        return true;

    }

}

export const QuotationsRepositoryInstance =
    new QuotationsRepository();
