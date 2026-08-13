"use server";


import type {
    Location,
} from "@/types/admin/Location";


import {
    LocationsRepository,
} from "@/repositories/admin/LocationsRepository";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";



async function getRepository():

Promise<LocationsRepository> {

    const supabase =
        await createSupabaseServerClient();


    return new LocationsRepository(
        supabase,
    );

}



export async function getLocations():

Promise<Location[]> {

    const repository =
        await getRepository();


    return repository.findAll();

}



export async function saveLocation(

    location:
        Partial<Location>,

):

Promise<Location> {

    const repository =
        await getRepository();


    return repository.save(

        location,

    );

}



export async function deleteLocation(

    id:
        string,

):

Promise<void> {

    const repository =
        await getRepository();


    await repository.delete(

        id,

    );

}