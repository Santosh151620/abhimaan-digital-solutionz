'use server';

import {
    ContactsServiceInstance,
} from '@/services/crm/ContactsService';

import type {
    ContactDetails,
} from '@/types/crm/Contacts';

export async function listContacts() {

    return ContactsServiceInstance.list();

}

export async function listArchivedContacts() {

    return ContactsServiceInstance.listArchived();

}

export async function getContact(
    id: string,
) {

    return ContactsServiceInstance.details(
        id,
    );

}

export async function createContact(
    data: Partial<ContactDetails>,
) {

    return ContactsServiceInstance.create(
        data,
    );

}

export async function updateContact(
    id: string,
    data: Partial<ContactDetails>,
) {

    return ContactsServiceInstance.update(
        id,
        data,
    );

}

export async function deleteContact(
    id: string,
) {

    return ContactsServiceInstance.delete(
        id,
    );

}

export async function restoreContact(
    id: string,
) {

    return ContactsServiceInstance.restore(
        id,
    );

}