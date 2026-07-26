import {
    NextResponse,
} from 'next/server';


import {
    CompaniesServiceInstance,
} from '@/services/crm/CompaniesService';



export async function GET() {

    try {

        const companies =
            await CompaniesServiceInstance.list();


        return NextResponse.json(
            {
                data: companies,
            },
            {
                status: 200,
            }
        );


    } catch (error) {


        console.error(
            'Companies GET error:',
            error
        );


        return NextResponse.json(
            {
                error:
                    'Failed to load companies',
            },
            {
                status: 500,
            }
        );

    }

}





export async function POST(
    request: Request
) {


    try {


        const body =
            await request.json();



        if(
            !body?.name
            ||
            typeof body.name !== 'string'
        ){

            return NextResponse.json(
                {
                    error:
                        'Company name is required',
                },
                {
                    status: 400,
                }
            );

        }



        const company =
            await CompaniesServiceInstance.create(
                {
                    ...body,

                    entityType:
                        'Company',

                }
            );



        return NextResponse.json(
            {
                data: company,
            },
            {
                status: 201,
            }
        );



    } catch(error) {


        console.error(
            'Companies POST error:',
            error
        );



        return NextResponse.json(
            {
                error:
                    'Failed to create company',
            },
            {
                status: 500,
            }
        );

    }

}