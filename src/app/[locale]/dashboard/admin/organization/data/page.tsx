import type {
    OrganizationSetting,
} from "@/types/admin/OrganizationSetting";



/**
 * ============================================================================
 * ADS CRM — ORGANIZATION ADMINISTRATION
 *
 * Data Management
 *
 * Route:
 *
 * /[locale]/dashboard/admin/organization/data
 *
 * Boundary:
 *
 * Customer Organization Administration
 *
 * Responsibilities:
 *
 * - Provide organization data governance entry point.
 * - Configure data management capabilities.
 *
 * Does NOT:
 *
 * - Directly execute imports or exports.
 * - Modify database policies.
 * - Control platform retention.
 *
 * ============================================================================
 */



const DATA_SETTINGS: OrganizationSetting[] = [

    {
        title:
            "Import Data",

        description:
            "Manage organization data imports and migration workflows.",

        key:
            "import",

    },


    {
        title:
            "Export Data",

        description:
            "Export organization records and operational information.",

        key:
            "export",

    },


    {
        title:
            "Data Retention",

        description:
            "Configure organization data retention preferences.",

        key:
            "retention",

    },


    {
        title:
            "Archive Management",

        description:
            "Manage archived records and historical data access.",

        key:
            "archive",

    },


];





function DataManagementCard({

    setting,

}:{

    setting:OrganizationSetting;

}) {


    return (

        <div
            className="
                rounded-xl
                border
                border-border
                bg-background
                p-5
            "
        >

            <h2
                className="
                    font-semibold
                    text-foreground
                "
            >

                {
                    setting.title
                }

            </h2>



            <p
                className="
                    mt-2
                    text-sm
                    leading-6
                    text-muted-foreground
                "
            >

                {
                    setting.description
                }

            </p>



            <button
                type="button"
                className="
                    mt-4
                    rounded-md
                    border
                    px-4
                    py-2
                    text-sm
                    hover:bg-muted
                "
            >

                Manage

            </button>


        </div>

    );

}





export default function OrganizationDataPage() {


    return (

        <main
            className="
                min-w-0
                space-y-8
                px-4
                py-6
                sm:px-6
                lg:px-8
            "
        >


            <header
                className="
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    p-6
                "
            >

                <p
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-primary
                    "
                >

                    Organization Administration

                </p>



                <h1
                    className="
                        mt-2
                        text-3xl
                        font-bold
                        text-foreground
                    "
                >

                    Data Management

                </h1>



                <p
                    className="
                        mt-3
                        max-w-3xl
                        text-sm
                        leading-6
                        text-muted-foreground
                    "
                >

                    Manage organization data lifecycle,
                    imports, exports, retention and archive policies.

                </p>


            </header>





            <section
                className="
                    grid
                    gap-5
                    md:grid-cols-2
                "
            >

                {
                    DATA_SETTINGS.map(

                        setting => (

                            <DataManagementCard

                                key={
                                    setting.key
                                }

                                setting={
                                    setting
                                }

                            />

                        ),

                    )
                }


            </section>


        </main>

    );

}