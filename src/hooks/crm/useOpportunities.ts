'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import type {
    Opportunity,
    OpportunitySearchFilters,
    CreateOpportunityInput,
    UpdateOpportunityInput,
    OpportunityStage,
    OpportunityStatus,
    OpportunitySummary,
} from '@/types/crm/Opportunities';

interface OpportunitiesResponse {
    success: boolean;
    data?: Opportunity[];
    error?: string;
}

interface OpportunityResponse {
    success: boolean;
    data?: Opportunity;
    error?: string;
}

interface SummaryResponse {
    success: boolean;
    data?: OpportunitySummary;
    error?: string;
}

interface UseOpportunitiesOptions {
    initialOpportunities?: Opportunity[];
    filters?: OpportunitySearchFilters;
    autoLoad?: boolean;
}

interface UseOpportunitiesResult {
    opportunities: Opportunity[];
    loading: boolean;
    error: string | null;

    refresh: () => Promise<void>;

    createOpportunity: (
        input: CreateOpportunityInput,
    ) => Promise<Opportunity>;

    updateOpportunity: (
        id: string,
        input: UpdateOpportunityInput,
    ) => Promise<Opportunity>;

    updateStage: (
        id: string,
        stage: OpportunityStage,
    ) => Promise<Opportunity>;

    updateStatus: (
        id: string,
        status: OpportunityStatus,
    ) => Promise<Opportunity>;

    markWon: (
        id: string,
        reasonWon?: string,
    ) => Promise<Opportunity>;

    markLost: (
        id: string,
        reasonLost?: string,
    ) => Promise<Opportunity>;

    putOnHold: (
        id: string,
    ) => Promise<Opportunity>;

    deleteOpportunity: (
        id: string,
    ) => Promise<void>;

    restoreOpportunity: (
        id: string,
    ) => Promise<boolean>;

    getOpportunity: (
        id: string,
    ) => Promise<Opportunity | null>;

    loadSummary: () => Promise<OpportunitySummary>;

    summary: OpportunitySummary | null;
}

function buildQuery(
    filters?: OpportunitySearchFilters,
): string {

    if (!filters) {
        return '';
    }

    const params =
        new URLSearchParams();

    if (filters.search?.trim()) {
        params.set(
            'search',
            filters.search.trim(),
        );
    }

    if (filters.keyword?.trim()) {
        params.set(
            'keyword',
            filters.keyword.trim(),
        );
    }

    if (filters.stage) {
        params.set(
            'stage',
            filters.stage,
        );
    }

    if (filters.status) {
        params.set(
            'status',
            filters.status,
        );
    }

    if (filters.companyId) {
        params.set(
            'companyId',
            filters.companyId,
        );
    }

    if (filters.contactId) {
        params.set(
            'contactId',
            filters.contactId,
        );
    }

    if (filters.leadId) {
        params.set(
            'leadId',
            filters.leadId,
        );
    }

    if (filters.ownerId) {
        params.set(
            'ownerId',
            filters.ownerId,
        );
    }

    if (filters.assignedTo) {
        params.set(
            'assignedTo',
            filters.assignedTo,
        );
    }

    if (filters.includeArchived !== undefined) {
        params.set(
            'includeArchived',
            String(filters.includeArchived),
        );
    }

    if (filters.page !== undefined) {
        params.set(
            'page',
            String(filters.page),
        );
    }

    if (filters.limit !== undefined) {
        params.set(
            'limit',
            String(filters.limit),
        );
    }

    const query =
        params.toString();

    return query
        ? `?${query}`
        : '';
}

async function parseResponse<T>(
    response: Response,
): Promise<T> {

    let payload: unknown;

    try {
        payload =
            await response.json();
    } catch {
        throw new Error(
            `Request failed with status ${response.status}.`,
        );
    }

    if (!response.ok) {

        const message =
            typeof payload === 'object' &&
            payload !== null &&
            'error' in payload &&
            typeof payload.error === 'string'
                ? payload.error
                : `Request failed with status ${response.status}.`;

        throw new Error(message);
    }

    return payload as T;
}

function requireId(
    id: string,
): string {

    const normalized =
        id.trim();

    if (!normalized) {
        throw new Error(
            'Opportunity id is required.',
        );
    }

    return normalized;
}

