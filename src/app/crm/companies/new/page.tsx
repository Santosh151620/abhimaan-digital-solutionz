import type {
    Company,
    CreateCompanyInput,
} from '@/types/crm/Companies';


import {
    createCompany,
} from '@/app/crm/companies/actions';


import {
    CompaniesForm,
} from '@/components/crm/companies/CompaniesForm';





export default function NewCompanyPage() {


    async function submit(

        values: Partial<Company>

    ) {


        const payload: CreateCompanyInput = {


            name:

                values.name
                ??
                '',


            legalName:

                values.legalName,


            industry:

                values.industry,


            website:

                values.website,


            phone:

                values.phone,


            email:

                values.email,


            status:

                values.status
                ??
                'ACTIVE',


            address:

                values.address,


            city:

                values.city,


            state:

                values.state,


            country:

                values.country,


            postalCode:

                values.postalCode,


            employees:

                values.employees,


            annualRevenue:

                values.annualRevenue,


            taxId:

                values.taxId,


            description:

                values.description,


        };





        await createCompany(

            payload

        );


    }





    return (

        <CompaniesForm

            onSubmit={submit}

        />

    );

}