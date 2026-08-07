import {

    getAuditLogs,

} from "./page-actions";



import AuditLogFilters from "@/components/admin/audit-logs/AuditLogFilters";



import AuditLogTable from "@/components/admin/audit-logs/AuditLogTable";







export default async function AuditLogsPage(){



    const auditLogs =

        await getAuditLogs();







    return (



        <div className="space-y-6">







            <div>







                <h1 className="text-3xl font-bold">



                    Audit Logs



                </h1>









                <p className="text-sm text-gray-500">



                    Review system activities, security events, and user actions.



                </p>







            </div>









            <AuditLogFilters />









            <AuditLogTable



                items={auditLogs}



            />







        </div>



    );



}