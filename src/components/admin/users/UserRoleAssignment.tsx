"use client";


import {
    useEffect,
    useState,
} from "react";


import {
    assignRole,
    removeRole,
    replaceRoles,
    setPrimaryRole,
} from "@/app/admin/(protected)/users/UserActions";


import type {
    Role,
} from "@/types/admin/Role";







interface UserRoleAssignmentProps {



    userId:string;



    roles:Role[];





    selectedRoleIds:string[];





    primaryRoleId?:string;





    onSaved:()=>void;



}









export default function UserRoleAssignment({



    userId,



    roles,



    selectedRoleIds,



    primaryRoleId,



    onSaved,



}:UserRoleAssignmentProps) {



    const [

        selected,

        setSelected,

    ] = useState<string[]>(

        selectedRoleIds,

    );







    const [

        primary,

        setPrimary,

    ] = useState<string | undefined>(

        primaryRoleId,

    );







    const [

        loading,

        setLoading,

    ] = useState(false);







    const [

        error,

        setError,

    ] = useState<string | null>(null);









    useEffect(() => {



        setSelected(

            selectedRoleIds,

        );



        setPrimary(

            primaryRoleId,

        );



    },[

        selectedRoleIds,

        primaryRoleId,

    ]);









    function toggleRole(

        roleId:string,

    ) {



        setSelected(

            previous =>



                previous.includes(roleId)

                ? previous.filter(

                    id => id !== roleId,

                )

                : [

                    ...previous,

                    roleId,

                ],

        );



    }









    async function save() {



        try {



            setLoading(true);



            setError(null);







            await replaceRoles(

                userId,

                selected,

            );







            if(primary) {



                await setPrimaryRole(

                    userId,

                    primary,

                );



            }







            onSaved();



        }

        catch(error) {



            setError(



                error instanceof Error

                ? error.message

                : "Unable to update roles."



            );



        }

        finally {



            setLoading(false);



        }



    }









    return (



        <div

            className="

                fixed

                inset-0

                z-50

                flex

                items-center

                justify-center

                bg-black/40

                p-4

            "

        >



            <div

                className="

                    w-full

                    max-w-xl

                    rounded-xl

                    bg-background

                    p-6

                    space-y-5

                    shadow-xl

                "

            >



                <div>



                    <h2

                        className="

                            text-xl

                            font-semibold

                        "

                    >



                        Assign Roles



                    </h2>



                </div>









                {

                    error && (



                        <div

                            className="

                                rounded-md

                                border

                                border-destructive

                                p-3

                                text-destructive

                            "

                        >



                            {error}



                        </div>



                    )

                }









                <div

                    className="

                        space-y-3

                    "

                >



                    {

                        roles.map(

                            role => (



                                <label

                                    key={role.id}

                                    className="

                                        flex

                                        items-center

                                        justify-between

                                        rounded-md

                                        border

                                        p-3

                                    "

                                >



                                    <div

                                        className="

                                            flex

                                            gap-3

                                            items-center

                                        "

                                    >



                                        <input



                                            type="checkbox"



                                            checked={

                                                selected.includes(

                                                    role.id,

                                                )

                                            }



                                            onChange={() =>

                                                toggleRole(

                                                    role.id,

                                                )

                                            }



                                        />





                                        <span>



                                            {role.name}



                                        </span>



                                    </div>









                                    <button



                                        type="button"



                                        onClick={() =>

                                            setPrimary(

                                                role.id,

                                            )

                                        }



                                        className="

                                            rounded-md

                                            border

                                            px-2

                                            py-1

                                            text-xs

                                        "



                                    >



                                        {

                                            primary === role.id

                                            ? "Primary"

                                            : "Make Primary"

                                        }



                                    </button>



                                </label>



                            )

                        )

                    }



                </div>









                <div

                    className="

                        flex

                        justify-end

                        gap-3

                    "

                >



                    <button



                        type="button"



                        onClick={onSaved}



                        disabled={loading}



                        className="

                            rounded-md

                            border

                            px-4

                            py-2

                        "



                    >



                        Cancel



                    </button>









                    <button



                        type="button"



                        onClick={save}



                        disabled={loading}



                        className="

                            rounded-md

                            bg-primary

                            px-4

                            py-2

                            text-primary-foreground

                        "



                    >



                        {

                            loading

                            ? "Saving..."

                            : "Save"

                        }



                    </button>



                </div>



            </div>



        </div>



    );



}