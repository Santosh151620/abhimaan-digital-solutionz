'use client';

import Link from 'next/link';

import type {
    Setting,
} from '@/types/crm/Settings';

interface Props {

    settings: Setting[];

}

export default function SettingsTable({
    settings,
}: Props) {

    if (settings.length === 0) {

        return (

            <div className="rounded-xl border p-8 text-center text-muted-foreground">
                No settings found.
            </div>

        );

    }

    return (

        <div className="overflow-x-auto rounded-xl border">

            <table className="w-full">

                <thead>

                    <tr className="border-b bg-muted/40 text-left">

                        <th className="p-3">
                            Name
                        </th>

                        <th className="p-3">
                            Key
                        </th>

                        <th className="p-3">
                            Category
                        </th>

                        <th className="p-3">
                            Status
                        </th>

                        <th className="p-3">
                            Editable
                        </th>

                        <th className="p-3">
                            Encrypted
                        </th>

                        <th className="p-3 text-right">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        settings.map(setting => (

                            <tr
                                key={setting.id}
                                className="border-b hover:bg-muted/30"
                            >

                                <td className="p-3">

                                    <div className="font-medium">
                                        {setting.name}
                                    </div>

                                </td>

                                <td className="p-3">
                                    {setting.key}
                                </td>

                                <td className="p-3">
                                    {setting.category}
                                </td>

                                <td className="p-3">
                                    {setting.status}
                                </td>

                                <td className="p-3">
                                    {
                                        setting.editable
                                            ? 'Yes'
                                            : 'No'
                                    }
                                </td>

                                <td className="p-3">
                                    {
                                        setting.encrypted
                                            ? 'Yes'
                                            : 'No'
                                    }
                                </td>

                                <td className="p-3 text-right">

                                    <Link
                                        href={`/crm/settings/${setting.id}`}
                                        className="rounded border px-3 py-1 text-sm"
                                    >
                                        View
                                    </Link>

                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>

        </div>

    );

}