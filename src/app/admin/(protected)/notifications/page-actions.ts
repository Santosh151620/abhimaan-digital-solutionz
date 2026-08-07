"use server";


import type {

    Notification,

} from "@/types/admin/Notification";



import {

    NotificationsRepository,

} from "@/repositories/admin/NotificationsRepository";





const repository =

    new NotificationsRepository();







export async function getNotifications():Promise<Notification[]> {



    return await repository.findAll();



}







export async function getUserNotifications(



    userId:string,



):Promise<Notification[]> {



    return await repository.findByUser(



        userId,



    );



}







export async function markNotificationAsRead(



    id:string,



):Promise<void>{



    await repository.markAsRead(



        id,



    );



}