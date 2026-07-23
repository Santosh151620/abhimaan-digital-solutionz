import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
    SettingsForm,
} from '@/components/crm/settings';

import {
    getSetting,
} from '../../actions';

interface Props {

    params: Promise<{
        id: string;
    }>;

}

export default async function EditSettingPage({
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

            <div>

                <h1 className="text-2xl font-semibold">
                    Edit Setting
                </h1>

                <p className="text-sm text-muted-foreground">
                    Update CRM configuration setting.
                </p>

            </div>


            <SettingsForm
                initialValues={setting}
                onSubmit={async () => {}}
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