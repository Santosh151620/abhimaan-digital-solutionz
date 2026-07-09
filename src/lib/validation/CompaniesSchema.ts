import { z } from 'zod';

export const CompaniesSchema = z.object({
    id: z.string().optional()
});

export type CompaniesInput = z.infer<typeof CompaniesSchema>;
