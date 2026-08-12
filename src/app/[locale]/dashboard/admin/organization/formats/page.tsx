import type {
    OrganizationSetting,
} from "@/types/admin/OrganizationSetting";



/**
 * ============================================================================
 * ADS CRM — ORGANIZATION ADMINISTRATION
 *
 * Currency & Formats Configuration
 *
 * Route:
 *
 * /[locale]/dashboard/admin/organization/formats
 *
 * Boundary:
 *
 * Customer Organization Administration
 *
 * Responsibilities:
 *
 * - Configure business display formats.
 * - Provide currency and numbering preferences.
 *
 * Does NOT:
 *
 * - Manage financial transactions.
 * - Modify accounting rules.
 * - Control platform defaults.
 *
 * ============================================================================
 */



const FORMAT_SETTINGS: OrganizationSetting[] = [

    {
        title:
            "Default Currency",

        description:
            "Configure the default currency used across organization records.",

        key:
            "currency",

    },


    {
        title:
            "Currency Display",

        description:
            "Configure currency symbols and display formatting.",

        key:
            "currency-display",

    },


    {
        title:
            "Number Formatting",

        description:
            "Configure decimal places, separators and numbering style.",

        key:
            "number-format",

    },


    {
        title:
            "Date & Time Display",

        description:
            "Configure organization date and time presentation format.",

        key:
            "datetime-format",

    },


];





function FormatCard({

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

                Configure

            </button>


        </div>

    );

}





export default function OrganizationFormatsPage() {


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

                    Currency & Formats

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

                    Configure currency,
                    numbering and display preferences
                    for this organization workspace.

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
                    FORMAT_SETTINGS.map(

                        setting => (

                            <FormatCard

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