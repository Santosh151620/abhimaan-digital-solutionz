'use client';

import {
    useState,
} from 'react';

import {
    useRouter,
} from 'next/navigation';

import {
    OpportunitiesForm,
} from '@/components/crm/opportunities';

import type {
    Opportunity,
} from '@/types/crm/Opportunities';


interface Props {

    opportunity: Opportunity;

    updateOpportunity: (
        id: string,
        values: Partial<Opportunity>,
    ) => Promise<unknown>;

}


export default function EditOpportunityClient({

    opportunity,

    updateOpportunity,

}: Props) {


    const router =
        useRouter();


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


    async function handleSubmit(
        values: Partial<Opportunity>,
    ) {

        if (loading) {

            return;

        }


        setLoading(true);

        setError(null);


        try {

            await updateOpportunity(
                opportunity.id,
                values,
            );


            router.push(
                `/crm/opportunities/${opportunity.id}`,
            );

            router.refresh();


        } catch (submitError) {

            console.error(
                'OPPORTUNITY_UPDATE_ERROR',
                submitError,
            );


            setError(
                submitError instanceof Error
                    ? submitError.message
                    : 'Failed to update opportunity.',
            );


            setLoading(false);

        }

    }


    return (

        <div className="space-y-4">


            {error && (

                <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >

                    {error}

                </div>

            )}


            <OpportunitiesForm

                initialValues={
                    opportunity
                }

                loading={
                    loading
                }

                onSubmit={
                    handleSubmit
                }

                onCancel={() => {

                    if (!loading) {

                        router.back();

                    }

                }}

            />

        </div>

    );

}
