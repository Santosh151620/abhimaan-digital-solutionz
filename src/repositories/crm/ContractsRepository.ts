import type {
    Contract,
    ContractSearchFilters,
    ContractSummary,
    ContractStatus,
} from '@/types/crm/Contracts';

class ContractsRepository {

    private contracts =
        new Map<string, Contract>();

    list(): Contract[] {

        return Array.from(
            this.contracts.values(),
        )
            .filter(
                contract =>
                    !contract.archived,
            )
            .sort(
                (a, b) =>
                    b.createdAt.localeCompare(
                        a.createdAt,
                    ),
            );

    }

    listArchived(): Contract[] {

        return Array.from(
            this.contracts.values(),
        )
            .filter(
                contract =>
                    contract.archived,
            )
            .sort(
                (a, b) =>
                    b.createdAt.localeCompare(
                        a.createdAt,
                    ),
            );

    }

    details(
        id: string,
    ): Contract | null {

        return (
            this.contracts.get(id)
            ??
            null
        );

    }

    search(
        filters?: ContractSearchFilters,
    ): Contract[] {

        let contracts =
            this.list();

        if (filters?.status) {

            contracts =
                contracts.filter(
                    contract =>
                        contract.status ===
                        filters.status,
                );

        }

        if (filters?.companyId) {

            contracts =
                contracts.filter(
                    contract =>
                        contract.companyId ===
                        filters.companyId,
                );

        }

        if (filters?.search) {

            const keyword =
                filters.search
                    .toLowerCase();

            contracts =
                contracts.filter(
                    contract =>

                        contract.title
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        contract.customerName
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        contract.contractNumber
                            .toLowerCase()
                            .includes(keyword),

                );

        }

        return contracts;

    }

    create(
        data: Partial<Contract>,
    ): Contract {

        const now =
            new Date().toISOString();

        const today =
            now.substring(0, 10);

        const subtotal =
            data.subtotal
            ??
            data.value
            ??
            0;

        const tax =
            data.tax
            ??
            0;

        const discount =
            data.discount
            ??
            0;

        const total =
            data.total
            ??
            (
                subtotal +
                tax -
                discount
            );

        const contract: Contract = {

            id:
                crypto.randomUUID(),

            contractNumber:
                data.contractNumber
                ??
                `CNT-${Date.now()}`,

            companyId:
                data.companyId
                ??
                '',

            quotationId:
                data.quotationId,

            invoiceId:
                data.invoiceId,

            title:
                data.title
                ??
                '',

            customerName:
                data.customerName
                ??
                '',

            status:
                data.status
                ??
                'Draft',

            startDate:
                data.startDate
                ??
                today,

            endDate:
                data.endDate
                ??
                today,

            renewalDate:
                data.renewalDate,

            autoRenew:
                data.autoRenew
                ??
                false,

            value:
                data.value
                ??
                total,

            currency:
                data.currency
                ??
                'INR',

            subtotal,

            tax,

            discount,

            total,

            notes:
                data.notes,

            archived:
                false,

            createdAt:
                now,

            updatedAt:
                now,

        };

        this.contracts.set(
            contract.id,
            contract,
        );

        return contract;

    }
        update(
        id: string,
        data: Partial<Contract>,
    ): Contract | null {

        const existing =
            this.contracts.get(id);

        if (!existing) {

            return null;

        }

        const subtotal =
            data.subtotal ??
            existing.subtotal ??
            existing.value;

        const tax =
            data.tax ??
            existing.tax ??
            0;

        const discount =
            data.discount ??
            existing.discount ??
            0;

        const total =
            data.total ??
            (
                subtotal +
                tax -
                discount
            );

        const updated: Contract = {

            ...existing,

            ...data,

            subtotal,

            tax,

            discount,

            total,

            value:
                data.value ??
                total,

            updatedAt:
                new Date().toISOString(),

        };

        this.contracts.set(
            id,
            updated,
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: ContractStatus,
    ): Contract | null {

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

        const contract =
            this.contracts.get(id);

        if (!contract) {

            return false;

        }

        contract.archived =
            true;

        contract.updatedAt =
            new Date().toISOString();

        this.contracts.set(
            id,
            contract,
        );

        return true;

    }

    restore(
        id: string,
    ): boolean {

        const contract =
            this.contracts.get(id);

        if (!contract) {

            return false;

        }

        contract.archived =
            false;

        contract.updatedAt =
            new Date().toISOString();

        this.contracts.set(
            id,
            contract,
        );

        return true;

    }

    summary(): ContractSummary {

        const contracts =
            this.list();

        const archived =
            this.listArchived();

        const totalValue =
            contracts.reduce(
                (
                    sum,
                    contract,
                ) =>
                    sum +
                    (
                        contract.total ??
                        contract.value
                    ),
                0,
            );

        const activeValue =
            contracts
                .filter(
                    contract =>
                        contract.status ===
                        'Active',
                )
                .reduce(
                    (
                        sum,
                        contract,
                    ) =>
                        sum +
                        (
                            contract.total ??
                            contract.value
                        ),
                    0,
                );

        return {

            total:
                contracts.length,

            draft:
                contracts.filter(
                    contract =>
                        contract.status ===
                        'Draft',
                ).length,

            pending:
                contracts.filter(
                    contract =>
                        contract.status ===
                        'Pending',
                ).length,

            active:
                contracts.filter(
                    contract =>
                        contract.status ===
                        'Active',
                ).length,

            completed:
                contracts.filter(
                    contract =>
                        contract.status ===
                        'Completed',
                ).length,

            expired:
                contracts.filter(
                    contract =>
                        contract.status ===
                        'Expired',
                ).length,

            terminated:
                contracts.filter(
                    contract =>
                        contract.status ===
                        'Terminated',
                ).length,

            cancelled:
                contracts.filter(
                    contract =>
                        contract.status ===
                        'Cancelled',
                ).length,

            archived:
                archived.length,

            totalValue,

            activeValue,

        };

    }

}

export const ContractsRepositoryInstance =
    new ContractsRepository();