'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { useCompanies } from '@/hooks/crm/useCompanies';
import { CompaniesColumns } from './CompaniesColumns';
import { CompaniesFilters } from './CompaniesFilters';
import { CompaniesToolbar } from './CompaniesToolbar';

import type {
    Company,
    CompanyStatus,
} from '@/types/crm/Companies';

const STATUS_BADGES: Record<CompanyStatus, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    PROSPECT: 'bg-blue-100 text-blue-700',
    INACTIVE: 'bg-gray-100 text-gray-700',
    ARCHIVED: 'bg-red-100 text-red-700',
};

type SortField =
    | 'name'
    | 'industry'
    | 'status';

type SortDirection =
    | 'asc'
    | 'desc';

export function CompaniesDataTable() {

    const router =
        useRouter();

    const queryClient =
        useQueryClient();

    const {
        data = [],
        isLoading,
        isError,
    } = useCompanies();

    const [
        search,
        setSearch,
    ] = useState('');

    const [
        status,
        setStatus,
    ] = useState<
        CompanyStatus | 'ALL'
    >('ALL');

    const [
        selected,
        setSelected,
    ] = useState<string[]>([]);

    const [
        sortBy,
        setSortBy,
    ] = useState<SortField>('name');

    const [
        direction,
        setDirection,
    ] = useState<SortDirection>('asc');

    const companies =
        useMemo(() => {

            const filtered =
                data.filter(
                    (company: Company) => {

                        const keyword =
                            search
                                .trim()
                                .toLowerCase();

                        const matchesSearch =

                            keyword.length === 0 ||

                            company.name
                                .toLowerCase()
                                .includes(keyword) ||

                            company.email
                                ?.toLowerCase()
                                .includes(keyword) ||

                            company.phone
                                ?.toLowerCase()
                                .includes(keyword) ||

                            company.industry
                                ?.toLowerCase()
                                .includes(keyword);

                        const matchesStatus =

                            status === 'ALL' ||

                            company.status === status;

                        return (
                            matchesSearch &&
                            matchesStatus
                        );

                    }
                );

            filtered.sort(
                (
                    left,
                    right,
                ) => {

                    const a =
                        String(
                            left[
                                sortBy
                            ] ?? ''
                        ).toLowerCase();

                    const b =
                        String(
                            right[
                                sortBy
                            ] ?? ''
                        ).toLowerCase();

                    const result =
                        a.localeCompare(b);

                    return direction === 'asc'
                        ? result
                        : -result;

                }
            );

            return filtered;

        }, [
            data,
            search,
            status,
            sortBy,
            direction,
        ]);

    function toggleSort(
        field: SortField,
    ) {

        if (
            sortBy === field
        ) {

            setDirection(
                current =>
                    current === 'asc'
                        ? 'desc'
                        : 'asc'
            );

            return;

        }

        setSortBy(field);

        setDirection('asc');

    }

    function toggleSelection(
        id: string,
    ) {

        setSelected(
            current =>

                current.includes(id)

                    ? current.filter(
                        item =>
                            item !== id
                    )

                    : [
                        ...current,
                        id,
                    ]

        );

    }

    function toggleAll() {

        if (
            selected.length ===
            companies.length
        ) {

            setSelected([]);

            return;

        }

        setSelected(

            companies.map(
                company =>
                    company.id
            )

        );

    }

    function refresh() {

        queryClient.invalidateQueries({

            queryKey: [
                'companies',
            ],

        });

    }

    function exportCsv() {

        const rows = [

            [
                'Company',
                'Industry',
                'Website',
                'Phone',
                'Email',
                'Status',
            ],

            ...companies.map(
                company => [

                    company.name,

                    company.industry ?? '',

                    company.website ?? '',

                    company.phone ?? '',

                    company.email ?? '',

                    company.status,

                ]
            ),

        ];

        const csv =

            rows
                .map(
                    row =>
                        row.join(',')
                )
                .join('\n');

        const blob =
            new Blob(
                [csv],
                {
                    type:
                        'text/csv;charset=utf-8;',
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                'a'
            );

        link.href = url;

        link.download =
            'companies.csv';

        link.click();

        URL.revokeObjectURL(
            url
        );

    }
        if (isLoading) {

        return (

            <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">

                Loading companies...

            </div>

        );

    }

    if (isError) {

        return (

            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">

                <h3 className="font-semibold">
                    Unable to load companies
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                    Please refresh and try again.
                </p>

            </div>

        );

    }

    return (

        <section className="space-y-6">

            <CompaniesToolbar
                total={companies.length}
                selected={selected.length}
                onAdd={() =>
                    router.push('/crm/companies/new')
                }
                onRefresh={refresh}
                onExport={exportCsv}
            />

            <CompaniesFilters
                search={search}
                status={status}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
            />

            <div className="overflow-x-auto rounded-xl border bg-background">

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
                                    onChange={toggleAll}
                                />

                            </th>

                            {

                                CompaniesColumns
                                    .filter(
                                        column =>
                                            column.key !== 'select'
                                    )
                                    .map(column => (

                                        <th
                                            key={column.key}
                                            className={`p-4 text-left text-sm font-semibold ${column.className ?? ''}`}
                                        >

                                            {

                                                column.key === 'name' ||
                                                column.key === 'industry' ||
                                                column.key === 'status'

                                                    ? (

                                                        <button
                                                            type="button"
                                                            className="flex items-center gap-2"
                                                            onClick={() =>
                                                                toggleSort(
                                                                    column.key as
                                                                    | 'name'
                                                                    | 'industry'
                                                                    | 'status'
                                                                )
                                                            }
                                                        >

                                                            {column.label}

                                                            {

                                                                sortBy === column.key &&

                                                                (

                                                                    direction === 'asc'
                                                                        ? '▲'
                                                                        : '▼'

                                                                )

                                                            }

                                                        </button>

                                                    )

                                                    : column.label

                                            }

                                        </th>

                                    ))

                            }

                        </tr>

                    </thead>

                    <tbody>

                        {

                            companies.length === 0 &&

                            (

                                <tr>

                                    <td
                                        colSpan={CompaniesColumns.length}
                                        className="p-12"
                                    >

                                        <div className="flex flex-col items-center gap-4">

                                            <div className="text-6xl">

                                                🏢

                                            </div>

                                            <h3 className="text-xl font-semibold">

                                                No Companies Found

                                            </h3>

                                            <p className="text-muted-foreground">

                                                Create your first company to begin.

                                            </p>

                                            <button
                                                type="button"
                                                className="rounded-lg bg-primary px-5 py-2 text-primary-foreground"
                                                onClick={() =>
                                                    router.push('/crm/companies/new')
                                                }
                                            >

                                                New Company

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            )

                        }

                        {

                            companies.map(company => (

                                <tr
                                    key={company.id}
                                    className="cursor-pointer border-t transition hover:bg-muted/20"
                                    onClick={() =>
                                        router.push(
                                            `/crm/companies/${company.id}`
                                        )
                                    }
                                >

                                    <td className="p-4">

                                        <input
                                            type="checkbox"
                                            checked={selected.includes(company.id)}
                                            onClick={event =>
                                                event.stopPropagation()
                                            }
                                            onChange={() =>
                                                toggleSelection(company.id)
                                            }
                                        />

                                    </td>
                                                                        <td className="p-4 font-medium">
                                        {company.name}
                                    </td>

                                    <td className="p-4">
                                        {company.industry ?? '-'}
                                    </td>

                                    <td className="p-4">
                                        {company.website ?? '-'}
                                    </td>

                                    <td className="p-4">
                                        {company.phone ?? '-'}
                                    </td>

                                    <td className="p-4">

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGES[company.status]}`}
                                        >
                                            {company.status}
                                        </span>

                                    </td>

                                    <td className="p-4">

                                        <div className="flex gap-2">

                                            <button
                                                type="button"
                                                onClick={(event) => {

                                                    event.stopPropagation();

                                                    router.push(
                                                        `/crm/companies/${company.id}`
                                                    );

                                                }}
                                                className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                            >
                                                View
                                            </button>

                                            <button
                                                type="button"
                                                onClick={(event) => {

                                                    event.stopPropagation();

                                                    router.push(
                                                        `/crm/companies/${company.id}/edit`
                                                    );

                                                }}
                                                className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                            >
                                                Edit
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        }

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

                        Selected

                        <strong className="mx-1">
                            {selected.length}
                        </strong>

                        of

                        <strong className="mx-1">
                            {companies.length}
                        </strong>

                    </div>

                    <div>

                        Sorted by

                        <strong className="ml-1 capitalize">
                            {sortBy}
                        </strong>

                        {' '}

                        (

                        {direction}

                        )

                    </div>

                </div>

            </div>

        </section>

    );

}