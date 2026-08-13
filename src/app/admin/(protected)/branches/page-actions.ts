"use server";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";


import type {
    Branch,
} from "@/types/admin/Branch";


import {
    BranchesRepository,
} from "@/repositories/admin/BranchesRepository";



async function getRepository(): Promise<BranchesRepository> {

    const supabase =
        await createSupabaseServerClient();


    return new BranchesRepository(
        supabase,
    );

}



export async function getBranches():

Promise<Branch[]> {


    const repository =
        await getRepository();


    return repository.findAll();

}




export async function saveBranch(

    branch:
        Partial<Branch>,

):

Promise<Branch> {


    const repository =
        await getRepository();


    return repository.save(
        branch,
    );

}




export async function deleteBranch(

    id: string,

):

Promise<void> {


    const repository =
        await getRepository();


    await repository.delete(
        id,
    );

}