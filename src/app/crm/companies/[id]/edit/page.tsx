import type {
    Company,
    UpdateCompanyInput,
} from '@/types/crm/Companies';


import {
    updateCompany,
} from '@/app/crm/companies/actions';


import {
    CompaniesForm,
} from '@/components/crm/companies/CompaniesForm';





interface Props {

    params: Promise<{

        id: string;

    }>;

}





export default async function EditCompanyPage(

    {
        params,
    }: Props

) {


    const {

        id,

    } = await params;





    async function submit(

        values: Partial<Company>

    ) {


        const payload: UpdateCompanyInput = {


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

                values.status,


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





        await updateCompany(

            id,

            payload

        );


    }





    return (

        <CompaniesForm

            onSubmit={submit}

        />

    );

}