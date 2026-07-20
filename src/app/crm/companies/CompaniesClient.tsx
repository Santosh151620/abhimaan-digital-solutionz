'use client';

import Link from 'next/link';
import { useState } from 'react';

import {
    createCompany,
    deleteCompany,
} from './actions';

import type {
    Company,
    CompanyDetails,
} from '@/types/crm/Companies';

interface Props {
    initialCompanies: Company[];
}

export default function CompaniesClient({
    initialCompanies,
}: Props) {

    const [
        companies,
        setCompanies,
    ] = useState<Company[]>(
        initialCompanies
    );

    const [
        name,
        setName,
    ] = useState('');

    async function handleCreate() {

        if (!name.trim()) {
            return;
        }

        const company =
            await createCompany({
                name,
                status: 'ACTIVE',
            } as Partial<CompanyDetails>);

        setCompanies(
            previous => [
                ...previous,
                company,
            ]
        );

        setName('');

    }

    async function handleDelete(
        id: string
    ) {

        const success =
            await deleteCompany(id);

        if (!success) {
            return;
        }

        setCompanies(
            previous =>
                previous.filter(
                    company =>
                        company.id !== id
                )
        );

    }

    return (

        <div className="space-y-6">

            <div className="flex gap-3">

                <input
                    value={name}
                    onChange={
                        e =>
                            setName(
                                e.target.value
                            )
                    }
                    placeholder="Company name"
                    className="flex-1 rounded border px-3 py-2"
                />

                <button
                    onClick={handleCreate}
                    className="rounded bg-primary px-4 py-2 text-primary-foreground"
                >
                    Add Company
                </button>

            </div>

            <div className="rounded-lg border">

                {
                    companies.map(
                        company => (

                            <div
                                key={company.id}
                                className="flex items-center justify-between border-b p-4 last:border-0"
                            >

                                <div>

                                    <p className="font-medium">
                                        {company.name}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {company.status}
                                        {' • '}
                                        {company.industry ?? '-'}
                                    </p>

                                    {
                                        company.email && (

                                            <p className="text-sm text-muted-foreground">
                                                {company.email}
                                            </p>

                                        )
                                    }

                                </div>

                                <div className="flex items-center gap-3">

                                    <Link
                                        href={`/crm/companies/${company.id}`}
                                        className="text-sm text-primary"
                                    >
                                        View
                                    </Link>

                                    <button
                                        onClick={
                                            () =>
                                                handleDelete(
                                                    company.id
                                                )
                                        }
                                        className="text-sm text-destructive"
                                    >
                                        Archive
                                    </button>

                                </div>

                            </div>

                        )
                    )
                }

                {
                    companies.length === 0 && (

                        <div className="p-6 text-center text-muted-foreground">
                            No companies available.
                        </div>

                    )
                }

            </div>

        </div>

    );

}