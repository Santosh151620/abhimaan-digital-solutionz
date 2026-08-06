"use client";


import {
    useEffect,
    useState,
} from "react";


import {
    useRouter,
} from "next/navigation";


import type {
    Role,
    RoleLevel,
    RoleStatus,
    RoleType,
} from "@/types/admin/Role";


import {
    createRole,
    updateRole,
} from "@/app/admin/(protected)/roles/actions";









interface RoleDialogProps {



    role?:Role;



    onClose:()=>void;



}









const defaultForm:Partial<Role> = {



    name:"",



    code:"",



    description:"",



    type:"Custom",



    level:"Organization",



    status:"Active",



    permissionIds:[],



    isSystem:false,



    isDefault:false,



    isActive:true,



};









export default function RoleDialog({



    role,



    onClose,



}:RoleDialogProps) {



    const router =

        useRouter();







    const [

        form,

        setForm,

    ] = useState<Partial<Role>>(

        defaultForm,

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



        setForm({



            ...defaultForm,



            ...role,



        });



    },[role]);









    function updateField<K extends keyof Role>(



        key:K,



        value:Role[K],



    ) {



        setForm(

            previous => ({



                ...previous,



                [key]:value,



            }),

        );



    }









    async function submit() {



        setError(null);







        if(!form.name?.trim()) {



            setError(

                "Role name is required."

            );



            return;



        }







        if(!form.code?.trim()) {



            setError(

                "Role code is required."

            );



            return;



        }







        try {



            setLoading(true);







            if(role) {



                await updateRole(

                    {

                        ...role,

                        ...form,

                    } as Role,

                );



            }

            else {



                await createRole(

                    form,

                );



            }







            router.refresh();



            onClose();



        }

        catch(error) {



            setError(



                error instanceof Error

                ? error.message

                : "Unable to save role."



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



                        {

                            role

                            ? "Edit Role"

                            : "Create Role"

                        }



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









                <input



                    className="

                        w-full

                        rounded-md

                        border

                        p-2

                    "



                    placeholder="Role Name"



                    value={form.name ?? ""}



                    onChange={event =>

                        updateField(

                            "name",

                            event.target.value,

                        )

                    }



                />









                <input



                    className="

                        w-full

                        rounded-md

                        border

                        p-2

                    "



                    placeholder="Role Code"



                    disabled={role?.isSystem}



                    value={form.code ?? ""}



                    onChange={event =>

                        updateField(

                            "code",

                            event.target.value,

                        )

                    }



                />









                <textarea



                    className="

                        w-full

                        rounded-md

                        border

                        p-2

                    "



                    placeholder="Description"



                    value={form.description ?? ""}



                    onChange={event =>

                        updateField(

                            "description",

                            event.target.value,

                        )

                    }



                />









                <select



                    className="

                        w-full

                        rounded-md

                        border

                        p-2

                    "



                    value={form.type ?? "Custom"}



                    disabled={role?.isSystem}



                    onChange={event =>

                        updateField(

                            "type",

                            event.target.value as RoleType,

                        )

                    }



                >



                    <option value="System">

                        System

                    </option>



                    <option value="Custom">

                        Custom

                    </option>



                </select>









                <select



                    className="

                        w-full

                        rounded-md

                        border

                        p-2

                    "



                    value={form.level ?? "Organization"}



                    onChange={event =>

                        updateField(

                            "level",

                            event.target.value as RoleLevel,

                        )

                    }



                >



                    <option value="Platform">

                        Platform

                    </option>



                    <option value="Organization">

                        Organization

                    </option>



                    <option value="Department">

                        Department

                    </option>



                    <option value="Team">

                        Team

                    </option>



                </select>









                <select



                    className="

                        w-full

                        rounded-md

                        border

                        p-2

                    "



                    value={form.status ?? "Active"}



                    onChange={event =>

                        updateField(

                            "status",

                            event.target.value as RoleStatus,

                        )

                    }



                >



                    <option value="Active">

                        Active

                    </option>



                    <option value="Inactive">

                        Inactive

                    </option>



                    <option value="Suspended">

                        Suspended

                    </option>



                </select>









                <div

                    className="

                        flex

                        justify-end

                        gap-3

                    "

                >



                    <button



                        type="button"



                        onClick={onClose}



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



                        onClick={submit}



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