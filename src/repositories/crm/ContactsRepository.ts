import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import type {
    Contact,
    ContactDetails,
    ContactSearchFilters,
    ContactsSummary,
    CreateContactInput,
    UpdateContactInput,
} from "@/types/crm/Contacts";




/**
 * Database representation of the contacts table.
 *
 * This deliberately remains separate from the domain Contact contract.
 */
type ContactRow = {

    id: string;

    organization_id: string | null;

    entity_type: string | null;

    entity_id: string | null;

    company_id: string | null;

    contact_code?: string | null;

    first_name: string | null;

    middle_name?: string | null;

    last_name: string | null;

    display_name?: string | null;

    full_name: string | null;

    job_title?: string | null;

    department: string | null;

    email: string | null;

    phone: string | null;

    mobile: string | null;

    whatsapp?: string | null;

    linkedin_url?: string | null;

    date_of_birth?: string | null;

    anniversary?: string | null;

    designation?: string | null;

    status: string;

    owner_id: string | null;

    assigned_to: string | null;

    address?: string | null;

    city: string | null;

    state: string | null;

    country: string | null;

    postal_code?: string | null;

    notes: string | null;

    metadata: Record<string, unknown> | null;

    is_deleted: boolean | null;

    is_active?: boolean | null;

    deleted_at: string | null;

    deleted_by: string | null;

    created_by?: string | null;

    updated_by?: string | null;

    created_at: string;

    updated_at: string;

    version?: number | null;

};




