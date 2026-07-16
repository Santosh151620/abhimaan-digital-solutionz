import { AssetsRepositoryInstance } from '@/repositories/crm/AssetsRepository';
import type {
    Asset,
    AssetStatus,
} from '@/types/crm/Assets';

class AssetsService {

    list() {
        return AssetsRepositoryInstance.list();
    }

    listArchived() {
        return AssetsRepositoryInstance.listArchived();
    }

    details(id: string) {
        return AssetsRepositoryInstance.details(id);
    }

    create(
        data: Partial<Asset>
    ) {
        return AssetsRepositoryInstance.create(data);
    }

    update(
        id: string,
        data: Partial<Asset>
    ) {
        return AssetsRepositoryInstance.update(
            id,
            data
        );
    }

    delete(id: string) {
        return AssetsRepositoryInstance.delete(id);
    }

    restore(id: string) {
        return AssetsRepositoryInstance.restore(id);
    }

    updateStatus(
        id: string,
        status: AssetStatus
    ) {
        return AssetsRepositoryInstance.updateStatus(
            id,
            status
        );
    }

    summary() {

        const assets =
            AssetsRepositoryInstance.list();

        return {

            total: assets.length,

            active: assets.filter(
                asset =>
                    asset.status === 'Active'
            ).length,

            inactive: assets.filter(
                asset =>
                    asset.status === 'Inactive'
            ).length,

            maintenance: assets.filter(
                asset =>
                    asset.status === 'Maintenance'
            ).length,

            retired: assets.filter(
                asset =>
                    asset.status === 'Retired'
            ).length,

        };

    }

}

export const AssetsServiceInstance =
    new AssetsService();