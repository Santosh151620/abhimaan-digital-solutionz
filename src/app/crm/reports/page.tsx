import {
    ReportsClient,
} from '@/components/crm/reports';


export const metadata = {

    title:
        'CRM Reports',

};


export default function ReportsPage() {

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Reports
                </h1>

                <p className="text-sm text-muted-foreground">
                    CRM business reports and insights.
                </p>

            </div>


            <ReportsClient />

        </div>

    );

}