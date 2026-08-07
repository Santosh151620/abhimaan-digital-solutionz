import {
    createClient,
} from "@/lib/supabase/server";


import {
    createContactsRepository,
} from "@/repositories/crm/ContactsRepository";


import type {
    Contact,
    ContactDetails,
    ContactSearchFilters,
    CreateContactInput,
    UpdateContactInput,
    ContactsSummary,
} from "@/types/crm/Contacts";



export class ContactsService {


    private async repository() {

        const supabase =
            await createClient();


        return createContactsRepository(
            supabase,
        );

    }



    async list(): Promise<Contact[]> {

        const repository =
            await this.repository();


        return repository.list();

    }



    async listArchived(): Promise<Contact[]> {

        const repository =
            await this.repository();


        return repository.listArchived();

    }



    async findById(
        id: string,
    ): Promise<Contact | null> {

        const repository =
            await this.repository();


        return repository.findById(
            this.requireId(id),
        );

    }



    async details(
        id: string,
    ): Promise<ContactDetails | null> {

        const repository =
            await this.repository();


        return repository.details(
            this.requireId(id),
        );

    }



    async get(
        id: string,
    ): Promise<Contact | null> {

        return this.findById(
            id,
        );

    }



    async search(
        filters?: ContactSearchFilters,
    ): Promise<Contact[]> {

        const repository =
            await this.repository();


        return repository.search(
            filters,
        );

    }



    async create(
        data: CreateContactInput,
    ): Promise<Contact> {

        if (!data) {
            throw new Error(
                "Contact data is required.",
            );
        }


        const firstName =
            data.firstName?.trim();


        if (!firstName) {
            throw new Error(
                "Contact first name is required.",
            );
        }


        const lastName =
            data.lastName?.trim();


        if (!lastName) {
            throw new Error(
                "Contact last name is required.",
            );
        }


        const repository =
            await this.repository();


        return repository.create({
            ...data,

            firstName,

            lastName,

            email:
                this.normalizeOptional(
                    data.email,
                ),

            phone:
                this.normalizeOptional(
                    data.phone,
                ),

            mobile:
                this.normalizeOptional(
                    data.mobile,
                ),

            designation:
                this.normalizeOptional(
                    data.designation,
                ),

            department:
                this.normalizeOptional(
                    data.department,
                ),

            city:
                this.normalizeOptional(
                    data.city,
                ),

            state:
                this.normalizeOptional(
                    data.state,
                ),

            country:
                this.normalizeOptional(
                    data.country,
                ),

            notes:
                this.normalizeOptional(
                    data.notes,
                ),
        });

    }



    async update(
        id: string,

        data: UpdateContactInput,

    ): Promise<Contact> {

        const normalizedId =
            this.requireId(id);


        if (!data) {
            throw new Error(
                "Contact update data is required.",
            );
        }


        const repository =
            await this.repository();


        return repository.update(

            normalizedId,

            this.normalizeUpdate(
                data,
            ),

        );

    }



    async delete(
        id: string,
    ): Promise<void> {

        const repository =
            await this.repository();


        await repository.delete(
            this.requireId(id),
        );

    }



    async restore(
        id: string,
    ): Promise<boolean> {

        const repository =
            await this.repository();


        return repository.restore(
            this.requireId(id),
        );

    }



    async summary(): Promise<ContactsSummary> {

        const repository =
            await this.repository();


        return repository.summary();

    }



    private requireId(
        id: string,
    ): string {

        const normalized =
            id?.trim();


        if (!normalized) {
            throw new Error(
                "Contact id is required.",
            );
        }


        return normalized;

    }



    private normalizeOptional(
        value?: string,
    ): string | undefined {

        const normalized =
            value?.trim();


        return normalized || undefined;

    }



    private normalizeUpdate(
        data: UpdateContactInput,
    ): UpdateContactInput {

        return {

            ...data,

            firstName:
                data.firstName !== undefined
                    ? this.normalizeOptional(
                        data.firstName,
                    )
                    : undefined,

            lastName:
                data.lastName !== undefined
                    ? this.normalizeOptional(
                        data.lastName,
                    )
                    : undefined,

            email:
                data.email !== undefined
                    ? this.normalizeOptional(
                        data.email,
                    )
                    : undefined,

            phone:
                data.phone !== undefined
                    ? this.normalizeOptional(
                        data.phone,
                    )
                    : undefined,

            mobile:
                data.mobile !== undefined
                    ? this.normalizeOptional(
                        data.mobile,
                    )
                    : undefined,

            designation:
                data.designation !== undefined
                    ? this.normalizeOptional(
                        data.designation,
                    )
                    : undefined,

            department:
                data.department !== undefined
                    ? this.normalizeOptional(
                        data.department,
                    )
                    : undefined,

            city:
                data.city !== undefined
                    ? this.normalizeOptional(
                        data.city,
                    )
                    : undefined,

            state:
                data.state !== undefined
                    ? this.normalizeOptional(
                        data.state,
                    )
                    : undefined,

            country:
                data.country !== undefined
                    ? this.normalizeOptional(
                        data.country,
                    )
                    : undefined,

            notes:
                data.notes !== undefined
                    ? this.normalizeOptional(
                        data.notes,
                    )
                    : undefined,
        };

    }

}



/**
 * Production factory
 */
export function createContactsService() {

    return new ContactsService();

}



/**
 * Application singleton
 *
 * Used by:
 * - Server components
 * - Actions
 * - API routes
 */
export const ContactsServiceInstance =
    new ContactsService();



/**
 * Legacy compatibility
 *
 * Existing imports continue working.
 */
export const contactsService =
    ContactsServiceInstance;