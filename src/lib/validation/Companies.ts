import type { Company } from '@/types/crm/Companies';

import {
    CompaniesSchema,
    type CompaniesFormValues,
} from './CompaniesSchema';

export {
    CompaniesSchema,
    type CompaniesFormValues,
};

export const defaultCompaniesValues: CompaniesFormValues = {

    name: '',

    legalName: '',

    industry: '',

    website: '',

    email: '',

    phone: '',

    status: 'ACTIVE',

    address: '',

    city: '',

    state: '',

    country: '',

    postalCode: '',

    employees: undefined,

    annualRevenue: undefined,

    taxId: '',

    description: '',

};

export function createCompanyDefaults(
    company?: Partial<Company>,
): CompaniesFormValues {

    return {

        ...defaultCompaniesValues,

        ...company,

    };

}

export function normalizeCompanyInput(
    values: CompaniesFormValues,
): CompaniesFormValues {

    return {

        ...values,

        name: values.name.trim(),

        legalName: values.legalName?.trim() ?? '',

        industry: values.industry?.trim() ?? '',

        website: values.website?.trim() ?? '',

        email: values.email?.trim().toLowerCase() ?? '',

        phone: values.phone?.trim() ?? '',

        address: values.address?.trim() ?? '',

        city: values.city?.trim() ?? '',

        state: values.state?.trim() ?? '',

        country: values.country?.trim() ?? '',

        postalCode: values.postalCode?.trim() ?? '',

        taxId: values.taxId?.trim() ?? '',

        description: values.description?.trim() ?? '',

    };

}

export function validateCompany(
    values: unknown,
) {

    return CompaniesSchema.safeParse(values);

}

export function validateCompanyOrThrow(
    values: unknown,
): CompaniesFormValues {

    return CompaniesSchema.parse(values);

}