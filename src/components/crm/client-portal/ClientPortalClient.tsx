'use client';


import ClientPortalTable
from './ClientPortalTable';



import type {
    ClientPortal,
} from '@/types/crm/ClientPortal';



export default function ClientPortalClient({
    portals,
}:{
    portals:ClientPortal[];
}){


    return (

        <ClientPortalTable
            portals={portals}
        />

    );

}
