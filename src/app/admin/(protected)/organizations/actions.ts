"use server";

import {
    createClient,
} from "@/lib/supabase/server";

import {
    OrganizationsRepository,
} from "@/repositories/admin/OrganizationsRepository";

import {
    OrganizationsService,
} from "@/services/admin/OrganizationsService";

import type {
    Organization,
} from "@/types/admin/Organization";

async function getService() {

    const supabase =
        await createClient();

    const repository =
        new OrganizationsRepository(
            supabase,
        );

    return new OrganizationsService(
        repository,
    );

}

export async function createOrganization(
    data: Partial<Organization>,
) {

    const service =
        await getService();

    const now =
        new Date().toISOString();

    const organization: Organization = {

        id:
            crypto.randomUUID(),

        name:
            data.name ?? "",

        code:
            data.code ?? "",

        legalName:
            data.legalName,

        displayName:
            data.displayName,

        description:
            data.description,

        type:
            data.type ?? "Customer",

        status:
            data.status ?? "Active",

        email:
            data.email,

        phone:
            data.phone,

        website:
            data.website,

        addressLine1:
            data.addressLine1,

        addressLine2:
            data.addressLine2,

        city:
            data.city,

        state:
            data.state,

        postalCode:
            data.postalCode,

        country:
            data.country,

        taxId:
            data.taxId,

        registrationNumber:
            data.registrationNumber,

        industry:
            data.industry,

        timezone:
            data.timezone,

        locale:
            data.locale,

        currency:
            data.currency,

        planId:
            data.planId,

        subscriptionStatus:
            data.subscriptionStatus,

        trialEndsAt:
            data.trialEndsAt,

        subscriptionEndsAt:
            data.subscriptionEndsAt,

        maxUsers:
            data.maxUsers,

        maxStorageGb:
            data.maxStorageGb,

        maxApiRequestsPerDay:
            data.maxApiRequestsPerDay,

        isActive:
            data.isActive ?? true,

        isSystem:
            data.isSystem ?? false,

        metadata:
            data.metadata,

        createdBy:
            data.createdBy,

        updatedBy:
            data.updatedBy,

        createdAt:
            now,

        updatedAt:
            now,

    };

    await service.save(
        organization,
    );

    return {
        success: true,
    };

}

export async function updateOrganization(
    organization: Organization,
) {

    const service =
        await getService();

    await service.save({

        ...organization,

        updatedAt:
            new Date().toISOString(),

    });

    return {
        success: true,
    };

}

export async function deleteOrganization(
    id: string,
) {

    const service =
        await getService();

    await service.delete(
        id,
    );

    return {
        success: true,
    };

}