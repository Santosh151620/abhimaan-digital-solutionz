'use client';

import Link from 'next/link';

import {
    SettingsForm,
} from '@/components/crm/settings';

export default function NewSettingPage() {

    async function handleSubmit() {

        // Future server action integration point.
        // Creation flow will be connected here
        // after API/service wiring.

    }

    return (

        <div className="space-y-6">

            <h1 className="text-2xl font-semibold">
                Create Setting
            </h1>


            <SettingsForm
                onSubmit={handleSubmit}
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