'use client';

export function usePipeline() {
    return {
        pipeline: [],
        loading: false,
        error: null,
    };
}