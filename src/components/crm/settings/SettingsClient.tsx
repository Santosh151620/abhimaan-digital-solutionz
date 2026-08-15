'use client';

import {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    useRouter,
} from 'next/navigation';

import {
    SettingsForm,
    SettingsSummary,
    SettingsTable,
} from './index';

import {
    createSetting,
} from '@/app/crm/settings/actions';

import type {
    Setting,
    SettingsSummary as ServerSettingsSummary,
} from '@/types/crm/Settings';


interface Props {

    initialSettings: Setting[];

    summary: ServerSettingsSummary;

}


type MessageType =
    | 'success'
    | 'error'
    | null;


interface DisplaySummary {

    total: number;

    active: number;

    inactive: number;

    editable: number;

    encrypted: number;

    system: number;

    categories: number;

}


export default function SettingsClient({
    initialSettings,
    summary,
}: Props) {


    const router =
        useRouter();


    const [settings, setSettings] =
        useState<Setting[]>(
            initialSettings,
        );


    const [showForm, setShowForm] =
        useState(false);


    const [loading, setLoading] =
        useState(false);


    const [message, setMessage] =
        useState<string | null>(
            null,
        );


    const [messageType, setMessageType] =
        useState<MessageType>(
            null,
        );


    const messageTimer =
        useRef<ReturnType<typeof setTimeout> | null>(
            null,
        );


    useEffect(() => {

        setSettings(
            initialSettings,
        );

    }, [
        initialSettings,
    ]);


    useEffect(() => {

        return () => {

            if (
                messageTimer.current
            ) {

                clearTimeout(
                    messageTimer.current,
                );

            }

        };

    }, []);


    function clearMessage() {

        if (
            messageTimer.current
        ) {

            clearTimeout(
                messageTimer.current,
            );

            messageTimer.current =
                null;

        }


        setMessage(null);

        setMessageType(null);

    }


    function showMessage(
        text: string,
        type: MessageType,
    ) {

        if (
            messageTimer.current
        ) {

            clearTimeout(
                messageTimer.current,
            );

        }


        setMessage(text);

        setMessageType(type);


        messageTimer.current =
            setTimeout(
                () => {

                    setMessage(null);

                    setMessageType(null);

                    messageTimer.current =
                        null;

                },
                4000,
            );

    }


    async function handleCreate(
        values: Partial<Setting>,
    ) {

        if (
            loading
        ) {

            return;

        }


        try {

            setLoading(true);

            clearMessage();


            const created =
                await createSetting(
                    values,
                );


            setSettings(
                current => [
                    ...current,
                    created,
                ],
            );


            setShowForm(false);


            showMessage(
                'Setting created successfully.',
                'success',
            );


            router.refresh();

        } catch (error) {

            console.error(
                'Create setting failed:',
                error,
            );


            showMessage(
                error instanceof Error
                    ? error.message
                    : 'Failed to create setting.',
                'error',
            );

        } finally {

            setLoading(false);

        }

    }


    /*
     * Build the presentation summary explicitly.
     *
     * The server summary intentionally does not need to contain
     * the client-derived editable count.
     */
    const displaySummary: DisplaySummary = {

        total:
            settings.length,

        active:
            summary.active,

        inactive:
            summary.inactive,

        editable:
            settings.reduce(
                (
                    count,
                    setting,
                ) =>
                    count +
                    (
                        setting.editable
                            ? 1
                            : 0
                    ),
                0,
            ),

        encrypted:
            summary.encrypted,

        system:
            summary.system,

        categories:
            summary.categories,

    };


    return (

        <div className="space-y-6">


            {
                message && (

                    <div
                        role="alert"
                        aria-live="polite"
                        className={
                            messageType === 'success'
                                ? `
                                    crm-card
                                    border-green-500/30
                                    bg-green-500/10
                                    p-4
                                    text-sm
                                `
                                : `
                                    crm-card
                                    border-destructive/30
                                    bg-destructive/10
                                    p-4
                                    text-sm
                                `
                        }
                    >

                        {message}

                    </div>

                )
            }


            <SettingsSummary
                summary={
                    displaySummary
                }
            />


            <div className="flex justify-end">

                <button
                    type="button"
                    disabled={loading}
                    onClick={() => {

                        clearMessage();

                        setShowForm(
                            true,
                        );

                    }}
                    className="
                        rounded-lg
                        bg-primary
                        px-5
                        py-2.5
                        font-medium
                        text-primary-foreground
                        transition
                        hover:opacity-90
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/20
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    New Setting

                </button>

            </div>


            {
                showForm && (

                    <div className="crm-card p-6">

                        <SettingsForm
                            loading={
                                loading
                            }
                            onSubmit={
                                handleCreate
                            }
                            onCancel={() => {

                                if (
                                    loading
                                ) {

                                    return;

                                }


                                setShowForm(
                                    false,
                                );

                                clearMessage();

                            }}
                        />

                    </div>

                )
            }


            <SettingsTable
                settings={
                    settings
                }
            />

        </div>

    );

}