export class ContactsRepository
    extends BaseRepository<Contact> {


    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "contacts",
        );

    }




    /**
     * List active/non-archived contacts.
     *
     * Tenant isolation is always applied.
     */
    async list(): Promise<Contact[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "is_deleted",
                    false,
                )
                .neq(
                    "status",
                    "ARCHIVED",
                )
                .order(
                    "created_at",
                    {
                        ascending: false,
                    },
                );


        if (error) {
            throw error;
        }


        return (data ?? [])
            .map(
                row =>
                    this.mapContact(
                        row as ContactRow,
                    ),
            );

    }




    /**
     * List archived/deleted contacts.
     */
    async listArchived(): Promise<Contact[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .or(
                    "is_deleted.eq.true,status.eq.ARCHIVED",
                )
                .order(
                    "created_at",
                    {
                        ascending: false,
                    },
                );


        if (error) {
            throw error;
        }


        return (data ?? [])
            .map(
                row =>
                    this.mapContact(
                        row as ContactRow,
                    ),
            );

    }




    /**
     * Find one contact inside the current tenant.
     */
    async findById(
        id: string,
    ): Promise<Contact | null> {

        const normalizedId =
            this.requireId(
                id,
                "Contact id",
            );


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    normalizedId,
                )
                .maybeSingle();


        if (error) {
            throw error;
        }


        return data
            ? this.mapContact(
                data as ContactRow,
            )
            : null;

    }




    /**
     * Contact detail projection.
     *
     * Kept separate so related CRM information can be
     * extended later without changing findById().
     */
    async details(
        id: string,
    ): Promise<ContactDetails | null> {

        const contact =
            await this.findById(
                id,
            );


        if (!contact) {
            return null;
        }


        return {
            ...contact,
        };

    }




    /**
     * Create contact.
     *
     * Parameter intentionally uses Partial<Contact> so it remains
     * compatible with BaseRepository<Contact>.create().
     *
     * Required fields are validated at runtime.
     */
    async create(
        data: Partial<Contact>,
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


        const id =
            data.entityId?.trim()
            ||
            data.id?.trim()
            ||
            crypto.randomUUID();


        const now =
            new Date()
                .toISOString();


        const createInput =
            data as CreateContactInput;


        const {
            data: created,
            error,
        } =
            await this.tableRef()
                .insert(
                    this.withCreateTenant({

                        id,

                        entity_type:
                            "Contact",

                        entity_id:
                            id,

                        company_id:
                            createInput.companyId
                            ?? null,

                        first_name:
                            firstName,

                        last_name:
                            lastName,

                        full_name:
                            `${firstName} ${lastName}`
                                .trim(),

                        email:
                            this.normalizeOptional(
                                createInput.email,
                            ),

                        phone:
                            this.normalizeOptional(
                                createInput.phone,
                            ),

                        mobile:
                            this.normalizeOptional(
                                createInput.mobile,
                            ),

                        designation:
                            this.normalizeOptional(
                                createInput.designation,
                            ),

                        department:
                            this.normalizeOptional(
                                createInput.department,
                            ),

                        status:
                            createInput.status
                            ?? "ACTIVE",

                        owner_id:
                            createInput.ownerId
                            ?? null,

                        assigned_to:
                            createInput.assignedTo
                            ?? null,

                        city:
                            this.normalizeOptional(
                                createInput.city,
                            ),

                        state:
                            this.normalizeOptional(
                                createInput.state,
                            ),

                        country:
                            this.normalizeOptional(
                                createInput.country,
                            ),

                        notes:
                            this.normalizeOptional(
                                createInput.notes,
                            ),

                        metadata:
                            createInput.metadata
                            ?? {},

                        is_deleted:
                            false,

                        deleted_at:
                            null,

                        deleted_by:
                            null,

                        created_at:
                            now,

                        updated_at:
                            now,

                    }),
                )
                .select("*")
                .single();


        if (error) {
            throw error;
        }


        return this.mapContact(
            created as ContactRow,
        );

    }




    /**
     * Update contact.
     *
     * Every update is constrained by organization_id and id.
     */
    async update(
        id: string,
        data: UpdateContactInput,
    ): Promise<Contact> {

        const normalizedId =
            this.requireId(
                id,
                "Contact id",
            );


        if (!data) {
            throw new Error(
                "Contact update data is required.",
            );
        }


        const payload: Record<
            string,
            unknown
        > = {

            updated_at:
                new Date()
                    .toISOString(),

        };




        if (
            data.firstName !== undefined
        ) {

            const value =
                data.firstName.trim();


            if (!value) {
                throw new Error(
                    "Contact first name cannot be empty.",
                );
            }


            payload.first_name =
                value;

        }




        if (
            data.lastName !== undefined
        ) {

            const value =
                data.lastName.trim();


            if (!value) {
                throw new Error(
                    "Contact last name cannot be empty.",
                );
            }


            payload.last_name =
                value;

        }




        if (
            data.firstName !== undefined
            ||
            data.lastName !== undefined
        ) {

            const existing =
                await this.findById(
                    normalizedId,
                );


            if (!existing) {
                throw new Error(
                    "Contact not found.",
                );
            }


            const firstName =
                data.firstName?.trim()
                ??
                existing.firstName;


            const lastName =
                data.lastName?.trim()
                ??
                existing.lastName;


            payload.full_name =
                `${firstName} ${lastName}`
                    .trim();

        }




        if (
            data.companyId !== undefined
        ) {

            payload.company_id =
                data.companyId
                ?? null;

        }




        if (
            data.email !== undefined
        ) {

            payload.email =
                this.normalizeOptional(
                    data.email,
                );

        }




        if (
            data.phone !== undefined
        ) {

            payload.phone =
                this.normalizeOptional(
                    data.phone,
                );

        }




        if (
            data.mobile !== undefined
        ) {

            payload.mobile =
                this.normalizeOptional(
                    data.mobile,
                );

        }




        if (
            data.designation !== undefined
        ) {

            payload.designation =
                this.normalizeOptional(
                    data.designation,
                );

        }




        if (
            data.department !== undefined
        ) {

            payload.department =
                this.normalizeOptional(
                    data.department,
                );

        }




        if (
            data.status !== undefined
        ) {

            payload.status =
                data.status;

        }




        if (
            data.ownerId !== undefined
        ) {

            payload.owner_id =
                data.ownerId
                ?? null;

        }




        if (
            data.assignedTo !== undefined
        ) {

            payload.assigned_to =
                data.assignedTo
                ?? null;

        }




        if (
            data.city !== undefined
        ) {

            payload.city =
                this.normalizeOptional(
                    data.city,
                );

        }




        if (
            data.state !== undefined
        ) {

            payload.state =
                this.normalizeOptional(
                    data.state,
                );

        }




        if (
            data.country !== undefined
        ) {

            payload.country =
                this.normalizeOptional(
                    data.country,
                );

        }




        if (
            data.notes !== undefined
        ) {

            payload.notes =
                this.normalizeOptional(
                    data.notes,
                );

        }




        if (
            data.metadata !== undefined
        ) {

            payload.metadata =
                data.metadata;

        }




        if (
            data.isDeleted !== undefined
        ) {

            payload.is_deleted =
                data.isDeleted;

        }




        if (
            data.deletedAt !== undefined
        ) {

            payload.deleted_at =
                data.deletedAt
                ?? null;

        }




        if (
            data.deletedBy !== undefined
        ) {

            payload.deleted_by =
                data.deletedBy
                ?? null;

        }




        if (
            data.isActive !== undefined
        ) {

            payload.is_active =
                data.isActive;

        }




        const {
            data: updated,
            error,
        } =
            await this.tableRef()
                .update(
                    payload,
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    normalizedId,
                )
                .select("*")
                .single();


        if (error) {
            throw error;
        }


        return this.mapContact(
            updated as ContactRow,
        );

    }




    /**
     * Soft delete.
     */
    async delete(
        id: string,
    ): Promise<void> {

        await this.update(
            id,
            {

                status:
                    "ARCHIVED",

                isDeleted:
                    true,

                deletedAt:
                    new Date()
                        .toISOString(),

            },
        );

    }




    /**
     * Restore an archived contact.
     */
    async restore(
        id: string,
    ): Promise<boolean> {

        const existing =
            await this.findById(
                id,
            );


        if (!existing) {
            return false;
        }


        await this.update(
            id,
            {

                status:
                    "ACTIVE",

                isDeleted:
                    false,

                deletedAt:
                    null,

                deletedBy:
                    null,

            },
        );


        return true;

    }




    /**
     * Search contacts using tenant-safe filters.
     */
    async search(
        filters?: ContactSearchFilters,
    ): Promise<Contact[]> {

        let query =
            this.tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                );




        if (
            !filters?.includeArchived
        ) {

            query =
                query
                    .eq(
                        "is_deleted",
                        false,
                    )
                    .neq(
                        "status",
                        "ARCHIVED",
                    );

        }




        if (
            filters?.status
        ) {

            query =
                query.eq(
                    "status",
                    filters.status,
                );

        }




        if (
            filters?.companyId
        ) {

            query =
                query.eq(
                    "company_id",
                    filters.companyId,
                );

        }




        if (
            filters?.ownerId
        ) {

            query =
                query.eq(
                    "owner_id",
                    filters.ownerId,
                );

        }




        if (
            filters?.assignedTo
        ) {

            query =
                query.eq(
                    "assigned_to",
                    filters.assignedTo,
                );

        }




        const keyword =
            filters?.search?.trim();


        if (keyword) {

            const escaped =
                this.escapeIlike(
                    keyword,
                );


            query =
                query.or(
                    [
                        `first_name.ilike.%${escaped}%`,
                        `last_name.ilike.%${escaped}%`,
                        `full_name.ilike.%${escaped}%`,
                        `email.ilike.%${escaped}%`,
                        `phone.ilike.%${escaped}%`,
                        `mobile.ilike.%${escaped}%`,
                    ].join(","),
                );

        }




        const {
            data,
            error,
        } =
            await query.order(
                "created_at",
                {
                    ascending: false,
                },
            );


        if (error) {
            throw error;
        }


        return (data ?? [])
            .map(
                row =>
                    this.mapContact(
                        row as ContactRow,
                    ),
            );

    }




    /**
     * Dashboard summary.
     *
     * Calculated from tenant-scoped rows.
     */
    async summary(): Promise<ContactsSummary> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select(
                    "status,is_deleted",
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                );


        if (error) {
            throw error;
        }


        const rows =
            (data ?? []) as Array<{
                status: string;
                is_deleted: boolean | null;
            }>;


        return {

            total:
                rows.filter(
                    row =>
                        !row.is_deleted
                        &&
                        row.status !== "ARCHIVED",
                ).length,


            active:
                rows.filter(
                    row =>
                        !row.is_deleted
                        &&
                        row.status === "ACTIVE",
                ).length,


            inactive:
                rows.filter(
                    row =>
                        !row.is_deleted
                        &&
                        row.status === "INACTIVE",
                ).length,


            leads:
                rows.filter(
                    row =>
                        !row.is_deleted
                        &&
                        row.status === "LEAD",
                ).length,


            customers:
                rows.filter(
                    row =>
                        !row.is_deleted
                        &&
                        row.status === "CUSTOMER",
                ).length,


            archived:
                rows.filter(
                    row =>
                        row.is_deleted
                        ||
                        row.status === "ARCHIVED",
                ).length,

        };

    }




    /**
     * Convert database representation to CRM domain representation.
     */
    private mapContact(
        row: ContactRow,
    ): Contact {

        const firstName =
            row.first_name
            ?? "";


        const lastName =
            row.last_name
            ?? "";


        return {

            id:
                row.id,


            entityType:
                "Contact",


            entityId:
                row.entity_id
                ?? row.id,


            organizationId:
                row.organization_id
                ?? undefined,


            companyId:
                row.company_id
                ?? undefined,


            contactCode:
                row.contact_code
                ?? undefined,


            firstName,


            middleName:
                row.middle_name
                ?? undefined,


            lastName,


            fullName:
                row.full_name
                ??
                row.display_name
                ??
                `${firstName} ${lastName}`
                    .trim(),


            displayName:
                row.display_name
                ?? undefined,


            jobTitle:
                row.job_title
                ?? undefined,


            designation:
                row.designation
                ?? undefined,


            department:
                row.department
                ?? undefined,


            email:
                row.email
                ?? undefined,


            phone:
                row.phone
                ?? undefined,


            mobile:
                row.mobile
                ?? undefined,


            whatsapp:
                row.whatsapp
                ?? undefined,


            linkedinUrl:
                row.linkedin_url
                ?? undefined,


            dateOfBirth:
                row.date_of_birth
                ?? null,


            anniversary:
                row.anniversary
                ?? null,


            status:
                row.status as Contact["status"],


            isActive:
                row.is_active
                ?? true,


            isDeleted:
                row.is_deleted
                ?? false,


            deletedAt:
                row.deleted_at
                ?? null,


            deletedBy:
                row.deleted_by
                ?? null,


            ownerId:
                row.owner_id
                ?? undefined,


            assignedTo:
                row.assigned_to
                ?? undefined,


            address:
                row.address
                ?? undefined,


            city:
                row.city
                ?? undefined,


            state:
                row.state
                ?? undefined,


            country:
                row.country
                ?? undefined,


            postalCode:
                row.postal_code
                ?? undefined,


            notes:
                row.notes
                ?? undefined,


            metadata:
                row.metadata
                ?? {},


            createdBy:
                row.created_by
                ?? undefined,


            updatedBy:
                row.updated_by
                ?? undefined,


            createdAt:
                row.created_at,


            updatedAt:
                row.updated_at,


            version:
                row.version
                ?? undefined,

        };

    }




    /**
     * Convert empty strings to database NULL.
     */
    private normalizeOptional(
        value?: string,
    ): string | null {

        const normalized =
            value?.trim();


        return normalized || null;

    }




    /**
     * Validate identifiers before database access.
     */
    private requireId(
        value: string,
        fieldName: string,
    ): string {

        const normalized =
            value?.trim();


        if (!normalized) {
            throw new Error(
                `${fieldName} is required.`,
            );
        }


        return normalized;

    }




    /**
     * Escape characters that have meaning in PostgREST ILIKE filters.
     */
    private escapeIlike(
        value: string,
    ): string {

        return value
            .replace(
                /\\/g,
                "\\\\",
            )
            .replace(
                /%/g,
                "\\%",
            )
            .replace(
                /_/g,
                "\\_",
            )
            .replace(
                /,/g,
                "\\,",
            );

    }

}




/**
 * Production factory.
 */
export function createContactsRepository(
    supabase: SupabaseClient,
): ContactsRepository {

    return new ContactsRepository(
        supabase,
    );

}


/**
 * Standard export.
 */
export const ContactsRepositoryInstance =
    createContactsRepository;