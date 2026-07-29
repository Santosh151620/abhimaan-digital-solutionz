import { HealthDashboard } from "@/components/admin/health/HealthDashboard";


export const dynamic = "force-dynamic";


export default function HealthPage() {


    return (

        <main className="space-y-8 p-8">


            <section>

                <h1 className="text-3xl font-bold">
                    System Health
                </h1>


                <p className="text-muted-foreground">
                    Monitor platform availability and operational status.
                </p>


            </section>



            <HealthDashboard />


        </main>

    );

}
