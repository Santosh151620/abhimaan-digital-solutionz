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
        return AssetsRepositoryInstance.summary();
    }

}

export const AssetsServiceInstance =
    new AssetsService();