import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
    getSetting,
} from '../actions';

interface Props {

    params: Promise<{
        id: string;
    }>;

}

export default async function SettingDetailsPage({
    params,
}: Props) {

    const { id } =
        await params;

    const setting =
        await getSetting(id);

    if (!setting) {

        notFound();

    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-semibold">
                        {setting.name}
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        {setting.settingNumber}
                    </p>

                </div>

                <Link
                    href={`/crm/settings/${setting.id}/edit`}
                    className="rounded-lg border px-4 py-2"
                >
                    Edit
                </Link>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

                <div className="rounded-xl border p-6 space-y-4">

                    <div>

                        <div className="text-sm text-muted-foreground">
                            Key
                        </div>

                        <div className="font-medium">
                            {setting.key}
                        </div>

                    </div>

                    <div>

                        <div className="text-sm text-muted-foreground">
                            Category
                        </div>

                        <div>
                            {setting.category}
                        </div>

                    </div>

                    <div>

                        <div className="text-sm text-muted-foreground">
                            Status
                        </div>

                        <div>
                            {setting.status}
                        </div>

                    </div>

                </div>

                <div className="rounded-xl border p-6 space-y-4">

                    <div>

                        <div className="text-sm text-muted-foreground">
                            Editable
                        </div>

                        <div>
                            {setting.editable ? 'Yes' : 'No'}
                        </div>

                    </div>

                    <div>

                        <div className="text-sm text-muted-foreground">
                            Encrypted
                        </div>

                        <div>
                            {setting.encrypted ? 'Yes' : 'No'}
                        </div>

                    </div>

                    <div>

                        <div className="text-sm text-muted-foreground">
                            Value
                        </div>

                        <pre className="whitespace-pre-wrap break-words rounded bg-muted p-3 text-sm">
                            {setting.value}
                        </pre>

                    </div>

                </div>

            </div>

            {
                setting.description && (

                    <div className="rounded-xl border p-6">

                        <h2 className="mb-3 font-semibold">
                            Description
                        </h2>

                        <p className="whitespace-pre-wrap">
                            {setting.description}
                        </p>

                    </div>

                )
            }

        </div>

    );

}