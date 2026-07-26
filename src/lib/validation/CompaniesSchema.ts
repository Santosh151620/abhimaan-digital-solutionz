import { z } from 'zod';

export const CompanyStatusSchema = z.enum([
    'ACTIVE',
    'INACTIVE',
    'PROSPECT',
    'ARCHIVED',
]);

export const CompaniesSchema = z.object({

    name: z
        .string()
        .trim()
        .min(2, 'Company name is required.')
        .max(150),

    legalName: z
        .string()
        .trim()
        .max(200)
        .optional()
        .or(z.literal('')),

    industry: z
        .string()
        .trim()
        .max(100)
        .optional()
        .or(z.literal('')),

    website: z
        .string()
        .trim()
        .url('Invalid website.')
        .optional()
        .or(z.literal('')),

    email: z
        .string()
        .trim()
        .email('Invalid email.')
        .optional()
        .or(z.literal('')),

    phone: z
        .string()
        .trim()
        .max(30)
        .optional()
        .or(z.literal('')),

    status: CompanyStatusSchema.default('ACTIVE'),

    address: z
        .string()
        .trim()
        .max(250)
        .optional()
        .or(z.literal('')),

    city: z
        .string()
        .trim()
        .max(100)
        .optional()
        .or(z.literal('')),

    state: z
        .string()
        .trim()
        .max(100)
        .optional()
        .or(z.literal('')),

    country: z
        .string()
        .trim()
        .max(100)
        .optional()
        .or(z.literal('')),

    postalCode: z
        .string()
        .trim()
        .max(20)
        .optional()
        .or(z.literal('')),

    employees: z
        .coerce
        .number()
        .int()
        .min(0)
        .optional(),

    annualRevenue: z
        .coerce
        .number()
        .min(0)
        .optional(),

    taxId: z
        .string()
        .trim()
        .max(100)
        .optional()
        .or(z.literal('')),

    description: z
        .string()
        .trim()
        .max(2000)
        .optional()
        .or(z.literal('')),
});

export type CompaniesFormValues =
    z.infer<typeof CompaniesSchema>;