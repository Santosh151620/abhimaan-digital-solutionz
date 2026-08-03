"use client";


import {
    useState,
} from "react";


import type {
    AdminUser,
} from "@/types/admin/User";


import {
    createUser,
    updateUser,
} from "@/app/admin/(protected)/users/actions";



interface Props {

    user?: AdminUser;

    onClose:()=>void;

}



export default function UserDialog({

    user,

    onClose,

}:Props){


    const [loading,setLoading]=
        useState(false);



    const [form,setForm]=
        useState<Partial<AdminUser>>({

            fullName:
                user?.fullName ?? "",

            email:
                user?.email ?? "",

            userType:
                user?.userType ?? "Internal",

            status:
                user?.status ?? "Pending",

        });



    async function submit(){

        setLoading(true);


        try{


            if(user){

                await updateUser({

                    ...user,

                    ...form,

                } as AdminUser);


            }
            else{


                await createUser(
                    form
                );


            }


            onClose();


        }
        finally{

            setLoading(false);

        }

    }



    return (

        <div className="
            fixed inset-0
            flex items-center justify-center
            bg-black/40
        ">


            <div className="
                w-full max-w-lg
                rounded-xl
                bg-background
                p-6
                space-y-4
            ">


                <h2 className="text-xl font-bold">

                    {user
                    ? "Edit User"
                    : "Create User"}

                </h2>



                <input

                    className="w-full rounded border p-2"

                    placeholder="Full Name"

                    value={
                        form.fullName ?? ""
                    }

                    onChange={
                        e =>
                        setForm({

                            ...form,

                            fullName:
                            e.target.value

                        })
                    }

                />



                <input

                    className="w-full rounded border p-2"

                    placeholder="Email"

                    value={
                        form.email ?? ""
                    }

                    onChange={
                        e =>
                        setForm({

                            ...form,

                            email:
                            e.target.value

                        })
                    }

                />



                <select

                    className="w-full rounded border p-2"

                    value={
                        form.status
                    }

                    onChange={
                        e =>
                        setForm({

                            ...form,

                            status:
                            e.target.value as AdminUser["status"]

                        })
                    }

                >

                    <option>
                        Pending
                    </option>

                    <option>
                        Active
                    </option>

                    <option>
                        Inactive
                    </option>

                </select>



                <div className="flex justify-end gap-3">


                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded"
                    >
                        Cancel
                    </button>



                    <button

                        disabled={loading}

                        onClick={submit}

                        className="
                        rounded
                        bg-primary
                        px-4 py-2
                        text-primary-foreground
                        "

                    >

                        {loading
                        ?"Saving..."
                        :"Save"}

                    </button>


                </div>



            </div>


        </div>

    );

}