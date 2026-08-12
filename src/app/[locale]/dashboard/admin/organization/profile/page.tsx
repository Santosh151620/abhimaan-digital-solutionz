import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

import {
    OrganizationsRepository,
} from "@/repositories/admin/OrganizationsRepository";


import {
    OrganizationsService,
} from "@/services/admin/OrganizationsService";


import type {
    Organization,
} from "@/types/admin/Organization";



/**
 * ============================================================================
 * ADS CRM â€” ORGANIZATION ADMINISTRATION
 *
 * Organization Profile
 *
 * Route:
 *
 * /[locale]/dashboard/admin/organization/profile
 *
 * Boundary:
 *
 * Customer Organization Administration
 *
 * Responsibilities:
 *
 * - Display organization identity.
 * - Manage organization profile configuration.
 *
 * Does NOT:
 *
 * - Manage ADS platform organizations.
 * - Manage authentication.
 * - Control global settings.
 *
 * ============================================================================
 */



async function getOrganization(
    supabase: SupabaseClient,
):
Promise<Organization | null> {


    const repository =
        new OrganizationsRepository(
            supabase,
        );



    const service =
        new OrganizationsService(

            repository,

        );



    const organizations =
        await service.list();



    return (

        organizations[0]
        ??
        null

    );


}




function ProfileItem({

    label,

    value,

}:{

    label:string;

    value?:string | null;

}) {


    return (

        <div
            className="
                rounded-xl
                border
                border-border
                p-4
            "
        >

            <p
                className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-muted-foreground
                "
            >

                {
                    label
                }

            </p>


            <p
                className="
                    mt-2
                    text-sm
                    font-medium
                    text-foreground
                "
            >

                {
                    value
                    ??
                    "-"
                }

            </p>


        </div>

    );

}




export default async function OrganizationProfilePage() {
    const supabase = await createClient();


  const organization =
    await getOrganization(
        supabase,
    );


    if (!organization) {


        return (

            <main
                className="
                    px-4
                    py-6
                    sm:px-6
                    lg:px-8
                "
            >

                <div
                    className="
                        rounded-xl
                        border
                        border-border
                        bg-background
                        p-8
                    "
                >

                    Organization profile not found.

                </div>


            </main>

        );

    }





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

                    Company Profile

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

                    Manage organization identity,
                    contact details and workspace information.

                </p>


            </header>





            <section
                className="
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    p-6
                    space-y-6
                "
            >


                <div
                    className="
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-semibold
                            "
                        >

                            Organization Details

                        </h2>


                        <p
                            className="
                                text-sm
                                text-muted-foreground
                            "
                        >

                            Current organization information.

                        </p>

                    </div>



                    <button
                        type="button"
                        className="
                            rounded-md
                            border
                            px-4
                            py-2
                            text-sm
                            hover:bg-muted
                        "
                    >

                        Edit Profile

                    </button>


                </div>





                <div
                    className="
                        grid
                        gap-4
                        md:grid-cols-2
                        xl:grid-cols-3
                    "
                >

                    <ProfileItem

                        label="Organization Name"

                        value={
                            organization.name
                        }

                    />



                    <ProfileItem

                        label="Code"

                        value={
                            organization.code
                        }

                    />



                    <ProfileItem

                        label="Legal Name"

                        value={
                            organization.legalName
                        }

                    />



                    <ProfileItem

                        label="Display Name"

                        value={
                            organization.displayName
                        }

                    />



                    <ProfileItem

                        label="Email"

                        value={
                            organization.email
                        }

                    />



                    <ProfileItem

                        label="Phone"

                        value={
                            organization.phone
                        }

                    />



                    <ProfileItem

                        label="Website"

                        value={
                            organization.website
                        }

                    />



                    <ProfileItem

                        label="City"

                        value={
                            organization.city
                        }

                    />



                    <ProfileItem

                        label="Country"

                        value={
                            organization.country
                        }

                    />


                </div>


            </section>


        </main>

    );

}