export function useOpportunities(
    options: UseOpportunitiesOptions = {},
): UseOpportunitiesResult {

    const {
        initialOpportunities = [],
        filters,
        autoLoad = true,
    } = options;

    const [
        opportunities,
        setOpportunities,
    ] =
        useState<Opportunity[]>(
            initialOpportunities,
        );

    const [
        loading,
        setLoading,
    ] =
        useState<boolean>(
            autoLoad,
        );

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        );

    const [
        summary,
        setSummary,
    ] =
        useState<OpportunitySummary | null>(
            null,
        );

    const query =
        useMemo(
            () => buildQuery(filters),
            [filters],
        );

    const refresh =
        useCallback(
            async (): Promise<void> => {

                setLoading(true);
                setError(null);

                try {

                    const response =
                        await fetch(
                            `/api/crm/opportunities${query}`,
                            {
                                method: 'GET',
                                headers: {
                                    Accept:
                                        'application/json',
                                },
                                cache: 'no-store',
                            },
                        );

                    const payload =
                        await parseResponse<
                            OpportunitiesResponse
                        >(response);

                    if (!payload.success) {
                        throw new Error(
                            payload.error ??
                            'Failed to load opportunities.',
                        );
                    }

                    setOpportunities(
                        payload.data ?? [],
                    );

                } catch (cause) {

                    const message =
                        cause instanceof Error
                            ? cause.message
                            : 'Failed to load opportunities.';

                    setError(message);

                    throw cause;

                } finally {

                    setLoading(false);

                }
            },
            [query],
        );

    useEffect(
        () => {

            if (!autoLoad) {
                return;
            }

            void refresh().catch(() => {
                // Error is already stored by refresh().
            });

        },
        [
            autoLoad,
            refresh,
        ],
    );

    const createOpportunity =
        useCallback(
            async (
                input: CreateOpportunityInput,
            ): Promise<Opportunity> => {

                setError(null);

                try {

                    const response =
                        await fetch(
                            '/api/crm/opportunities',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type':
                                        'application/json',
                                    Accept:
                                        'application/json',
                                },
                                body:
                                    JSON.stringify(input),
                            },
                        );

                    const payload =
                        await parseResponse<
                            OpportunityResponse
                        >(response);

                    if (
                        !payload.success ||
                        !payload.data
                    ) {
                        throw new Error(
                            payload.error ??
                            'Failed to create opportunity.',
                        );
                    }

                    const created =
                        payload.data;

                    setOpportunities(
                        current => [
                            created,
                            ...current.filter(
                                opportunity =>
                                    opportunity.id !==
                                    created.id,
                            ),
                        ],
                    );

                    return created;

                } catch (cause) {

                    const message =
                        cause instanceof Error
                            ? cause.message
                            : 'Failed to create opportunity.';

                    setError(message);

                    throw cause;
                }
            },
            [],
        );

    const updateOpportunity =
        useCallback(
            async (
                id: string,
                input: UpdateOpportunityInput,
            ): Promise<Opportunity> => {

                const normalizedId =
                    requireId(id);

                setError(null);

                try {

                    const response =
                        await fetch(
                            `/api/crm/opportunities/${encodeURIComponent(normalizedId)}`,
                            {
                                method: 'PUT',
                                headers: {
                                    'Content-Type':
                                        'application/json',
                                    Accept:
                                        'application/json',
                                },
                                body:
                                    JSON.stringify(input),
                            },
                        );

                    const payload =
                        await parseResponse<
                            OpportunityResponse
                        >(response);

                    if (
                        !payload.success ||
                        !payload.data
                    ) {
                        throw new Error(
                            payload.error ??
                            'Failed to update opportunity.',
                        );
                    }

                    const updated =
                        payload.data;

                    setOpportunities(
                        current =>
                            current.map(
                                opportunity =>
                                    opportunity.id ===
                                    updated.id
                                        ? updated
                                        : opportunity,
                            ),
                    );

                    return updated;

                } catch (cause) {

                    const message =
                        cause instanceof Error
                            ? cause.message
                            : 'Failed to update opportunity.';

                    setError(message);

                    throw cause;
                }
            },
            [],
        );

    const updateStage =
        useCallback(
            async (
                id: string,
                stage: OpportunityStage,
            ): Promise<Opportunity> => {

                return updateOpportunity(
                    id,
                    { stage },
                );
            },
            [updateOpportunity],
        );

    const updateStatus =
        useCallback(
            async (
                id: string,
                status: OpportunityStatus,
            ): Promise<Opportunity> => {

                return updateOpportunity(
                    id,
                    { status },
                );
            },
            [updateOpportunity],
        );

    const markWon =
        useCallback(
            async (
                id: string,
                reasonWon?: string,
            ): Promise<Opportunity> => {

                return updateOpportunity(
                    id,
                    {
                        stage: 'Won',
                        status: 'Won',
                        reasonWon:
                            reasonWon?.trim() ||
                            undefined,
                    },
                );
            },
            [updateOpportunity],
        );

    const markLost =
        useCallback(
            async (
                id: string,
                reasonLost?: string,
            ): Promise<Opportunity> => {

                return updateOpportunity(
                    id,
                    {
                        stage: 'Lost',
                        status: 'Lost',
                        reasonLost:
                            reasonLost?.trim() ||
                            undefined,
                    },
                );
            },
            [updateOpportunity],
        );

    const putOnHold =
        useCallback(
            async (
                id: string,
            ): Promise<Opportunity> => {

                return updateOpportunity(
                    id,
                    {
                        status: 'On Hold',
                    },
                );
            },
            [updateOpportunity],
        );

    const deleteOpportunity =
        useCallback(
            async (
                id: string,
            ): Promise<void> => {

                const normalizedId =
                    requireId(id);

                setError(null);

                try {

                    const response =
                        await fetch(
                            `/api/crm/opportunities/${encodeURIComponent(normalizedId)}`,
                            {
                                method: 'DELETE',
                                headers: {
                                    Accept:
                                        'application/json',
                                },
                            },
                        );

                    const payload =
                        await parseResponse<{
                            success: boolean;
                            error?: string;
                        }>(response);

                    if (!payload.success) {
                        throw new Error(
                            payload.error ??
                            'Failed to delete opportunity.',
                        );
                    }

                    setOpportunities(
                        current =>
                            current.filter(
                                opportunity =>
                                    opportunity.id !==
                                    normalizedId,
                            ),
                    );

                } catch (cause) {

                    const message =
                        cause instanceof Error
                            ? cause.message
                            : 'Failed to delete opportunity.';

                    setError(message);

                    throw cause;
                }
            },
            [],
        );

    const restoreOpportunity =
        useCallback(
            async (
                id: string,
            ): Promise<boolean> => {

                const normalizedId =
                    requireId(id);

                setError(null);

                try {

                    const response =
                        await fetch(
                            `/api/crm/opportunities/${encodeURIComponent(normalizedId)}/restore`,
                            {
                                method: 'POST',
                                headers: {
                                    Accept:
                                        'application/json',
                                },
                            },
                        );

                    const payload =
                        await parseResponse<{
                            success: boolean;
                            data?: boolean;
                            error?: string;
                        }>(response);

                    if (!payload.success) {
                        throw new Error(
                            payload.error ??
                            'Failed to restore opportunity.',
                        );
                    }

                    if (payload.data !== true) {
                        return false;
                    }

                    await refresh();

                    return true;

                } catch (cause) {

                    const message =
                        cause instanceof Error
                            ? cause.message
                            : 'Failed to restore opportunity.';

                    setError(message);

                    throw cause;
                }
            },
            [refresh],
        );

    const getOpportunity =
        useCallback(
            async (
                id: string,
            ): Promise<Opportunity | null> => {

                const normalizedId =
                    requireId(id);

                setError(null);

                try {

                    const response =
                        await fetch(
                            `/api/crm/opportunities/${encodeURIComponent(normalizedId)}`,
                            {
                                method: 'GET',
                                headers: {
                                    Accept:
                                        'application/json',
                                },
                                cache: 'no-store',
                            },
                        );

                    const payload =
                        await parseResponse<
                            OpportunityResponse
                        >(response);

                    if (!payload.success) {
                        throw new Error(
                            payload.error ??
                            'Failed to load opportunity.',
                        );
                    }

                    return payload.data ?? null;

                } catch (cause) {

                    const message =
                        cause instanceof Error
                            ? cause.message
                            : 'Failed to load opportunity.';

                    setError(message);

                    throw cause;
                }
            },
            [],
        );

    const loadSummary =
        useCallback(
            async (): Promise<OpportunitySummary> => {

                setError(null);

                try {

                    const response =
                        await fetch(
                            '/api/crm/opportunities/summary',
                            {
                                method: 'GET',
                                headers: {
                                    Accept:
                                        'application/json',
                                },
                                cache: 'no-store',
                            },
                        );

                    const payload =
                        await parseResponse<
                            SummaryResponse
                        >(response);

                    if (
                        !payload.success ||
                        !payload.data
                    ) {
                        throw new Error(
                            payload.error ??
                            'Failed to load opportunity summary.',
                        );
                    }

                    setSummary(
                        payload.data,
                    );

                    return payload.data;

                } catch (cause) {

                    const message =
                        cause instanceof Error
                            ? cause.message
                            : 'Failed to load opportunity summary.';

                    setError(message);

                    throw cause;
                }
            },
            [],
        );

    return {
        opportunities,
        loading,
        error,
        refresh,
        createOpportunity,
        updateOpportunity,
        updateStage,
        updateStatus,
        markWon,
        markLost,
        putOnHold,
        deleteOpportunity,
        restoreOpportunity,
        getOpportunity,
        loadSummary,
        summary,
    };
}
