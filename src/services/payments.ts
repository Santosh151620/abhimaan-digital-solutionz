import { createClient as createSupabaseClient } from "@/lib/supabase/server";


/**
 * ============================================================================
 * CRM PAYMENTS SERVICE
 * ============================================================================
 *
 * Canonical payment-service boundary for CRM payment operations and dashboard
 * revenue calculations.
 *
 * Responsibilities:
 *
 * - Keep payment database access behind the server Supabase client.
 * - Preserve the existing payment API contract.
 * - Provide paginated payment retrieval.
 * - Provide payment CRUD operations.
 * - Provide canonical revenue aggregates consumed by CRM analytics.
 * - Provide stable payment-status counts.
 *
 * Tenant isolation and authorization remain enforced by Supabase Auth/RLS
 * and the underlying database policies.
 *
 * IMPORTANT:
 *
 * This module intentionally does not introduce a second repository layer or
 * competing payment model. It preserves the current service contract while
 * hardening input handling and result normalization.
 * ============================================================================
 */


const TABLE = "payments";


export interface Payment {

    id: string;

    created_at: string;

    project_id: string;

    amount: number;

    status: string;

    payment_date: string | null;

    notes: string | null;

}


export interface PaymentFilters {

    projectId?: string;

    status?: string;

    page?: number;

    pageSize?: number;

}


export interface PaginatedPayments {

    payments: Payment[];

    total: number;

    page: number;

    pageSize: number;

    totalPages: number;

}


export type PaymentStatus =
    | "pending"
    | "paid"
    | "overdue"
    | "cancelled";


export type PaymentStatusCounts =
    Record<
        PaymentStatus,
        number
    >;


/**
 * ============================================================================
 * INTERNAL HELPERS
 * ============================================================================
 */


/**
 * Normalize pagination input so invalid values cannot produce invalid
 * Supabase ranges.
 */
function normalizePagination(
    page: number | undefined,
    pageSize: number | undefined,
): {
    page: number;
    pageSize: number;
} {

    const normalizedPage =
        Number.isFinite(page) &&
        (page ?? 0) > 0
            ? Math.floor(page as number)
            : 1;


    const normalizedPageSize =
        Number.isFinite(pageSize) &&
        (pageSize ?? 0) > 0
            ? Math.min(
                Math.floor(
                    pageSize as number,
                ),
                100,
            )
            : 20;


    return {
        page:
            normalizedPage,

        pageSize:
            normalizedPageSize,
    };

}


/**
 * Normalize numeric database values before using them in calculations.
 */
function safeNumber(
    value: unknown,
): number {

    const normalized =
        Number(value);


    return Number.isFinite(
        normalized,
    )
        ? normalized
        : 0;

}


/**
 * ============================================================================
 * PAYMENT QUERIES
 * ============================================================================
 */


export async function getPayments(
    filters: PaymentFilters = {},
): Promise<PaginatedPayments> {

    const supabase =
        await createSupabaseClient();


    const {
        page,
        pageSize,
    } =
        normalizePagination(
            filters.page,
            filters.pageSize,
        );


    const from =
        (page - 1) *
        pageSize;


    const to =
        from +
        pageSize -
        1;


    let query =
        supabase
            .from(TABLE)
            .select(
                "*",
                {
                    count: "exact",
                },
            );


    if (
        filters.projectId?.trim()
    ) {

        query =
            query.eq(
                "project_id",
                filters.projectId.trim(),
            );

    }


    if (
        filters.status &&
        filters.status !== "All" &&
        filters.status !== "all"
    ) {

        query =
            query.eq(
                "status",
                filters.status,
            );

    }


    const {
        data,
        count,
        error,
    } =
        await query
            .order(
                "created_at",
                {
                    ascending: false,
                },
            )
            .range(
                from,
                to,
            );


    if (error) {

        throw new Error(
            `Failed to load payments: ${error.message}`,
        );

    }


    const total =
        count ?? 0;


    return {

        payments:
            (data ?? []) as Payment[],

        total,

        page,

        pageSize,

        totalPages:
            Math.ceil(
                total /
                pageSize,
            ),

    };

}


/**
 * Retrieve a payment by primary key.
 */
export async function getPaymentById(
    id: string,
): Promise<Payment | null> {

    const normalizedId =
        id.trim();


    if (!normalizedId) {

        return null;

    }


    const supabase =
        await createSupabaseClient();


    const {
        data,
        error,
    } =
        await supabase
            .from(TABLE)
            .select("*")
            .eq(
                "id",
                normalizedId,
            )
            .maybeSingle();


    if (error) {

        throw new Error(
            `Failed to load payment: ${error.message}`,
        );

    }


    return data as Payment | null;

}


