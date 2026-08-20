'use client';

import {
    useEffect,
    useState,
} from 'react';

import Link from 'next/link';

import type {
    Project,
    ProjectStatus,
} from '@/types/crm/Projects';

interface Props {

    initialProjects: Project[];

    initialTotal?: number;

    initialPage?: number;

    initialPageSize?: number;

    initialTotalPages?: number;

}

interface ProjectsResponse {

    success: boolean;

    data: Project[];

    total: number;

    page: number;

    pageSize: number;

    totalPages: number;

    message?: string;

}

const PAGE_SIZE = 20;

const STATUS_OPTIONS: Array<
    ProjectStatus | "All"
> = [
    "All",
    "Planning",
    "Active",
    "On Hold",
    "Completed",
    "Cancelled",
];

export default function ProjectsClient({

    initialProjects,

    initialTotal = initialProjects.length,

    initialPage = 1,

    initialPageSize = PAGE_SIZE,

    initialTotalPages = Math.max(
        1,
        Math.ceil(
            initialTotal /
            initialPageSize,
        ),
    ),

}: Props) {

    const [
        projects,
        setProjects,
    ] = useState<Project[]>(
        initialProjects,
    );

    const [
        total,
        setTotal,
    ] = useState<number>(
        initialTotal,
    );

    const [
        page,
        setPage,
    ] = useState<number>(
        initialPage,
    );

    const [
        totalPages,
        setTotalPages,
    ] = useState<number>(
        initialTotalPages,
    );

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        status,
        setStatus,
    ] = useState<
        ProjectStatus | "All"
    >("All");

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState<string | null>(
        null,
    );

    useEffect(() => {

        if (
            page === initialPage &&
            search === "" &&
            status === "All"
        ) {
            return;
        }

        const controller =
            new AbortController();

        async function loadProjects() {

            setLoading(true);
            setError(null);

            try {

                const params =
                    new URLSearchParams();

                params.set(
                    "page",
                    String(page),
                );

                params.set(
                    "pageSize",
                    String(PAGE_SIZE),
                );

                if (
                    search.trim()
                ) {
                    params.set(
                        "search",
                        search.trim(),
                    );
                }

                if (
                    status !== "All"
                ) {
                    params.set(
                        "status",
                        status,
                    );
                }

                const response =
                    await fetch(
                        `/api/crm/projects?${params.toString()}`,
                        {
                            method: "GET",
                            signal:
                                controller.signal,
                        },
                    );

                const result =
                    await response.json() as
                    ProjectsResponse;

                if (
                    !response.ok ||
                    !result.success
                ) {
                    throw new Error(
                        result.message ??
                        "Unable to load projects",
                    );
                }

                setProjects(
                    result.data,
                );

                setTotal(
                    result.total,
                );

                setPage(
                    result.page,
                );

                setTotalPages(
                    Math.max(
                        1,
                        result.totalPages,
                    ),
                );

            } catch (loadError) {

                if (
                    loadError instanceof DOMException &&
                    loadError.name === "AbortError"
                ) {
                    return;
                }

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Unable to load projects",
                );

            } finally {

                if (
                    !controller.signal.aborted
                ) {
                    setLoading(false);
                }

            }

        }

        void loadProjects();

        return () => {
            controller.abort();
        };

    }, [
        page,
        search,
        status,
        initialPage,
    ]);

    function handleSearch(
        value: string,
    ) {

        setSearch(value);

        setPage(1);

    }

    function handleStatus(
        value: ProjectStatus | "All",
    ) {

        setStatus(value);

        setPage(1);

    }

    return (

        <div className="space-y-4">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h2 className="font-semibold">
                        Project List
                    </h2>

                    <span className="text-sm text-muted-foreground">

                        {total} records

                    </span>

                </div>

                <div className="flex flex-col gap-2 sm:flex-row">

                    <input
                        type="search"
                        value={search}
                        onChange={
                            event =>
                                handleSearch(
                                    event.target.value,
                                )
                        }
                        placeholder="Search projects..."
                        className="rounded-md border px-3 py-2 text-sm"
                    />

                    <select
                        value={status}
                        onChange={
                            event =>
                                handleStatus(
                                    event.target.value as
                                        ProjectStatus |
                                        "All",
                                )
                        }
                        className="rounded-md border px-3 py-2 text-sm"
                    >

                        {
                            STATUS_OPTIONS.map(
                                option => (
                                    <option
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </option>
                                ),
                            )
                        }

                    </select>

                </div>

            </div>

            {
                error && (

                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">

                        {error}

                    </div>

                )
            }

            <div className="space-y-3">

                {
                    loading && (

                        <div className="rounded-lg border p-4 text-sm text-muted-foreground">

                            Loading projects...

                        </div>

                    )
                }

                {
                    !loading &&
                    projects.length === 0 && (

                        <div className="rounded-lg border p-6 text-center text-muted-foreground">

                            No projects found.

                        </div>

                    )
                }

                {
                    projects.map(

                        project => (

                            <div
                                key={project.id}
                                className="rounded-lg border p-4"
                            >

                                <div className="flex items-start justify-between">

                                    <div>

                                        <Link
                                            href={`/crm/projects/${project.id}`}
                                            className="font-semibold hover:underline"
                                        >
                                            {project.name}
                                        </Link>

                                        <p className="text-sm text-muted-foreground">

                                            {project.projectNumber}

                                        </p>

                                    </div>

                                    <span className="text-sm">

                                        {project.status}

                                    </span>

                                </div>

                                <div className="mt-4 grid gap-2 text-sm md:grid-cols-4">

                                    <div>

                                        Customer

                                        <div className="font-medium">

                                            {project.customerName}

                                        </div>

                                    </div>

                                    <div>

                                        Budget

                                        <div className="font-medium">

                                            {project.currency}{" "}
                                            {project.budget.toLocaleString()}

                                        </div>

                                    </div>

                                    <div>

                                        Start

                                        <div className="font-medium">

                                            {project.startDate}

                                        </div>

                                    </div>

                                    <div>

                                        End

                                        <div className="font-medium">

                                            {project.endDate}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ),
                    )

                }

            </div>

            {
                totalPages > 1 && (

                    <div className="flex items-center justify-between border-t pt-4">

                        <button
                            type="button"
                            disabled={
                                loading ||
                                page <= 1
                            }
                            onClick={() =>
                                setPage(
                                    current =>
                                        Math.max(
                                            1,
                                            current - 1,
                                        ),
                                )
                            }
                            className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-muted-foreground">

                            Page {page} of {totalPages}

                        </span>

                        <button
                            type="button"
                            disabled={
                                loading ||
                                page >= totalPages
                            }
                            onClick={() =>
                                setPage(
                                    current =>
                                        Math.min(
                                            totalPages,
                                            current + 1,
                                        ),
                                )
                            }
                            className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>

                    </div>

                )
            }

        </div>

    );

}
