"use server";


import type {

    Branch,

} from "@/types/admin/Branch";



import {

    BranchesRepository,

} from "@/repositories/admin/BranchesRepository";





const repository =

    new BranchesRepository();







export async function getBranches(): Promise<Branch[]> {


    return await repository.findAll();


}







export async function saveBranch(


    branch: Partial<Branch>,


): Promise<Branch> {



    return await repository.save(


        branch,


    );


}







export async function deleteBranch(


    id:string,


): Promise<void> {



    await repository.delete(


        id,


    );


}