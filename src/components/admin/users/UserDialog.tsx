"use client";


import {
    useEffect,
    useState,
} from "react";


import {
    useRouter,
} from "next/navigation";


import type {
    AdminUser,
    UserStatus,
    UserType,
} from "@/types/admin/User";


import {
    createUser,
    updateUser,
} from "@/app/admin/(protected)/users/actions";









interface UserDialogProps {



    user?:AdminUser;



    onClose:()=>void;



}









const defaultForm:Partial<AdminUser> = {



    fullName:"",



    email:"",



    userType:"Internal",



    status:"Pending",



    roleIds:[],



    isActive:false,



};









export default function UserDialog({



    user,



    onClose,



}:UserDialogProps) {



    const router =

        useRouter();







    const [

        form,

        setForm,

    ] = useState<Partial<AdminUser>>(

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



            ...user,



        });



    },[user]);









    function updateField<K extends keyof AdminUser>(



        key:K,



        value:AdminUser[K],



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







        if(!form.fullName?.trim()) {



            setError(

                "Full name is required."

            );



            return;



        }







        if(!form.email?.trim()) {



            setError(

                "Email is required."

            );



            return;



        }







        try {



            setLoading(true);







            const now =

                new Date()

                .toISOString();







            const payload:AdminUser = {



                id:

                    user?.id ??

                    crypto.randomUUID(),





                organizationId:

                    user?.organizationId ?? "",





                profileId:

                    form.profileId,





                authUserId:

                    form.authUserId,





                fullName:

                    form.fullName.trim(),





                firstName:

                    form.firstName,





                lastName:

                    form.lastName,





                displayName:

                    form.displayName,





                email:

                    form.email.trim().toLowerCase(),





                phone:

                    form.phone,





                avatarUrl:

                    form.avatarUrl,





                jobTitle:

                    form.jobTitle,





                department:

                    form.department,





                employeeCode:

                    form.employeeCode,





                userType:

                    form.userType as UserType,





                status:

                    form.status as UserStatus,





                roleIds:

                    form.roleIds ?? [],





                primaryRoleId:

                    form.primaryRoleId,





                isActive:

                    form.status === "Active",





                emailVerified:

                    form.emailVerified ?? false,





                phoneVerified:

                    form.phoneVerified ?? false,





                lastLoginAt:

                    form.lastLoginAt,





                lastActivityAt:

                    form.lastActivityAt,





                passwordChangedAt:

                    form.passwordChangedAt,





                failedLoginAttempts:

                    form.failedLoginAttempts ?? 0,





                lockedUntil:

                    form.lockedUntil,





                locale:

                    form.locale,





                timezone:

                    form.timezone,





                metadata:

                    form.metadata ?? {},





                createdBy:

                    user?.createdBy,





                updatedBy:

                    user?.updatedBy,





                createdAt:

                    user?.createdAt ?? now,





                updatedAt:

                    now,



            };







            if(user) {



                await updateUser(

                    payload,

                );



            }

            else {



                await createUser(

                    payload,

                );



            }







            router.refresh();



            onClose();



        }

        catch(error) {



            setError(



                error instanceof Error

                ? error.message

                : "Unable to save user."



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



                <h2

                    className="

                        text-xl

                        font-semibold

                    "

                >



                    {

                        user

                        ? "Edit User"

                        : "Create User"

                    }



                </h2>









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



                    placeholder="Full Name"



                    value={form.fullName ?? ""}



                    onChange={event =>

                        updateField(

                            "fullName",

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



                    placeholder="Email"



                    type="email"



                    value={form.email ?? ""}



                    onChange={event =>

                        updateField(

                            "email",

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



                    value={form.userType ?? "Internal"}



                    onChange={event =>

                        updateField(

                            "userType",

                            event.target.value as UserType,

                        )

                    }



                >



                    <option value="Internal">

                        Internal

                    </option>



                    <option value="External">

                        External

                    </option>



                    <option value="System">

                        System

                    </option>



                    <option value="Service">

                        Service

                    </option>



                </select>









                <select



                    className="

                        w-full

                        rounded-md

                        border

                        p-2

                    "



                    value={form.status ?? "Pending"}



                    onChange={event =>

                        updateField(

                            "status",

                            event.target.value as UserStatus,

                        )

                    }



                >



                    <option value="Pending">

                        Pending

                    </option>



                    <option value="Active">

                        Active

                    </option>



                    <option value="Inactive">

                        Inactive

                    </option>



                    <option value="Suspended">

                        Suspended

                    </option>



                    <option value="Locked">

                        Locked

                    </option>



                    <option value="Archived">

                        Archived

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