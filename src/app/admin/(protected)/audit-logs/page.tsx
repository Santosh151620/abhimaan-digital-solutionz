import {
    getAuditLogs,
} from "./page-actions";


import AuditLogFilters
    from "@/components/admin/audit-logs/AuditLogFilters";


import AuditLogTable
    from "@/components/admin/audit-logs/AuditLogTable";


export default async function AuditLogsPage() {

    const auditLogs =
        await getAuditLogs();


    return (

        <div className="space-y-6">

            <div>

                <h1 className="
                    text-3xl
                    font-bold
                    tracking-tight
                    text-foreground
                ">

                    Audit Logs

                </h1>


                <p className="
                    mt-1
                    text-sm
                    text-muted-foreground
                ">

                    Review system activities,
                    security events,
                    and user actions.

                </p>

            </div>


            <AuditLogFilters />


            <AuditLogTable
                items={auditLogs}
            />

        </div>

    );

}