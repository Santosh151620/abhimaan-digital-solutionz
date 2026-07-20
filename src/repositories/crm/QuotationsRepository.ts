import type {
    Quotation,
    QuotationStatus,
} from '@/types/crm/Quotations';


class QuotationsRepository {

    private quotations =
        new Map<string, Quotation>();


    async list(): Promise<Quotation[]> {

        return [
            ...this.quotations.values(),
        ]
            .filter(
                quotation => !quotation.archived
            )
            .sort(
                (a, b) =>
                    b.createdAt.localeCompare(
                        a.createdAt
                    )
            );

    }


    async listArchived(): Promise<Quotation[]> {

        return [
            ...this.quotations.values(),
        ].filter(
            quotation => quotation.archived
        );

    }


    async details(
        id: string
    ): Promise<Quotation | null> {

        return (
            this.quotations.get(id) ??
            null
        );

    }


    async create(
        data: Partial<Quotation>
    ): Promise<Quotation> {

        const now =
            new Date().toISOString();

        const quotation: Quotation = {

            id:
                crypto.randomUUID(),

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

            archived:
                false,

            createdAt:
                now,

            updatedAt:
                now,

        };

        this.quotations.set(
            quotation.id,
            quotation
        );

        return quotation;

    }


    async update(
        id: string,
        data: Partial<Quotation>
    ): Promise<Quotation | null> {

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


    async updateStatus(
        id: string,
        status: QuotationStatus
    ): Promise<Quotation | null> {

        return this.update(
            id,
            {
                status,
            }
        );

    }


    async delete(
        id: string
    ): Promise<boolean> {

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


    async restore(
        id: string
    ): Promise<boolean> {

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