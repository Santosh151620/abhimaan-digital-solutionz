import {
    NextRequest,
    NextResponse,
} from "next/server";


import {
    getAuthContext,
} from "./auth-context.server";


import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";



export interface TenantGuardOptions {

    requireUser?: boolean;

    allowedRoles?: readonly string[];

}



const DEFAULT_OPTIONS: Required<TenantGuardOptions> = {

    requireUser: true,

    allowedRoles: [],

};



export function withTenantGuard(

    handler: (

        request: NextRequest,

        context: Readonly<any>

    ) => Promise<NextResponse>,

    options: TenantGuardOptions = {}

) {


    const config = {

        ...DEFAULT_OPTIONS,

        ...options,

    };



    return async (

        request: NextRequest

    ): Promise<NextResponse> => {


        try {


            const auth =
                await getAuthContext();



            if (

                config.requireUser &&

                !auth

            ) {

                return NextResponse.json(

                    {
                        success:false,
                        error:"Authentication required",
                    },

                    {
                        status:401,
                    }

                );

            }



            if (!auth) {


                return handler(

                    request,

                    {}

                );

            }



            if (

                config.allowedRoles.length > 0 &&

                !config.allowedRoles.includes(

                    auth.role

                )

            ) {


                return NextResponse.json(

                    {
                        success:false,
                        error:"Forbidden",
                    },

                    {
                        status:403,
                    }

                );

            }



            return TenantContextManager.run(

                {

                    organizationId:
                        auth.organizationId,


                    userId:
                        auth.userId,


                    userEmail:
                        auth.email,


                    role:
                        auth.role,


                },


                async () => {


                    return handler(

                        request,

                        TenantContextManager.require()

                    );


                }

            );



        } catch(error) {


            console.error(

                "[TenantGuard]",

                error

            );



            return NextResponse.json(

                {
                    success:false,
                    error:"Unauthorized",
                },

                {
                    status:401,
                }

            );


        }

    };


}