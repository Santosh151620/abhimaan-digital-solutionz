'use server';

import {
    KnowledgeBaseServiceInstance,
} from '@/services/crm/KnowledgeBaseService';

import {
    PermissionServiceInstance,
} from '@/services/crm/PermissionService';

import {
    CRM_ADMIN_ROLE,
} from '@/shared/crmPermissions';

import type {
    KnowledgeArticle,
    KnowledgeStatus,
} from '@/types/crm/KnowledgeBase';

function can(
    action:
        | 'create'
        | 'update'
        | 'delete',
) {

    return PermissionServiceInstance.hasPermission(

        CRM_ADMIN_ROLE,

        'KnowledgeBase',

        action,

    );

}

export async function getKnowledgeArticles() {

    return KnowledgeBaseServiceInstance.list();

}

export async function getArchivedKnowledgeArticles() {

    return KnowledgeBaseServiceInstance.listArchived();

}

export async function getKnowledgeArticle(
    id: string,
) {

    return KnowledgeBaseServiceInstance.details(
        id,
    );

}

export async function createKnowledgeArticle(
    data: Partial<KnowledgeArticle>,
) {

    if (!can('create')) {

        throw new Error(
            'Permission denied',
        );

    }

    return KnowledgeBaseServiceInstance.create(
        data,
    );

}

export async function updateKnowledgeArticle(
    id: string,
    data: Partial<KnowledgeArticle>,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }

    return KnowledgeBaseServiceInstance.update(
        id,
        data,
    );

}

export async function deleteKnowledgeArticle(
    id: string,
) {

    if (!can('delete')) {

        throw new Error(
            'Permission denied',
        );

    }

    return KnowledgeBaseServiceInstance.delete(
        id,
    );

}

export async function restoreKnowledgeArticle(
    id: string,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }

    return KnowledgeBaseServiceInstance.restore(
        id,
    );

}

export async function updateKnowledgeArticleStatus(
    id: string,
    status: KnowledgeStatus,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }

    return KnowledgeBaseServiceInstance.updateStatus(
        id,
        status,
    );

}

export async function getKnowledgeSummary() {

    return KnowledgeBaseServiceInstance.summary();

}