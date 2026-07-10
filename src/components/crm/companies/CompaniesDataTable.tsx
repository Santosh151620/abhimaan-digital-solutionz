'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanies } from '@/hooks/crm/useCompanies';
import { CompaniesColumns } from './CompaniesColumns';
import { CompaniesFilters } from './CompaniesFilters';
import { CompaniesToolbar } from './CompaniesToolbar';
import type { Company, CompanyStatus } from '@/types/crm/Companies';

export function CompaniesDataTable() {
    const router = useRouter();
    const { data = [], isLoading, isError } = useCompanies();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<CompanyStatus | 'ALL'>('ALL');
    const [selected, setSelected] = useState<string[]>([]);

    const companies = useMemo(() => {
        return data.filter((company: Company) => {
            const matchesSearch = company.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesStatus =
                status === 'ALL' || company.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [data, search, status]);

    const toggleSelection = (id: string) => {
        setSelected((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    };

    const toggleAll = () => {
        if (selected.length === companies.length) {
            setSelected([]);
            return;
        }

        setSelected(companies.map((c) => c.id));
    };

    const badgeClasses: Record<CompanyStatus, string> = {
        ACTIVE: 'bg-green-100 text-green-700',
        PROSPECT: 'bg-blue-100 text-blue-700',
        INACTIVE: 'bg-gray-100 text-gray-700',
        ARCHIVED: 'bg-red-100 text-red-700',
    };

    if (isLoading) {
        return <div className="p-8">Loading companies...</div>;
    }

    if (isError) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
                Unable to load companies.
            </div>
        );
    }

    return (
        <section className="space-y-6">

            <CompaniesToolbar
                total={companies.length}
                selected={selected.length}
            />

            <CompaniesFilters
                search={search}
                status={status}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
            />

            <div className="overflow-x-auto rounded-xl border bg-white">

                <table className="min-w-full">

                    <thead className="bg-muted/40">

                        <tr>

                            <th className="w-12 p-4">
                                <input
                                    type="checkbox"
                                    checked={
                                        companies.length > 0 &&
                                        selected.length === companies.length
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={toggleAll}
                                />
                            </th>

                            {CompaniesColumns.filter(
                                (column) => column.key !== 'select'
                            ).map((column) => (
                                <th
                                    key={column.key}
                                    className={`p-4 text-left text-sm font-semibold ${column.className ?? ''}`}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>

                    </thead>

                    <tbody>

                        {companies.length === 0 && (
                            <tr>
                                <td
                                    colSpan={CompaniesColumns.length}
                                    className="p-12 text-center text-muted-foreground"
                                >
                                    No companies found.
                                </td>
                            </tr>
                        )}

                        {companies.map((company) => (

                            <tr
                                key={company.id}
                                className="cursor-pointer border-t transition hover:bg-muted/20"
                                onClick={() =>
                                    router.push(`/crm/companies/${company.id}`)
                                }
                            >

                                <td className="p-4">

                                    <input
                                        type="checkbox"
                                        checked={selected.includes(company.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() =>
                                            toggleSelection(company.id)
                                        }
                                    />

                                </td>

                                <td className="p-4 font-medium">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/crm/companies/${company.id}`);
                                        }}
                                        className="rounded border px-3 py-1 text-sm hover:bg-muted">
                                        View
                                    </button>
                                </td>

                                <td className="p-4">
                                    {company.industry ?? '—'}
                                </td>

                                <td className="p-4">
                                    {company.website ?? '—'}
                                </td>

                                <td className="p-4">
                                    {company.phone ?? '—'}
                                </td>

                                <td className="p-4">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClasses[company.status]}`}
                                    >
                                        {company.status}
                                    </span>

                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push(
                                                    `/crm/companies/${company.id}`
                                                )
                                            }
                                            className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                        >
                                            View
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/crm/companies/${company.id}/edit`);
                                            }}
                                            className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                        >
                                            Edit
                                        </button>

                                    </div>
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </section>
    );
};
