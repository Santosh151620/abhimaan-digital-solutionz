import { createClient as createSupabaseClient } from "@/lib/supabase/server";

export interface Payment {
    id: string;

    created_at: string;

    client_id: string;

    project_id: string | null;

    amount: number;

    status:
        | "pending"
        | "paid"
        | "failed"
        | "refunded";

    method:
        | "cash"
        | "card"
        | "bank_transfer"
        | "upi";

    payment_date: string | null;

    reference: string | null;

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

const TABLE = "payments";

export async function getPayments(
    filters: PaymentFilters = {}
): Promise<PaginatedPayments> {
    const supabase = await createSupabaseClient();

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
        .from(TABLE)
        .select("*", { count: "exact" });

    if (filters.projectId) {
        query = query.eq("project_id", filters.projectId);
    }

    if (filters.status && filters.status !== "All") {
        query = query.eq("status", filters.status);
    }

    const { data, count, error } = await query
        .order("created_at", {
            ascending: false,
        })
        .range(from, to);

    if (error) {
        throw new Error(error.message);
    }

    return {
        payments: (data ?? []) as Payment[],
        total: count ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((count ?? 0) / pageSize),
    };
}

export async function getPaymentById(
    id: string
): Promise<Payment | null> {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Payment;
}

export async function createPayment(
    payment: Omit<Payment, "id" | "created_at">
): Promise<Payment> {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE)
        .insert(payment)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Payment;
}

export async function updatePayment(
    id: string,
    updates: Partial<Omit<Payment, "id" | "created_at">>
): Promise<Payment> {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE)
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Payment;
}

export async function deletePayment(
    id: string
): Promise<boolean> {
    const supabase = await createSupabaseClient();

    const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    return true;
}

export async function getTotalRevenue(): Promise<number> {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE)
        .select("amount")
        .eq("status", "paid");

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []).reduce(
        (total, payment) => total + Number(payment.amount ?? 0),
        0
    );
}

export async function getOutstandingRevenue(): Promise<number> {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE)
        .select("amount")
        .neq("status", "paid");

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []).reduce(
        (total, payment) => total + Number(payment.amount ?? 0),
        0
    );
}

export async function getPaymentsCountByStatus() {
    const supabase = await createSupabaseClient();

    const statuses = [
        "pending",
        "paid",
        "overdue",
        "cancelled",
    ];

    const result: Record<string, number> = {};

    await Promise.all(
        statuses.map(async (status) => {
            const { count } = await supabase
                .from(TABLE)
                .select("*", {
                    count: "exact",
                    head: true,
                })
                .eq("status", status);

            result[status] = count ?? 0;
        })
    );

    return result;
}