/**
 * ============================================================================
 * PAYMENT MUTATIONS
 * ============================================================================
 */


export async function createPayment(
    payment: Omit<
        Payment,
        "id" | "created_at"
    >,
): Promise<Payment> {

    const supabase =
        await createSupabaseClient();


    const {
        data,
        error,
    } =
        await supabase
            .from(TABLE)
            .insert(payment)
            .select()
            .single();


    if (error) {

        throw new Error(
            `Failed to create payment: ${error.message}`,
        );

    }


    return data as Payment;

}


/**
 * Update an existing payment.
 */
export async function updatePayment(
    id: string,
    updates: Partial<
        Omit<
            Payment,
            "id" | "created_at"
        >
    >,
): Promise<Payment> {

    const normalizedId =
        id.trim();


    if (!normalizedId) {

        throw new Error(
            "Payment id is required.",
        );

    }


    const {
        data,
        error,
    } =
        await (
            await createSupabaseClient()
        )
            .from(TABLE)
            .update(updates)
            .eq(
                "id",
                normalizedId,
            )
            .select()
            .single();


    if (error) {

        throw new Error(
            `Failed to update payment: ${error.message}`,
        );

    }


    return data as Payment;

}


/**
 * Delete a payment.
 *
 * This preserves the existing hard-delete contract. Soft-delete behavior
 * should only be introduced if the existing payments schema/repository
 * explicitly supports it.
 */
export async function deletePayment(
    id: string,
): Promise<boolean> {

    const normalizedId =
        id.trim();


    if (!normalizedId) {

        throw new Error(
            "Payment id is required.",
        );

    }


    const supabase =
        await createSupabaseClient();


    const {
        error,
    } =
        await supabase
            .from(TABLE)
            .delete()
            .eq(
                "id",
                normalizedId,
            );


    if (error) {

        throw new Error(
            `Failed to delete payment: ${error.message}`,
        );

    }


    return true;

}


/**
 * ============================================================================
 * REVENUE AGGREGATES
 * ============================================================================
 */


/**
 * Return total revenue represented by paid payments.
 */
export async function getTotalRevenue():
    Promise<number> {

    const supabase =
        await createSupabaseClient();


    const {
        data,
        error,
    } =
        await supabase
            .from(TABLE)
            .select("amount")
            .eq(
                "status",
                "paid",
            );


    if (error) {

        throw new Error(
            `Failed to calculate total revenue: ${error.message}`,
        );

    }


    return (
        data ?? []
    ).reduce(
        (
            total,
            payment,
        ) =>
            total +
            Math.max(
                0,
                safeNumber(
                    payment.amount,
                ),
            ),
        0,
    );

}


/**
 * Return outstanding payment obligations.
 *
 * Cancelled payments are excluded because they no longer represent an
 * actionable outstanding obligation.
 */
export async function getOutstandingRevenue():
    Promise<number> {

    const supabase =
        await createSupabaseClient();


    const {
        data,
        error,
    } =
        await supabase
            .from(TABLE)
            .select(
                "amount,status",
            )
            .neq(
                "status",
                "paid",
            )
            .neq(
                "status",
                "cancelled",
            );


    if (error) {

        throw new Error(
            `Failed to calculate outstanding revenue: ${error.message}`,
        );

    }


    return (
        data ?? []
    ).reduce(
        (
            total,
            payment,
        ) =>
            total +
            Math.max(
                0,
                safeNumber(
                    payment.amount,
                ),
            ),
        0,
    );

}


/**
 * ============================================================================
 * PAYMENT STATUS AGGREGATES
 * ============================================================================
 */


/**
 * Return stable counts for all dashboard-supported payment statuses.
 *
 * The returned object always contains every known status, including statuses
 * with zero records.
 */
export async function getPaymentsCountByStatus():
    Promise<PaymentStatusCounts> {

    const supabase =
        await createSupabaseClient();


    const statuses:
        PaymentStatus[] = [
            "pending",
            "paid",
            "overdue",
            "cancelled",
        ];


    const result:
        PaymentStatusCounts = {
            pending: 0,
            paid: 0,
            overdue: 0,
            cancelled: 0,
        };


    await Promise.all(
        statuses.map(
            async (
                status,
            ) => {

                const {
                    count,
                    error,
                } =
                    await supabase
                        .from(TABLE)
                        .select(
                            "*",
                            {
                                count: "exact",
                                head: true,
                            },
                        )
                        .eq(
                            "status",
                            status,
                        );


                if (error) {

                    throw new Error(
                        `Failed to count ${status} payments: ${error.message}`,
                    );

                }


                result[status] =
                    count ?? 0;

            },
        ),
    );


    return result;

}