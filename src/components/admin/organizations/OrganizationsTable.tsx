"use client";

import type {
    Organization,
} from "@/types/admin/Organization";


interface OrganizationsTableProps {

    organizations: Organization[];

    onSelect?(
        organization: Organization
    ): void;

}



export default function OrganizationsTable({

    organizations,

    onSelect,

}: OrganizationsTableProps) {


    return (

        <div className="overflow-x-auto rounded-xl border">


            <table className="min-w-full">


                <thead className="border-b bg-muted/40">


                    <tr>


                        <th className="p-3 text-left">
                            Name
                        </th>


                        <th className="p-3 text-left">
                            Code
                        </th>


                        <th className="p-3 text-left">
                            Status
                        </th>


                        <th className="p-3 text-left">
                            Created
                        </th>


                    </tr>


                </thead>



                <tbody>


                    {
                        organizations.length === 0 && (

                            <tr>

                                <td
                                    colSpan={4}
                                    className="p-6 text-center text-muted-foreground"
                                >

                                    No organizations found.

                                </td>

                            </tr>

                        )
                    }



                    {
                        organizations.map(

                            organization => (

                                <tr

                                    key={organization.id}

                                    onClick={
                                        () =>
                                            onSelect?.(
                                                organization
                                            )
                                    }

                                    className="cursor-pointer border-b hover:bg-muted/30"

                                >


                                    <td className="p-3 font-medium">

                                        {organization.name}

                                    </td>



                                    <td className="p-3">

                                        {organization.code}

                                    </td>



                                    <td className="p-3">

                                        {organization.status}

                                    </td>



                                    <td className="p-3">

                                        {
                                            new Date(
                                                organization.createdAt
                                            ).toLocaleDateString()
                                        }

                                    </td>



                                </tr>

                            )

                        )
                    }


                </tbody>


            </table>


        </div>

    );

}
