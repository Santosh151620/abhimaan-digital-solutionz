'use client';


import {
    useState,
} from 'react';


import {
    useRouter,
} from 'next/navigation';


import {
    createCompany,
} from './actions';


import {
    CompaniesDataTable,
} from '@/components/crm/companies';


import type {
    Company,
} from '@/types/crm/Companies';



interface Props {

    initialCompanies: Company[];

}



export default function CompaniesClient({

    initialCompanies,

}: Props) {


    const router =
        useRouter();



    const [
        name,
        setName,
    ] = useState('');



    const [
        isCreating,
        setIsCreating,
    ] = useState(false);



    const [
        createError,
        setCreateError,
    ] = useState<string | null>(null);





    async function handleCreate() {


        const companyName =
            name.trim();



        if (!companyName) {

            setCreateError(
                'Company name is required.',
            );

            return;

        }



        if (isCreating) {

            return;

        }



        try {


            setIsCreating(true);

            setCreateError(null);



            await createCompany({

                name:
                    companyName,

                status:
                    'ACTIVE',

            });



            setName('');

            router.refresh();



        } catch (error) {


            console.error(
                'Create company failed:',
                error,
            );



            setCreateError(

                error instanceof Error

                    ? error.message

                    : 'Unable to create company.',

            );


        } finally {


            setIsCreating(false);


        }

    }





    return (

        <div className="space-y-6">


            <section

                aria-label="Create company"

                className="crm-card p-5"

            >


                <div className="mb-4">


                    <h2 className="text-lg font-semibold">

                        Quick Add Company

                    </h2>



                    <p className="mt-1 text-sm text-muted-foreground">

                        Create a company directly from the
                        Companies workspace.

                    </p>


                </div>





                <div className="flex flex-col gap-3 md:flex-row">



                    <label

                        htmlFor="new-company-name"

                        className="sr-only"

                    >

                        Company name

                    </label>




                    <input


                        id="new-company-name"


                        value={name}


                        onChange={(event) => {


                            setName(
                                event.target.value,
                            );



                            if (createError) {

                                setCreateError(null);

                            }


                        }}



                        onKeyDown={(event) => {


                            if (event.key === 'Enter') {


                                event.preventDefault();


                                void handleCreate();


                            }


                        }}



                        placeholder="Company name"


                        autoComplete="organization"


                        disabled={isCreating}



                        className="
                            flex-1
                            rounded-lg
                            border
                            bg-background
                            px-3
                            py-2.5
                            text-sm
                            outline-none
                            transition
                            placeholder:text-muted-foreground
                            focus:border-primary
                            focus:ring-2
                            focus:ring-primary/20
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "


                    />





                    <button


                        type="button"


                        disabled={

                            isCreating ||

                            !name.trim()

                        }



                        onClick={() =>
                            void handleCreate()
                        }



                        className="
                            inline-flex
                            items-center
                            justify-center
                            rounded-lg
                            bg-primary
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-primary-foreground
                            transition
                            hover:opacity-90
                            focus:outline-none
                            focus:ring-2
                            focus:ring-primary/20
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "


                    >

                        {
                            isCreating

                                ? 'Creating...'

                                : 'Add Company'
                        }


                    </button>


                </div>





                {
                    createError && (


                        <p

                            role="alert"

                            className="mt-3 text-sm text-destructive"

                        >

                            {createError}


                        </p>


                    )
                }


            </section>





            <CompaniesDataTable

                initialCompanies={initialCompanies}

            />


        </div>

    );

}