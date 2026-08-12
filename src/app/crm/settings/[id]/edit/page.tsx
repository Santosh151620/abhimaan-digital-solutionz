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

import Toast from '@/components/crm/ui/Toast';

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

    const [toast, setToast] =
        useState<{
            title: string;
            message: string;
            type: 'success' | 'error';
        } | null>(null);


    useEffect(() => {

        let mounted = true;


        async function loadSetting() {

            try {

                setError(null);

                const result =
                    await getSetting(id);


                if (!mounted) {
                    return;
                }


                setSetting(result);


                if (!result) {

                    setError(
                        'The requested setting could not be found.',
                    );

                }

            } catch (loadError) {

                console.error(
                    'Load CRM setting failed:',
                    loadError,
                );


                if (mounted) {

                    setError(
                        'Unable to load setting. Please try again.',
                    );

                }

            } finally {

                if (mounted) {

                    setLoading(false);

                }

            }

        }


        if (!id) {

            setError(
                'Invalid setting id.',
            );

            setLoading(false);

            return;

        }


        void loadSetting();


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


            setToast({

                title:
                    'Setting updated',

                message:
                    'CRM setting saved successfully.',

                type:
                    'success',

            });


            /*
             * Navigate to the canonical detail page after
             * successful persistence. The detail page performs
             * its own server-side data load.
             */
            router.push(
                `/crm/settings/${id}`,
            );

        } catch (updateError) {

            console.error(
                'Update CRM setting failed:',
                updateError,
            );


            const message =
                updateError instanceof Error
                    ? updateError.message
                    : 'Unable to update setting. Please try again.';


            setError(message);


            setToast({

                title:
                    'Save failed',

                message,

                type:
                    'error',

            });

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

                <h1 className="crm-title">
                    Edit Setting
                </h1>


                <div className="crm-card p-6 text-sm text-muted-foreground">
                    Loading setting...
                </div>

            </div>

        );

    }


    if (!setting) {

        return (

            <div className="space-y-6">

                <h1 className="crm-title">
                    Setting Not Found
                </h1>


                {
                    error && (

                        <div
                            role="alert"
                            className="
                                rounded-lg
                                border
                                border-destructive/30
                                bg-destructive/10
                                p-4
                                text-sm
                                text-destructive
                            "
                        >
                            {error}
                        </div>

                    )
                }


                <Link
                    href="/crm/settings"
                    className="
                        inline-flex
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
                    "
                >
                    Back to Settings
                </Link>

            </div>

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
                        Edit Setting
                    </h1>


                    <p className="crm-subtitle">
                        Update CRM configuration setting.
                    </p>

                </div>


                <Link
                    href={`/crm/settings/${setting.id}`}
                    aria-disabled={saving}
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


            {
                error && (

                    <div
                        role="alert"
                        className="
                            rounded-lg
                            border
                            border-destructive/30
                            bg-destructive/10
                            p-4
                            text-sm
                            text-destructive
                        "
                    >
                        {error}
                    </div>

                )
            }


            <div className="crm-card p-6">

                <SettingsForm
                    initialValues={setting}
                    loading={saving}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />

            </div>


        </div>

    );

}