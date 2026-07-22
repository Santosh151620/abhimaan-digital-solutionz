import { notFound } from 'next/navigation';


import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';


import EntityOverviewGrid from '@/components/entities/EntityOverviewGrid';
import EntityWorkspace from '@/components/entities/EntityWorkspace';


import {
    OpportunitiesServiceInstance,
} from '@/services/crm/OpportunitiesService';



interface Props {

    params: Promise<{
        id:string;
    }>;

}



export default async function OpportunityDetailsPage({

    params,

}:Props) {


    const {
        id,
    } = await params;



    const opportunity =

        await OpportunitiesServiceInstance.details(
            id
        );



    if (!opportunity) {

        notFound();

    }



    return (


        <CRMPageLayout>



            <CRMHeader

                title={opportunity.title}

                description="Opportunity details and sales workspace."

                actions={[
                    {
                        label:"Back",
                        href:"/crm/opportunities",
                    },

                    {
                        label:"Edit",
                        href:`/crm/opportunities/${opportunity.id}/edit`,
                    },
                ]}

            />




            <EntityWorkspace


                entityType="Opportunity"


                entityId={opportunity.id}



                overview={


                    <EntityOverviewGrid


                        items={[


                            {
                                title:"Stage",
                                value:opportunity.stage,
                            },


                            {
                                title:"Company",
                                value:opportunity.companyId,
                            },


                            {
                                title:"Value",
                                value:`₹ ${opportunity.value}`,
                            },


                            {
                                title:"Probability",
                                value:`${opportunity.probability}%`,
                            },


                            {
                                title:"Expected Close",
                                value:
                                    opportunity.expectedCloseDate
                                    ??
                                    "-",
                            },


                            {
                                title:"Owner",
                                value:
                                    opportunity.owner
                                    ??
                                    "-",
                            },


                            {
                                title:"Created",
                                value:
                                    new Date(
                                        opportunity.createdAt
                                    ).toLocaleDateString(),
                            },


                            {
                                title:"Updated",
                                value:
                                    new Date(
                                        opportunity.updatedAt
                                    ).toLocaleDateString(),
                            },


                        ]}


                    />


                }


            />



        </CRMPageLayout>


    );

}