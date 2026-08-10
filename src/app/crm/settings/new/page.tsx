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
            title:string;
            message:string;
            type:'success' | 'error';
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
                title: 'Setting created',
                message: 'CRM setting saved successfully.',
                type: 'success',
            });


            router.push(
                `/crm/settings/${setting.id}`,
            );

            router.refresh();


        } catch (error) {

            console.error(
                'Create CRM setting failed:',
                error,
            );


            setToast({
                title: 'Save failed',
                message: 'Unable to create setting. Please try again.',
                type: 'error',
            });


        } finally {

            setLoading(false);

        }

    }


    function handleCancel() {

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


            <div>

                <h1 className="text-2xl font-semibold">
                    Create Setting
                </h1>

                <p className="text-sm text-muted-foreground">
                    Create a configuration setting for this organization.
                </p>

            </div>


            <SettingsForm
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />


            <Link
                href="/crm/settings"
                className="text-sm underline"
            >
                Back to Settings
            </Link>


        </div>

    );

}