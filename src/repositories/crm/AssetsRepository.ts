import type {
    Asset,
    AssetStatus,
    AssetSummary,
} from '@/types/crm/Assets';

class AssetsRepository {

    private assets = new Map<string, Asset>();

    list(): Asset[] {

        return [...this.assets.values()]
            .filter(asset => !asset.archived)
            .sort((a, b) =>
                b.createdAt.localeCompare(a.createdAt)
            );

    }

    listArchived(): Asset[] {

        return [...this.assets.values()]
            .filter(asset => asset.archived)
            .sort((a, b) =>
                b.updatedAt.localeCompare(a.updatedAt)
            );

    }

    details(id: string): Asset | null {

        return this.assets.get(id) ?? null;

    }

    create(
        data: Partial<Asset>
    ): Asset {

        const now = new Date().toISOString();

        const asset: Asset = {

            id: crypto.randomUUID(),

            assetCode:
                data.assetCode ??
                `AST-${Date.now()}`,

            name:
                data.name ?? '',

            category:
                data.category ?? 'Other',

            serialNumber:
                data.serialNumber,

            model:
                data.model,

            manufacturer:
                data.manufacturer,

            assignedTo:
                data.assignedTo,

            companyId:
                data.companyId,

            department:
                data.department,

            location:
                data.location,

            purchaseDate:
                data.purchaseDate,

            warrantyExpiry:
                data.warrantyExpiry,

            purchaseCost:
                data.purchaseCost ?? 0,

            currentValue:
                data.currentValue ??
                data.purchaseCost ??
                0,

            status:
                data.status ?? 'Available',

            notes:
                data.notes,

            archived: false,

            createdAt: now,

            updatedAt: now,

        };

        this.assets.set(
            asset.id,
            asset
        );

        return asset;

    }

    update(
        id: string,
        data: Partial<Asset>
    ): Asset | null {

        const existing =
            this.assets.get(id);

        if (!existing) {
            return null;
        }

        const updated: Asset = {

            ...existing,

            ...data,

            updatedAt:
                new Date().toISOString(),

        };

        this.assets.set(
            id,
            updated
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: AssetStatus
    ): Asset | null {

        return this.update(
            id,
            { status }
        );

    }

    delete(
        id: string
    ): boolean {

        const asset =
            this.assets.get(id);

        if (!asset) {
            return false;
        }

        asset.archived = true;
        asset.updatedAt =
            new Date().toISOString();

        this.assets.set(
            id,
            asset
        );

        return true;

    }

    restore(
        id: string
    ): boolean {

        const asset =
            this.assets.get(id);

        if (!asset) {
            return false;
        }

        asset.archived = false;
        asset.updatedAt =
            new Date().toISOString();

        this.assets.set(
            id,
            asset
        );

        return true;

    }

    summary(): AssetSummary {

        const assets =
            [...this.assets.values()];

        return {

            total:
                assets.filter(a => !a.archived).length,

            available:
                assets.filter(a =>
                    !a.archived &&
                    a.status === 'Available'
                ).length,

            allocated:
                assets.filter(a =>
                    !a.archived &&
                    a.status === 'Allocated'
                ).length,

            maintenance:
                assets.filter(a =>
                    !a.archived &&
                    a.status === 'Maintenance'
                ).length,

            retired:
                assets.filter(a =>
                    !a.archived &&
                    a.status === 'Retired'
                ).length,

            archived:
                assets.filter(a =>
                    a.archived
                ).length,

            totalValue:
                assets
                    .filter(a => !a.archived)
                    .reduce(
                        (sum, asset) =>
                            sum + asset.currentValue,
                        0
                    ),

        };

    }

}

export const AssetsRepositoryInstance =
    new AssetsRepository();