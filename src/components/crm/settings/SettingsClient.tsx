'use client';

import {
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
    SettingsSummary as SettingsSummaryModel,
} from '@/types/crm/Settings';


interface Props {

    initialSettings: Setting[];

    summary: SettingsSummaryModel;

}


type MessageType =
    | 'success'
    | 'error'
    | null;



export default function SettingsClient({
    initialSettings,
    summary,
}: Props) {


    const router =
        useRouter();



    const [settings] =
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



    function showMessage(
        text:string,
        type:MessageType,
    ) {

        setMessage(text);

        setMessageType(type);


        setTimeout(() => {

            setMessage(null);

            setMessageType(null);

        }, 4000);

    }



    async function handleCreate(
        values:Partial<Setting>,
    ) {


        if (loading) {

            return;

        }



        try {


            setLoading(true);

            setMessage(null);

            setMessageType(null);



            await createSetting(
                values,
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



    return (


        <div className="space-y-6">



            <div className="crm-card flex items-center justify-between p-6">


                <div>


                    <h1 className="text-2xl font-bold">
                        CRM Settings
                    </h1>



                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage application configuration and preferences.
                    </p>


                </div>



                <button

                    type="button"

                    disabled={loading}

                    onClick={() =>
                        setShowForm(true)
                    }

                    className="
                        rounded-lg
                        bg-primary
                        px-5
                        py-2.5
                        font-medium
                        text-primary-foreground
                        transition
                        hover:opacity-90
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "

                >

                    New Setting

                </button>


            </div>




            {
                message && (


                    <div

                        role="alert"

                        className={

                            messageType === 'success'

                                ? 'crm-card border-green-500/30 bg-green-500/10 p-4 text-sm'

                                : 'crm-card border-destructive/30 bg-destructive-10 p-4 text-sm'

                        }

                    >

                        {message}


                    </div>


                )
            }




            <SettingsSummary

                summary={{
                    ...summary,
                    total: settings.length,
                }}

            />




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

                                setShowForm(false);

                                setMessage(null);

                                setMessageType(null);

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