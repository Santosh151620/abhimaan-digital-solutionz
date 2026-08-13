"use server";


import type {
    Announcement,
} from "@/types/admin/Announcement";


import {
    AnnouncementsRepository,
} from "@/repositories/admin/AnnouncementsRepository";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";



async function getRepository():

Promise<AnnouncementsRepository> {

    const supabase =
        await createSupabaseServerClient();


    return new AnnouncementsRepository(
        supabase,
    );

}



export async function getAnnouncements():

Promise<Announcement[]> {

    const repository =
        await getRepository();


    return repository.findAll();

}



export async function getPublishedAnnouncements():

Promise<Announcement[]> {

    const repository =
        await getRepository();


    return repository.findPublished();

}