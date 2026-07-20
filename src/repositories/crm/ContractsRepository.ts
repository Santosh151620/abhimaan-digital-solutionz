import type {
    Contract,
    ContractStatus,
} from '@/types/crm/Contracts';

class ContractsRepository {

    private contracts =
        new Map<string, Contract>();

    list(): Contract[] {

        return [...this.contracts.values()]
            .filter(
                (contract) => !contract.archived
            )
            .sort((a, b) =>
                b.createdAt.localeCompare(
                    a.createdAt
                )
            );

    }

    listArchived(): Contract[] {

        return [...this.contracts.values()]
            .filter(
                (contract) => contract.archived
            );

    }

    details(
        id: string
    ): Contract | null {

        return (
            this.contracts.get(id) ??
            null
        );

    }

    create(
        data: Partial<Contract>
    ): Contract {

        const now = new Date().toISOString();
        const today = now.split('T')[0];

        const contract: Contract = {

            id:
                crypto.randomUUID(),

            contractNumber:
                data.contractNumber ??
                `CNT-${Date.now()}`,

            companyId:
                data.companyId ?? '',

            quotationId:
                data.quotationId,

            title:
                data.title ?? '',

            customerName:
                data.customerName ?? '',

            status:
                data.status ?? 'Draft',

            startDate:
                data.startDate ?? today,

            endDate:
                data.endDate ?? today,

            value:
                data.value ?? 0,

            currency:
                data.currency ?? 'INR',

            notes:
                data.notes,

            archived: false,

            createdAt: now,

            updatedAt: now,

        };

        this.contracts.set(
            contract.id,
            contract
        );

        return contract;

    }

    update(
        id: string,
        data: Partial<Contract>
    ): Contract | null {

        const existing =
            this.contracts.get(id);

        if (!existing) {
            return null;
        }

        const updated: Contract = {

            ...existing,

            ...data,

            updatedAt:
                new Date().toISOString(),

        };

        this.contracts.set(
            id,
            updated
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: ContractStatus
    ): Contract | null {

        return this.update(
            id,
            { status }
        );

    }

    delete(
        id: string
    ): boolean {

        const existing =
            this.contracts.get(id);

        if (!existing) {
            return false;
        }

        existing.archived = true;

        existing.updatedAt =
            new Date().toISOString();

        this.contracts.set(
            id,
            existing
        );

        return true;

    }

    restore(
        id: string
    ): boolean {

        const existing =
            this.contracts.get(id);

        if (!existing) {
            return false;
        }

        existing.archived = false;

        existing.updatedAt =
            new Date().toISOString();

        this.contracts.set(
            id,
            existing
        );

        return true;

    }

    summary() {

        const contracts =
            this.list();

        return {

            total:
                contracts.length,

            draft:
                contracts.filter(
                    (c) =>
                        c.status ===
                        'Draft'
                ).length,

            active:
                contracts.filter(
                    (c) =>
                        c.status ===
                        'Active'
                ).length,

            expired:
                contracts.filter(
                    (c) =>
                        c.status ===
                        'Expired'
                ).length,

            cancelled:
                contracts.filter(
                    (c) =>
                        c.status ===
                        'Cancelled'
                ).length,

            totalValue:
                contracts.reduce(
                    (
                        sum,
                        contract
                    ) =>
                        sum +
                        contract.value,
                    0
                ),

        };

    }

}

export const
    ContractsRepositoryInstance =
        new ContractsRepository();