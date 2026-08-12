'use server';

import {
    ContactsServiceInstance,
} from '@/services/crm/ContactsService';

import type {
    CreateContactInput,
    UpdateContactInput,
} from '@/types/crm/Contacts';



export async function listContacts() {

    return ContactsServiceInstance.list();

}



async function listArchivedContacts() {

    return ContactsServiceInstance.listArchived();

}



async function getContact(
    id: string,
) {

    return ContactsServiceInstance.details(
        id,
    );

}



export async function createContact(
    data: CreateContactInput,
) {

    return ContactsServiceInstance.create(
        data,
    );

}



export async function updateContact(
    id: string,
    data: UpdateContactInput,
) {

    return ContactsServiceInstance.update(
        id,
        data,
    );

}



async function deleteContact(
    id: string,
) {

    return ContactsServiceInstance.delete(
        id,
    );

}



async function restoreContact(
    id: string,
) {

    return ContactsServiceInstance.restore(
        id,
    );

}



export async function getContactsSummary() {

    return ContactsServiceInstance.summary();

}