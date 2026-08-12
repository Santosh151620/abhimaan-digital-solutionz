'use client';

import {
    useMemo,
    useState,
} from 'react';

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


interface CompaniesDataTableProps {

    initialCompanies?: Company[];

    onRefresh?: () => void;

}


const STATUS_BADGES: Record<CompanyStatus, string> = {
    ACTIVE:
        'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',

    PROSPECT:
        'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',

    INACTIVE:
        'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400',

    ARCHIVED:
        'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};


type SortField =
    | 'name'
    | 'industry'
    | 'status';


type SortDirection =
    | 'asc'
    | 'desc';


function csvCell(
    value: string | null | undefined,
): string {

    const normalized =
        value ?? '';

    return `"${normalized
        .replace(/"/g, '""')
        .replace(/\r?\n|\r/g, ' ')}"`;

}


export function CompaniesDataTable({

    initialCompanies,

    onRefresh,

}: CompaniesDataTableProps) {

    const router =
        useRouter();

    const queryClient =
        useQueryClient();


    const {
        data = [],
        isLoading,
        isError,
    } = useCompanies({

        initialCompanies,

    });


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

            const keyword =
                search
                    .trim()
                    .toLowerCase();


            const filtered =
                data.filter(
                    (company: Company) => {

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
                                .includes(keyword) ||

                            company.website
                                ?.toLowerCase()
                                .includes(keyword);


                        const matchesStatus =

                            status === 'ALL' ||

                            company.status === status;


                        return (
                            matchesSearch &&
                            matchesStatus
                        );

                    },
                );


            return [...filtered].sort(
                (
                    left,
                    right,
                ) => {

                    const a =
                        String(
                            left[sortBy] ?? '',
                        ).toLowerCase();


                    const b =
                        String(
                            right[sortBy] ?? '',
                        ).toLowerCase();


                    const result =
                        a.localeCompare(
                            b,
                            undefined,
                            {
                                sensitivity: 'base',
                                numeric: true,
                            },
                        );


                    return direction === 'asc'
                        ? result
                        : -result;

                },
            );

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

        if (sortBy === field) {

            setDirection(
                current =>
                    current === 'asc'
                        ? 'desc'
                        : 'asc',
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
                            item !== id,
                    )

                    : [
                        ...current,
                        id,
                    ],
        );

    }


    const allVisibleSelected =
        companies.length > 0 &&
        companies.every(
            company =>
                selected.includes(company.id),
        );


    function toggleAll() {

        if (allVisibleSelected) {

            setSelected(
                current =>
                    current.filter(
                        id =>
                            !companies.some(
                                company =>
                                    company.id === id,
                            ),
                    ),
            );

            return;

        }


        setSelected(
            current => {

                const ids =
                    new Set(current);

                companies.forEach(
                    company =>
                        ids.add(company.id),
                );

                return Array.from(ids);

            },
        );

    }


    function refresh() {

        void queryClient.invalidateQueries({

            queryKey: [
                'companies',
            ],

        });

        onRefresh?.();

    }


    function exportCsv() {

        if (companies.length === 0) {

            return;

        }


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

                ],
            ),

        ];


        const csv =
            rows
                .map(
                    row =>
                        row
                            .map(
                                cell =>
                                    csvCell(cell),
                            )
                            .join(','),
                )
                .join('\r\n');


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        'text/csv;charset=utf-8;',
                },
            );


        const url =
            URL.createObjectURL(
                blob,
            );


        const link =
            document.createElement(
                'a',
            );


        link.href = url;

        link.download =
            'companies.csv';

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(
            url,
        );

    }


    if (isLoading) {

        return (

            <section
                aria-label="Companies"
                aria-busy="true"
                className="crm-card p-10 text-center"
            >

                <div className="mx-auto max-w-sm">

                    <div
                        className="
                            mx-auto
                            h-8
                            w-8
                            animate-spin
                            rounded-full
                            border-2
                            border-muted
                            border-t-primary
                        "
                        aria-hidden="true"
                    />

                    <p className="mt-4 text-sm text-muted-foreground">
                        Loading companies...
                    </p>

                </div>

            </section>

        );

    }


    if (isError) {

        return (

            <section
                role="alert"
                className="
                    rounded-xl
                    border
                    border-destructive/30
                    bg-destructive/5
                    p-8
                    text-center
                "
            >

                <h3 className="font-semibold">
                    Unable to load companies
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                    Please refresh and try again.
                </p>

                <button
                    type="button"
                    onClick={refresh}
                    className="
                        mt-5
                        rounded-lg
                        border
                        px-4
                        py-2
                        text-sm
                        font-medium
                        transition
                        hover:bg-muted
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/20
                    "
                >
                    Retry
                </button>

            </section>

        );

    }


    return (

        <section className="space-y-6">

            <CompaniesToolbar
                total={companies.length}
                selected={selected.length}
                onAdd={() =>
                    router.push(
                        '/crm/companies/new',
                    )
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


            <div className="crm-card overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <caption className="sr-only">
                            CRM companies
                        </caption>


                        <thead className="bg-muted/40">

                            <tr>

                                <th
                                    scope="col"
                                    className="w-12 p-4 text-left"
                                >

                                    <input
                                        type="checkbox"
                                        aria-label="Select all visible companies"
                                        checked={
                                            allVisibleSelected
                                        }
                                        onChange={toggleAll}
                                    />

                                </th>


                                {
                                    CompaniesColumns
                                        .filter(
                                            column =>
                                                column.key !== 'select',
                                        )
                                        .map(
                                            column => {

                                                const sortable =
                                                    column.key === 'name' ||
                                                    column.key === 'industry' ||
                                                    column.key === 'status';


                                                return (

                                                    <th
                                                        key={column.key}
                                                        scope="col"
                                                        className={`
                                                            p-4
                                                            text-left
                                                            text-sm
                                                            font-semibold
                                                            ${column.className ?? ''}
                                                        `}
                                                    >

                                                        {
                                                            sortable

                                                                ? (

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            toggleSort(
                                                                                column.key as SortField,
                                                                            )
                                                                        }
                                                                        aria-label={`Sort by ${column.label}`}
                                                                        className="
                                                                            inline-flex
                                                                            items-center
                                                                            gap-2
                                                                            rounded
                                                                            px-1
                                                                            py-1
                                                                            transition
                                                                            hover:bg-muted
                                                                            focus:outline-none
                                                                            focus:ring-2
                                                                            focus:ring-primary/20
                                                                        "
                                                                    >

                                                                        {column.label}

                                                                        {
                                                                            sortBy === column.key
                                                                                ? (
                                                                                    <span
                                                                                        aria-hidden="true"
                                                                                    >
                                                                                        {
                                                                                            direction === 'asc'
                                                                                                ? '▲'
                                                                                                : '▼'
                                                                                        }
                                                                                    </span>
                                                                                )
                                                                                : (
                                                                                    <span
                                                                                        aria-hidden="true"
                                                                                        className="text-muted-foreground"
                                                                                    >
                                                                                        ↕
                                                                                    </span>
                                                                                )
                                                                        }

                                                                    </button>

                                                                )

                                                                : column.label
                                                        }

                                                    </th>

                                                );

                                            },
                                        )
                                }

                            </tr>

                        </thead>


                        <tbody>

                            {
                                companies.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan={
                                                CompaniesColumns.length
                                            }
                                            className="p-12"
                                        >

                                            <div className="flex flex-col items-center gap-4 text-center">

                                                <div
                                                    className="text-5xl"
                                                    aria-hidden="true"
                                                >
                                                    🏢
                                                </div>

                                                <h3 className="text-xl font-semibold">
                                                    No Companies Found
                                                </h3>

                                                <p className="text-sm text-muted-foreground">
                                                    {
                                                        search.trim() ||
                                                        status !== 'ALL'
                                                            ? 'Try adjusting your search or status filter.'
                                                            : 'Create your first company to begin.'
                                                    }
                                                </p>

                                                <button
                                                    type="button"
                                                    className="
                                                        rounded-lg
                                                        bg-primary
                                                        px-5
                                                        py-2
                                                        font-medium
                                                        text-primary-foreground
                                                        transition
                                                        hover:opacity-90
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-primary/20
                                                    "
                                                    onClick={() =>
                                                        router.push(
                                                            '/crm/companies/new',
                                                        )
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
                                companies.map(
                                    company => (

                                        <tr
                                            key={company.id}
                                            className="
                                                cursor-pointer
                                                border-t
                                                transition
                                                hover:bg-muted/20
                                            "
                                            onClick={() =>
                                                router.push(
                                                    `/crm/companies/${company.id}`,
                                                )
                                            }
                                        >

                                            <td className="p-4">

                                                <input
                                                    type="checkbox"
                                                    aria-label={`Select ${company.name}`}
                                                    checked={selected.includes(
                                                        company.id,
                                                    )}
                                                    onClick={event =>
                                                        event.stopPropagation()
                                                    }
                                                    onChange={() =>
                                                        toggleSelection(
                                                            company.id,
                                                        )
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
                                                    className={`
                                                        inline-flex
                                                        rounded-full
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        ${STATUS_BADGES[company.status]}
                                                    `}
                                                >
                                                    {company.status}
                                                </span>

                                            </td>


                                            <td className="p-4">

                                                <div className="flex flex-wrap gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={event => {

                                                            event.stopPropagation();

                                                            router.push(
                                                                `/crm/companies/${company.id}`,
                                                            );

                                                        }}
                                                        className="
                                                            rounded-lg
                                                            border
                                                            px-3
                                                            py-1.5
                                                            text-sm
                                                            font-medium
                                                            transition
                                                            hover:bg-muted
                                                            focus:outline-none
                                                            focus:ring-2
                                                            focus:ring-primary/20
                                                        "
                                                    >
                                                        View
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={event => {

                                                            event.stopPropagation();

                                                            router.push(
                                                                `/crm/companies/${company.id}/edit`,
                                                            );

                                                        }}
                                                        className="
                                                            rounded-lg
                                                            border
                                                            px-3
                                                            py-1.5
                                                            text-sm
                                                            font-medium
                                                            transition
                                                            hover:bg-muted
                                                            focus:outline-none
                                                            focus:ring-2
                                                            focus:ring-primary/20
                                                        "
                                                    >
                                                        Edit
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ),
                                )
                            }

                        </tbody>

                    </table>

                </div>


                <div
                    className="
                        flex
                        flex-col
                        gap-2
                        border-t
                        bg-muted/30
                        px-5
                        py-3
                        text-sm
                        text-muted-foreground
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div>

                        Showing

                        <strong className="mx-1 text-foreground">
                            {companies.length}
                        </strong>

                        {companies.length === 1
                            ? 'company'
                            : 'companies'}

                    </div>


                    <div>

                        Selected

                        <strong className="mx-1 text-foreground">
                            {selected.length}
                        </strong>

                        of

                        <strong className="mx-1 text-foreground">
                            {companies.length}
                        </strong>

                    </div>


                    <div>

                        Sorted by

                        <strong className="ml-1 capitalize text-foreground">
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