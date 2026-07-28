import { SettingsForm } from "@/components/admin/settings/SettingsForm";


export const dynamic = "force-dynamic";


export default function SettingsPage() {


    return (

        <main className="space-y-8 p-8">


            <section>

                <h1 className="text-3xl font-bold">
                    Platform Settings
                </h1>


                <p className="text-muted-foreground">
                    Manage administrative configuration.
                </p>


            </section>



            <SettingsForm />


        </main>

    );

}