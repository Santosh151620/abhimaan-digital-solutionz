'use client';

import { useMemo, useState } from 'react';

import type {
    Opportunity,
} from '@/types/crm/Opportunities';

import OpportunitiesSummary from './OpportunitiesSummary';
import OpportunitiesTable from './OpportunitiesTable';

interface Props {

    initialOpportunities?: Opportunity[];

}

export default function OpportunitiesClient({

    initialOpportunities = [],

}: Props) {

    const [opportunities] =
        useState<Opportunity[]>(
            initialOpportunities,
        );

    const summary =
        useMemo(() => {

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

        }, [

            opportunities,

        ]);

    return (

        <div className="space-y-6">

            <OpportunitiesSummary
                summary={summary}
            />

            <OpportunitiesTable
                opportunities={
                    opportunities
                }
            />

        </div>

    );

}
