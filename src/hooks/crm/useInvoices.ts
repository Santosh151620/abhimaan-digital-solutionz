'use client';

export function useInvoices() {
    return {
        invoices: [],
        loading: false,
        error: null,
    };
}