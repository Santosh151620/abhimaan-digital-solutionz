"use server";


import type {

    Policy,

} from "@/types/admin/Policy";



import {

    PoliciesRepository,

} from "@/repositories/admin/PoliciesRepository";





const repository =

    new PoliciesRepository();







export async function getPolicies():Promise<Policy[]> {



    return await repository.findAll();



}







export async function savePolicy(



    policy:Partial<Policy>,



):Promise<Policy>{



    return await repository.save(



        policy,



    );



}







export async function deletePolicy(



    id:string,



):Promise<void>{



    await repository.delete(



        id,



    );



}