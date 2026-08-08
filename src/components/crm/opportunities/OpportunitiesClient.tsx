'use client';

import {
    useCallback,
    useMemo,
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
}: Props) {


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


    const loadOpportunities =
        useCallback(
            async (
                nextFilters: OpportunitySearchFilters,
            ) => {

                setLoading(true);

                setError(null);


                try {

                    const params =
                        new URLSearchParams();


                    if (
                        nextFilters.search
                        ?.trim()
                    ) {

                        params.set(
                            'search',
                            nextFilters.search.trim(),
                        );

                    }


                    if (
                        nextFilters.status
                    ) {

                        params.set(
                            'status',
                            nextFilters.status,
                        );

                    }


                    if (
                        nextFilters.stage
                    ) {

                        params.set(
                            'stage',
                            nextFilters.stage,
                        );

                    }


                    if (
                        nextFilters.companyId
                    ) {

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


                    setOpportunities(
                        Array.isArray(
                            result.data,
                        )
                            ? result.data
                            : [],
                    );

                } catch (
                    loadError
                ) {

                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : 'Failed to load opportunities.',
                    );

                } finally {

                    setLoading(false);

                }

            },
            [],
        );


    function handleFiltersChange(
        nextFilters: OpportunitySearchFilters,
    ) {

        setFilters(
            nextFilters,
        );

        void loadOpportunities(
            nextFilters,
        );

    }


    function handleClearFilters() {

        const clearedFilters:
            OpportunitySearchFilters =
            {};


        setFilters(
            clearedFilters,
        );

        void loadOpportunities(
            clearedFilters,
        );

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
                            opportunity.value,
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
                                opportunity.value *
                                opportunity.probability /
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
                                        opportunity.probability,
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
            />

        </div>

    );

}



