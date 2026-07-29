import { AuditTable } from "@/components/admin/audit/AuditTable";


export const dynamic = "force-dynamic";


export default function AuditPage() {


    return (

        <main className="space-y-8 p-8">


            <section>

                <h1 className="text-3xl font-bold">
                    Audit Logs
                </h1>


                <p className="text-muted-foreground">
                    Platform activity and compliance tracking.
                </p>


            </section>



            <AuditTable />


        </main>

    );

}
