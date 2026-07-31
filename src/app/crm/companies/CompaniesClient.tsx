'use client';

import {
    useState,
} from 'react';

import {
    useRouter,
} from 'next/navigation';

import {
    createCompany,
} from './actions';

import type {
    Company,
} from '@/types/crm/Companies';

import {
    CompaniesDataTable,
} from '@/components/crm/companies';


interface Props {
    initialCompanies: Company[];

}

export default function CompaniesClient({
    initialCompanies,

}: Props) {

    void initialCompanies;
    const router =
        useRouter();

    const [
        name,
        setName,
    ] = useState('');

    const [
        isCreating,
        setIsCreating,
    ] = useState(false);

    async function handleCreate() {

        const companyName =
            name.trim();
        if (!companyName) {
            return;
        }

        try {
            setIsCreating(true);
            await createCompany({

                name:
                    companyName,

                status:
                    'ACTIVE',

                entityType:
                    'Company',

            });
            setName('');
            router.refresh();
        } finally {
            setIsCreating(false);
        }
    }

    return (

        <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row">
                <input
                    value={name}
                    onChange={(event) =>
                        setName(
                            event.target.value,
                        )
                    }
                    placeholder="Company name"
                    className="flex-1 rounded-md border px-3 py-2"

                />

                <button
                    type="button"
                    disabled={isCreating}
                    onClick={handleCreate}
                    className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"

                >

                    {
                        isCreating
                            ? 'Creating...'
                            : 'Add Company'
                    }
                </button>
            </div>
            <CompaniesDataTable />
        </div>

    );

}