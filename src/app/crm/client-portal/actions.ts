'use server';



import {
    ClientPortalServiceInstance,
} from '@/services/crm/ClientPortalService';



export async function createClientPortal(
    data:FormData
){


    return ClientPortalServiceInstance.create({

        name:
            String(
                data.get('name')
                ?? ''
            ),

    });

}
