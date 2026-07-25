import {
    KnowledgeBaseRepositoryInstance,
} from '@/repositories/crm/KnowledgeBaseRepository';

import type {
    KnowledgeArticle,
    KnowledgeSearchFilters,
    KnowledgeStatus,
    KnowledgeSummary,
} from '@/types/crm/KnowledgeBase';

class KnowledgeBaseService {

    list() {

        return KnowledgeBaseRepositoryInstance.list();

    }

    listArchived() {

        return KnowledgeBaseRepositoryInstance.listArchived();

    }

    details(
        id: string,
    ) {

        return KnowledgeBaseRepositoryInstance.details(
            id,
        );

    }

    findById(
        id: string,
    ) {

        return KnowledgeBaseRepositoryInstance.findById(
            id,
        );
    }

    search(
        filters?: KnowledgeSearchFilters,
    ) {

        return KnowledgeBaseRepositoryInstance.search(
            filters,
        );

    }

    create(
        data: Partial<KnowledgeArticle>,
    ) {

        return KnowledgeBaseRepositoryInstance.create(
            data,
        );

    }

    update(
        id: string,
        data: Partial<KnowledgeArticle>,
    ) {

        return KnowledgeBaseRepositoryInstance.update(
            id,
            data,
        );

    }

    updateStatus(
        id: string,
        status: KnowledgeStatus,
    ) {

        return KnowledgeBaseRepositoryInstance.updateStatus(
            id,
            status,
        );

    }

    delete(
        id: string,
    ) {

        return KnowledgeBaseRepositoryInstance.delete(
            id,
        );

    }

    restore(
        id: string,
    ) {

        return KnowledgeBaseRepositoryInstance.restore(
            id,
        );

    }

    summary(): KnowledgeSummary  {

        return KnowledgeBaseRepositoryInstance.summary();

    }

}

export async function createKnowledgeBaseService() {

    return new KnowledgeBaseService();

}

export const KnowledgeBaseServiceInstance =
    new KnowledgeBaseService();
