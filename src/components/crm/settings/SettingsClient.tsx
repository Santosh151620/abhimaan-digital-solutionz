'use client';

import { useState } from 'react';

import {
    SettingsForm,
    SettingsSummary,
    SettingsTable,
} from './index';

import type {
    Setting,
    SettingsSummary as SettingsSummaryModel,
} from '@/types/crm/Settings';

interface Props {

    initialSettings: Setting[];

    summary: SettingsSummaryModel;

}

export default function SettingsClient({
    initialSettings,
    summary,
}: Props) {

    const [settings, setSettings] =
        useState<Setting[]>(
            initialSettings,
        );

    const [showForm, setShowForm] =
        useState(false);

    async function createSetting(
        values: Partial<Setting>,
    ) {

        const now =
            new Date().toISOString();

        const setting: Setting = {

            id:
                crypto.randomUUID(),

            settingNumber:
                `SET-${Date.now()}`,

            companyId:
                values.companyId,

            category:
                values.category ??
                'General',

            key:
                values.key ?? '',

            name:
                values.name ?? '',

            description:
                values.description,

            value:
                values.value ?? '',

            defaultValue:
                values.defaultValue,

            status:
                values.status ??
                'Active',

            editable:
                values.editable ??
                true,

            encrypted:
                values.encrypted ??
                false,

            archived:
                false,

            createdAt:
                now,

            updatedAt:
                now,

        };

        setSettings(previous => [
            ...previous,
            setting,
        ]);

        setShowForm(false);

    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <h2 className="text-xl font-semibold">
                    Settings
                </h2>

                <button
                    onClick={() => setShowForm(true)}
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    New Setting
                </button>

            </div>

            <SettingsSummary
                summary={{
                    ...summary,
                    total: settings.length,
                }}
            />

            {
                showForm && (

                    <SettingsForm
                        onSubmit={
                            createSetting
                        }
                        onCancel={
                            () => setShowForm(false)
                        }
                    />

                )
            }

            <SettingsTable
                settings={settings}
            />

        </div>

    );

}