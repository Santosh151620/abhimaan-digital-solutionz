'use client';

import Link from 'next/link';
import {
    useParams,
    useRouter,
} from 'next/navigation';
import {
    useEffect,
    useState,
} from 'react';

import {
    SettingsForm,
} from '@/components/crm/settings';

import {
    getSetting,
    updateSetting,
} from '../../actions';

import type {
    Setting,
} from '@/types/crm/Settings';


export default function EditSettingPage() {

    const params =
        useParams<{
            id: string;
        }>();

    const router =
        useRouter();


    const id =
        params.id;


    const [setting, setSetting] =
        useState<Setting | null>(null);


    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);


    const [error, setError] =
        useState<string | null>(null);



    useEffect(() => {

        let mounted = true;


        async function loadSetting() {

            try {

                setError(null);


                const result =
                    await getSetting(id);


                if (mounted) {

                    setSetting(result);

                }


            } catch (loadError) {

                console.error(
                    'Load CRM setting failed:',
                    loadError,
                );


                if (mounted) {

                    setError(
                        'Unable to load setting.',
                    );

                }


            } finally {

                if (mounted) {

                    setLoading(false);

                }

            }

        }


        if (id) {

            void loadSetting();

        }


        return () => {

            mounted = false;

        };


    }, [id]);



    async function handleSubmit(
        values: Partial<Setting>,
    ) {

        if (saving) {

            return;

        }


        try {

            setSaving(true);

            setError(null);


            await updateSetting(
                id,
                values,
            );


            router.push(
                `/crm/settings/${id}`,
            );


            router.refresh();


        } catch (updateError) {

            console.error(
                'Update CRM setting failed:',
                updateError,
            );


            setError(
                'Unable to update setting. Please try again.',
            );


        } finally {

            setSaving(false);

        }

    }



    function handleCancel() {

        if (saving) {

            return;

        }


        router.push(
            `/crm/settings/${id}`,
        );

    }



    if (loading) {

        return (

            <div className="space-y-6">

                <h1 className="text-2xl font-semibold">
                    Edit Setting
                </h1>


                <div className="rounded-xl border p-6 text-sm text-muted-foreground">
                    Loading setting...
                </div>

            </div>

        );

    }



    if (!setting) {

        return (

            <div className="space-y-6">


                <h1 className="text-2xl font-semibold">
                    Setting Not Found
                </h1>


                {
                    error && (

                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            {error}
                        </div>

                    )
                }


                <Link
                    href="/crm/settings"
                    className="text-sm underline"
                >
                    Back to Settings
                </Link>


            </div>

        );

    }



    return (

        <div className="space-y-6">


            <div>

                <h1 className="text-2xl font-semibold">
                    Edit Setting
                </h1>


                <p className="text-sm text-muted-foreground">
                    Update CRM configuration setting.
                </p>

            </div>



            {
                error && (

                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                        {error}
                    </div>

                )
            }



            <SettingsForm

                initialValues={
                    setting
                }

                loading={
                    saving
                }

                onSubmit={
                    handleSubmit
                }

                onCancel={
                    handleCancel
                }

            />



            <Link

                href={`/crm/settings/${setting.id}`}

                className="text-sm underline"

            >
                Back to Setting

            </Link>


        </div>

    );

}