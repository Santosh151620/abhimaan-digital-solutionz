"use server";


import {
    KnowledgeBaseServiceInstance,
} from "@/services/crm/KnowledgeBaseService";


import type {
    KnowledgeArticle,
    KnowledgeStatus,
} from "@/types/crm/KnowledgeBase";



type KnowledgeArticleInput =
    Partial<KnowledgeArticle>;



function validateId(
    id: string,
): string {

    const normalized =
        typeof id === "string"
            ? id.trim()
            : "";


    if (!normalized) {

        throw new Error(
            "Knowledge article id is required.",
        );

    }


    return normalized;

}



function validateInput(
    data: KnowledgeArticleInput,
): KnowledgeArticleInput {

    if (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data)
    ) {

        throw new Error(
            "Knowledge article data is required.",
        );

    }


    return data;

}



/**
 * Read operations.
 *
 * Tenant scoping and read authorization must be
 * enforced by the service/repository boundary.
 */
export async function getKnowledgeArticles() {

    return KnowledgeBaseServiceInstance.list();

}



export async function getArchivedKnowledgeArticles() {

    return KnowledgeBaseServiceInstance.listArchived();

}



export async function getKnowledgeArticle(
    id: string,
) {

    const normalizedId =
        validateId(id);


    return KnowledgeBaseServiceInstance.details(
        normalizedId,
    );

}



export async function getKnowledgeSummary() {

    return KnowledgeBaseServiceInstance.summary();

}



/**
 * Mutations.
 *
 * Authorization is intentionally delegated to the
 * KnowledgeBaseService so every mutation entry point
 * receives the same security rules.
 */
export async function createKnowledgeArticle(
    data: KnowledgeArticleInput,
) {

    const normalizedData =
        validateInput(data);


    return KnowledgeBaseServiceInstance.create(
        normalizedData,
    );

}



export async function updateKnowledgeArticle(
    id: string,
    data: KnowledgeArticleInput,
) {

    const normalizedId =
        validateId(id);


    const normalizedData =
        validateInput(data);


    return KnowledgeBaseServiceInstance.update(
        normalizedId,
        normalizedData,
    );

}



export async function deleteKnowledgeArticle(
    id: string,
) {

    const normalizedId =
        validateId(id);


    return KnowledgeBaseServiceInstance.delete(
        normalizedId,
    );

}



export async function restoreKnowledgeArticle(
    id: string,
) {

    const normalizedId =
        validateId(id);


    return KnowledgeBaseServiceInstance.restore(
        normalizedId,
    );

}



export async function updateKnowledgeArticleStatus(
    id: string,
    status: KnowledgeStatus,
) {

    const normalizedId =
        validateId(id);


    if (!status) {

        throw new Error(
            "Knowledge article status is required.",
        );

    }


    return KnowledgeBaseServiceInstance.updateStatus(
        normalizedId,
        status,
    );

}
