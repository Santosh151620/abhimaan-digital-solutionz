'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
    SettingsForm,
} from '@/components/crm/settings';

import Toast from '@/components/crm/ui/Toast';

import {
    createSetting,
} from '../actions';

import type {
    Setting,
} from '@/types/crm/Settings';


export default function NewSettingPage() {

    const router =
        useRouter();


    const [loading, setLoading] =
        useState(false);


    const [toast, setToast] =
        useState<{
            title: string;
            message: string;
            type: 'success' | 'error';
        } | null>(null);


    async function handleSubmit(
        values: Partial<Setting>,
    ) {

        if (loading) {

            return;

        }


        try {

            setLoading(true);


            const setting =
                await createSetting(
                    values,
                );


            setToast({

                title:
                    'Setting created',

                message:
                    'CRM setting saved successfully.',

                type:
                    'success',

            });


            /*
             * The detail page performs its own server-side
             * load, so an additional router.refresh() is not
             * required after navigation.
             */
            router.push(
                `/crm/settings/${setting.id}`,
            );

        } catch (error) {

            console.error(
                'Create CRM setting failed:',
                error,
            );


            setToast({

                title:
                    'Save failed',

                message:
                    error instanceof Error
                        ? error.message
                        : 'Unable to create setting. Please try again.',

                type:
                    'error',

            });

        } finally {

            setLoading(false);

        }

    }


    function handleCancel() {

        if (loading) {

            return;

        }


        router.push(
            '/crm/settings',
        );

    }


    return (

        <div className="space-y-6">


            {
                toast && (

                    <Toast
                        title={toast.title}
                        message={toast.message}
                        type={toast.type}
                        onClose={() =>
                            setToast(null)
                        }
                    />

                )
            }


            <div className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">


                <div>

                    <h1 className="crm-title">
                        Create Setting
                    </h1>


                    <p className="crm-subtitle">
                        Create a configuration setting for this organization.
                    </p>

                </div>


                <Link
                    href="/crm/settings"
                    aria-disabled={loading}
                    className="
                        inline-flex
                        w-fit
                        rounded-lg
                        border
                        px-4
                        py-2
                        text-sm
                        font-medium
                        transition
                        hover:bg-muted
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/20
                        aria-disabled:pointer-events-none
                        aria-disabled:opacity-50
                    "
                >
                    Cancel
                </Link>


            </div>


            <div className="crm-card p-6">

                <SettingsForm
                    loading={loading}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />

            </div>


        </div>

    );

}