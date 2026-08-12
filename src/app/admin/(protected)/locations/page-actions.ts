"use server";


import type {
    Location,
} from "@/types/admin/Location";


import {
    LocationsRepository,
} from "@/repositories/admin/LocationsRepository";



const repository =

    new LocationsRepository();





export async function getLocations(): Promise<Location[]> {


    return await repository.findAll();


}





export async function saveLocation(

    location: Partial<Location>,

): Promise<Location> {



    return await repository.save(

        location,

    );


}





async function deleteLocation(

    id:string,

): Promise<void> {



    await repository.delete(

        id,

    );


}