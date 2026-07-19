'use client';

export function useTickets() {
    return {
        tickets: [],
        loading: false,
        error: null,
    };
}