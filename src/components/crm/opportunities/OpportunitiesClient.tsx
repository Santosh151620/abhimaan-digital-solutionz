'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import type {
    Opportunity,
    OpportunitySearchFilters,
} from '@/types/crm/Opportunities';

import OpportunitiesFilters from './OpportunitiesFilters';
import OpportunitiesSummary from './OpportunitiesSummary';
import OpportunitiesTable from './OpportunitiesTable';


interface Props {

    initialOpportunities?: Opportunity[];

    locale?: string;

}


export default function OpportunitiesClient({

    initialOpportunities = [],

    locale,

}: Props) {


    void locale;


    const [
        opportunities,
        setOpportunities,
    ] =
        useState<Opportunity[]>(
            initialOpportunities,
        );


    const [
        filters,
        setFilters,
    ] =
        useState<OpportunitySearchFilters>(
            {},
        );


    const [
        loading,
        setLoading,
    ] =
        useState(false);


    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null,
        );


    const requestSequence =
        useRef(0);


    const loadOpportunities =
        useCallback(
            async (
                nextFilters: OpportunitySearchFilters,
            ) => {

                const requestId =
                    ++requestSequence.current;


                setLoading(true);

                setError(null);


                try {

                    const params =
                        new URLSearchParams();


                    const search =
                        nextFilters.search?.trim();


                    if (search) {

                        params.set(
                            'search',
                            search,
                        );

                    }


                    if (nextFilters.status) {

                        params.set(
                            'status',
                            nextFilters.status,
                        );

                    }


                    if (nextFilters.stage) {

                        params.set(
                            'stage',
                            nextFilters.stage,
                        );

                    }


                    if (nextFilters.companyId) {

                        params.set(
                            'companyId',
                            nextFilters.companyId,
                        );

                    }


                    const query =
                        params.toString();


                    const response =
                        await fetch(
                            query
                                ? `/api/crm/opportunities?${query}`
                                : '/api/crm/opportunities',
                            {
                                method: 'GET',
                                cache: 'no-store',
                            },
                        );


                    const result =
                        await response.json();


                    if (
                        !response.ok
                        ||
                        !result.success
                    ) {

                        throw new Error(
                            result.error
                            ??
                            'Failed to load opportunities.',
                        );

                    }


                    if (
                        requestId !==
                        requestSequence.current
                    ) {

                        return;

                    }


                    setOpportunities(
                        Array.isArray(
                            result.data,
                        )
                            ? result.data
                            : [],
                    );

                } catch (loadError) {

                    if (
                        requestId !==
                        requestSequence.current
                    ) {

                        return;

                    }


                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : 'Failed to load opportunities.',
                    );

                } finally {

                    if (
                        requestId ===
                        requestSequence.current
                    ) {

                        setLoading(false);

                    }

                }

            },
            [],
        );


    const searchTimer =
        useRef<ReturnType<typeof setTimeout> | null>(
            null,
        );


    const previousFilters =
        useRef<string>('');


    useEffect(
        () => {

            const serialized =
                JSON.stringify(
                    filters,
                );


            if (
                previousFilters.current ===
                serialized
            ) {

                return;

            }


            previousFilters.current =
                serialized;


            if (
                searchTimer.current
            ) {

                clearTimeout(
                    searchTimer.current,
                );

            }


            const hasSearch =
                Boolean(
                    filters.search?.trim(),
                );


            if (!hasSearch) {

                void loadOpportunities(
                    filters,
                );

                return;

            }


            searchTimer.current =
                setTimeout(
                    () => {

                        void loadOpportunities(
                            filters,
                        );

                    },
                    300,
                );


            return () => {

                if (
                    searchTimer.current
                ) {

                    clearTimeout(
                        searchTimer.current,
                    );

                }

            };

        },
        [
            filters,
            loadOpportunities,
        ],
    );


    function handleFiltersChange(
        nextFilters: OpportunitySearchFilters,
    ) {

        setFilters(
            nextFilters,
        );

    }


    function handleClearFilters() {

        setFilters({});

    }


    const summary =
        useMemo(
            () => {

                const total =
                    opportunities.length;


                const open =
                    opportunities.filter(
                        opportunity =>
                            opportunity.status === 'Open',
                    ).length;


                const won =
                    opportunities.filter(
                        opportunity =>
                            opportunity.status === 'Won',
                    ).length;


                const lost =
                    opportunities.filter(
                        opportunity =>
                            opportunity.status === 'Lost',
                    ).length;


                const pipelineValue =
                    opportunities.reduce(
                        (
                            sum,
                            opportunity,
                        ) =>
                            sum +
                            Number(
                                opportunity.value ??
                                0,
                            ),
                        0,
                    );


                const weightedValue =
                    opportunities.reduce(
                        (
                            sum,
                            opportunity,
                        ) =>
                            sum +
                            (
                                Number(
                                    opportunity.value ??
                                    0,
                                ) *
                                Number(
                                    opportunity.probability ??
                                    0,
                                ) /
                                100
                            ),
                        0,
                    );


                return {

                    total,

                    open,

                    won,

                    lost,

                    pipelineValue,

                    weightedValue,

                    totalValue:
                        pipelineValue,

                    averageDealSize:
                        total === 0
                            ? 0
                            : Math.round(
                                pipelineValue /
                                total,
                            ),

                    averageProbability:
                        total === 0
                            ? 0
                            : Math.round(
                                opportunities.reduce(
                                    (
                                        sum,
                                        opportunity,
                                    ) =>
                                        sum +
                                        Number(
                                            opportunity.probability ??
                                            0,
                                        ),
                                    0,
                                ) /
                                total,
                            ),

                    winRate:
                        total === 0
                            ? 0
                            : Math.round(
                                won /
                                total *
                                100,
                            ),

                };

            },
            [
                opportunities,
            ],
        );


    return (

        <div className="space-y-6">

            <OpportunitiesFilters

                filters={
                    filters
                }

                onChange={
                    handleFiltersChange
                }

                onClear={
                    handleClearFilters
                }

            />


            {error && (

                <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >

                    {error}

                </div>

            )}


            {loading && (

                <div
                    className="rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
                    role="status"
                    aria-live="polite"
                >

                    Loading opportunities...

                </div>

            )}


            <OpportunitiesSummary

                summary={
                    summary
                }

            />


            <OpportunitiesTable

                opportunities={
                    opportunities
                }

                locale={
                    locale
                }

            />

        </div>

    );

}
