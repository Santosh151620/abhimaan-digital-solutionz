'use client';

import Link from 'next/link';

import type {
    Setting,
} from '@/types/crm/Settings';


interface Props {

    settings: Setting[];

}



function Badge({
    value,
}: {
    value: string;
}) {

    return (

        <span className="inline-flex rounded-full border px-3 py-1 text-xs font-medium">
            {value}
        </span>

    );

}



export default function SettingsTable({
    settings,
}: Props) {


    if (!settings.length) {

        return (

            <div className="crm-card p-8 text-center">

                <div className="font-medium">
                    No settings found.
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                    Create a new CRM setting to get started.
                </p>

            </div>

        );

    }



    return (

        <div className="crm-card overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full">


                    <thead>

                        <tr className="border-b bg-muted/30 text-left">


                            <th className="p-4 text-sm font-semibold">
                                Name
                            </th>


                            <th className="p-4 text-sm font-semibold">
                                Key
                            </th>


                            <th className="p-4 text-sm font-semibold">
                                Category
                            </th>


                            <th className="p-4 text-sm font-semibold">
                                Status
                            </th>


                            <th className="p-4 text-sm font-semibold">
                                Editable
                            </th>


                            <th className="p-4 text-sm font-semibold">
                                Encrypted
                            </th>


                            <th className="p-4 text-right text-sm font-semibold">
                                Actions
                            </th>


                        </tr>


                    </thead>



                    <tbody>

                        {
                            settings.map(setting => (

                                <tr
                                    key={setting.id}
                                    className="border-b transition hover:bg-muted/20"
                                >


                                    <td className="p-4">

                                        <div className="font-medium">
                                            {setting.name}
                                        </div>


                                        {
                                            setting.description && (

                                                <div className="mt-1 max-w-xs truncate text-sm text-muted-foreground">
                                                    {setting.description}
                                                </div>

                                            )
                                        }


                                    </td>



                                    <td className="p-4 text-sm">
                                        {setting.key}
                                    </td>



                                    <td className="p-4">

                                        <Badge
                                            value={setting.category}
                                        />

                                    </td>



                                    <td className="p-4">

                                        <Badge
                                            value={setting.status}
                                        />

                                    </td>



                                    <td className="p-4 text-sm">

                                        {
                                            setting.editable
                                                ? 'Yes'
                                                : 'No'
                                        }

                                    </td>



                                    <td className="p-4 text-sm">

                                        {
                                            setting.encrypted
                                                ? 'Yes'
                                                : 'No'
                                        }

                                    </td>



                                    <td className="p-4">

                                        <div className="flex justify-end gap-2">


                                            <Link
                                                href={`/crm/settings/${setting.id}`}
                                                className="inline-flex rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                                            >
                                                View
                                            </Link>


                                            {
                                                setting.editable && (

                                                    <Link
                                                        href={`/crm/settings/${setting.id}/edit`}
                                                        className="inline-flex rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                                                    >
                                                        Edit
                                                    </Link>

                                                )
                                            }


                                        </div>

                                    </td>


                                </tr>

                            ))
                        }


                    </tbody>


                </table>


            </div>


        </div>

    );

}