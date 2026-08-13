"use client";

import type {
    AuditLog,
} from "@/types/admin/AuditLog";


interface AuditLogTableProps {

    items: AuditLog[];

}


function formatDate(
    value?: string,
): string {

    if (!value) {

        return "-";

    }


    const date =
        new Date(
            value,
        );


    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {

        return value;

    }


    return new Intl.DateTimeFormat(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short",
        },
    ).format(date);

}


function getActionClasses(
    action: AuditLog["action"],
): string {

    switch (action) {

        case "CREATE":

            return "bg-emerald-100 text-emerald-700";

        case "UPDATE":

            return "bg-blue-100 text-blue-700";

        case "DELETE":

            return "bg-red-100 text-red-700";

        case "LOGIN":

            return "bg-violet-100 text-violet-700";

        case "LOGOUT":

            return "bg-slate-100 text-slate-700";

        case "APPROVAL":

            return "bg-amber-100 text-amber-700";

        case "RESTORE":

            return "bg-cyan-100 text-cyan-700";

        default:

            return "bg-gray-100 text-gray-700";

    }

}


export default function AuditLogTable({

    items,

}: AuditLogTableProps) {


    if (
        items.length === 0
    ) {

        return (

            <div
                className="
                    rounded-xl
                    border
                    border-border
                    bg-background
                    p-8
                    text-center
                    text-sm
                    text-muted-foreground
                "
            >

                No audit logs found.

            </div>

        );

    }


    return (

        <div
            className="
                overflow-hidden
                rounded-xl
                border
                border-border
                bg-background
            "
        >

            <div className="overflow-x-auto">

                <table
                    className="
                        min-w-full
                        divide-y
                        divide-border
                    "
                >

                    <caption className="sr-only">

                        Audit log entries

                    </caption>


                    <thead
                        className="
                            bg-muted/50
                        "
                    >

                        <tr>

                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-muted-foreground
                                "
                            >

                                Action

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-muted-foreground
                                "
                            >

                                Entity

                            </th>


                            <th
                                scope="col"
                                className="
                                    min-w-[240px]
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-muted-foreground
                                "
                            >

                                Description

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-muted-foreground
                                "
                            >

                                User

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-muted-foreground
                                "
                            >

                                Date

                            </th>

                        </tr>

                    </thead>


                    <tbody
                        className="
                            divide-y
                            divide-border
                        "
                    >

                        {items.map(
                            (
                                log,
                            ) => (

                                <tr
                                    key={log.id}
                                    className="
                                        transition-colors
                                        hover:bg-muted/30
                                    "
                                >

                                    <td
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            py-3
                                        "
                                    >

                                        <span
                                            className={`
                                                inline-flex
                                                items-center
                                                rounded-full
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium
                                                ${getActionClasses(
                                                    log.action,
                                                )}
                                            `}
                                        >

                                            {log.action}

                                        </span>

                                    </td>


                                    <td
                                        className="
                                            px-4
                                            py-3
                                        "
                                    >

                                        <div
                                            className="
                                                font-medium
                                                text-foreground
                                            "
                                        >

                                            {log.entityType}

                                        </div>


                                        {log.entityId && (

                                            <div
                                                className="
                                                    mt-0.5
                                                    max-w-[220px]
                                                    truncate
                                                    text-xs
                                                    text-muted-foreground
                                                "
                                                title={
                                                    log.entityId
                                                }
                                            >

                                                {log.entityId}

                                            </div>

                                        )}

                                    </td>


                                    <td
                                        className="
                                            px-4
                                            py-3
                                            text-sm
                                            text-foreground
                                        "
                                    >

                                        {log.description ?? "-"}

                                    </td>


                                    <td
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            py-3
                                            text-sm
                                            text-foreground
                                        "
                                    >

                                        {log.userName ??
                                            log.userId ??
                                            "-"}

                                    </td>


                                    <td
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            py-3
                                            text-sm
                                            text-muted-foreground
                                        "
                                    >

                                        <time
                                            dateTime={
                                                log.createdAt
                                            }
                                        >

                                            {formatDate(
                                                log.createdAt,
                                            )}

                                        </time>

                                    </td>

                                </tr>

                            ),
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}