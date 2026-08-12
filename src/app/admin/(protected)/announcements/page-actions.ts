"use server";


import type {

    Announcement,

} from "@/types/admin/Announcement";



import {

    AnnouncementsRepository,

} from "@/repositories/admin/AnnouncementsRepository";





const repository =

    new AnnouncementsRepository();







export async function getAnnouncements():Promise<Announcement[]> {



    return await repository.findAll();



}







async function getPublishedAnnouncements():Promise<Announcement[]> {



    return await repository.findPublished();



}