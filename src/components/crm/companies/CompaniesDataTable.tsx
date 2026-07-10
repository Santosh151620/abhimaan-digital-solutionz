'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanies } from '@/hooks/crm/useCompanies';
import { CompaniesColumns } from './CompaniesColumns';
import { CompaniesFilters } from './CompaniesFilters';
import { CompaniesToolbar } from './CompaniesToolbar';
import type { Company, CompanyStatus } from '@/types/crm/Companies';
import { useQueryClient } from '@tanstack/react-query';

export function CompaniesDataTable() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data = [], isLoading, isError } = useCompanies();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<CompanyStatus | 'ALL'>('ALL');
    const [selected, setSelected] = useState<string[]>([]);

    const [sortBy, setSortBy] = useState<
        'name' | 'industry' | 'status'
    >('name');

    const [sortDirection, setSortDirection] = useState<
        'asc' | 'desc'
    >('asc');

    const companies = useMemo(() => {
        const filtered = data.filter((company: Company) => {
            const matchesSearch = company.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesStatus =
                status === 'ALL' ||
                company.status === status;

            return matchesSearch && matchesStatus;
        });

        filtered.sort((a, b) => {
            const left = String(
                a[sortBy] ?? ''
            ).toLowerCase();

            const right = String(
                b[sortBy] ?? ''
            ).toLowerCase();

            if (left < right) {
                return sortDirection === 'asc'
                    ? -1
                    : 1;
            }

            if (left > right) {
                return sortDirection === 'asc'
                    ? 1
                    : -1;
            }

            return 0;
        });

        return filtered;
    }, [
        data,
        search,
        status,
        sortBy,
        sortDirection,
    ]);

    const toggleSelection = (id: string) => {
        setSelected((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    };
    function toggleSort(
        column: 'name' | 'industry' | 'status'
    ) {
        if (sortBy === column) {
            setSortDirection((current) =>
                current === 'asc'
                    ? 'desc'
                    : 'asc'
            );
            return;
        }

        setSortBy(column);
        setSortDirection('asc');
    }
    function exportCsv() {

        const headers = [
            'Name',
            'Industry',
            'Website',
            'Phone',
            'Status',
        ];

        const rows = companies.map(company => [

            company.name,
            company.industry ?? '',
            company.website ?? '',
            company.phone ?? '',
            company.status,

        ]);

        const csv = [
            headers,
            ...rows,
        ]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob(
            [csv],
            {
                type: 'text/csv',
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;

        link.download = 'companies.csv';

        link.click();

        URL.revokeObjectURL(url);
    }

    function refreshData() {
        queryClient.invalidateQueries({
            queryKey: ['companies'],
        });
    }
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
        return (
            <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                Loading companies...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
                No companies match the current filters.
            </div>
        );
    }

    return (
        <section className="space-y-6">

            <CompaniesToolbar
                total={companies.length}
                selected={selected.length}
                onAdd={() => router.push('/crm/companies/new')}
                onRefresh={refreshData}
                onExport={exportCsv}
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
                                    {column.key === 'name' ||
                                        column.key === 'industry' ||
                                        column.key === 'status' ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleSort(
                                                    column.key as
                                                    | 'name'
                                                    | 'industry'
                                                    | 'status'
                                                )
                                            }

                                            className="flex items-center gap-1 font-semibold"
                                        >
                                            {column.label}

                                            {sortBy === column.key &&
                                                (sortDirection === 'asc'
                                                    ? '▲'
                                                    : '▼')}
                                        </button>
                                    ) : (
                                        column.label
                                    )}
                                </th>
                            ))}
                        </tr>

                    </thead>

                    <tbody>

                        {companies.length === 0 && (
                            <tr>
                                <td
                                    colSpan={CompaniesColumns.length}
                                    className="p-12"
                                ><div className="flex flex-col items-center gap-4 py-10">

                                        <div className="text-6xl">
                                            🏢
                                        </div>

                                        <div className="text-lg font-semibold">
                                            No companies found
                                        </div>

                                        <p className="text-muted-foreground">
                                            Create your first company to get started.
                                        </p>

                                        <button
                                            className="rounded-lg bg-primary px-5 py-2 text-primary-foreground"
                                            onClick={() =>
                                                router.push('/crm/companies/new')
                                            }
                                        >
                                            + New Company
                                        </button>

                                    </div>
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

                                {/* <td className="p-4 font-medium">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/crm/companies/${company.id}`);
                                    }}
                                    className="rounded border px-3 py-1 text-sm hover:bg-muted">
                                    View
                                </button>
                            </td> */}
                                <td className="p-4 font-medium">
                                    {company.name}
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
                <div className="flex items-center justify-between border-t bg-muted/30 px-5 py-3 text-sm text-muted-foreground">

                    <div>

                        Showing

                        <strong className="mx-1">
                            {companies.length}
                        </strong>

                        companies

                    </div>

                    <div>

                        Sorted by

                        <strong className="ml-1 capitalize">
                            {sortBy}
                        </strong>

                    </div>

                </div>
            </div>

        </section >
    );
};
