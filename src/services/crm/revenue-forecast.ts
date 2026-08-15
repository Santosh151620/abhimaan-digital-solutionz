import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";


/**
 * ============================================================================
 * CRM REVENUE FORECAST
 * ============================================================================
 *
 * Deterministic forecast engine.
 *
 * This service deliberately contains no AI dependency. It calculates a
 * transparent forecast from the organization's lead pipeline.
 *
 * Authentication, organization context and RLS remain enforced by the
 * server-side Supabase client and database policies.
 * ============================================================================
 */


export interface RevenueForecast {

    estimatedMonthlyRevenue: number;

    pipelineValue: number;

    winProbability: number;

    averageDealSize: number;

    velocityScore: number;

}


const EMPTY_FORECAST:
    RevenueForecast = {

        estimatedMonthlyRevenue: 0,

        pipelineValue: 0,

        winProbability: 0,

        averageDealSize: 0,

        velocityScore: 0,

    };


interface ForecastLeadRow {

    id: string;

    status: string | null;

    created_at: string | null;

    amount:
        | number
        | string
        | null;

}


/**
 * Convert database numeric values safely.
 */
function safeAmount(
    value:
        | number
        | string
        | null
        | undefined,
): number {

    if (
        typeof value === "number"
    ) {

        return Number.isFinite(value)
            ? Math.max(0, value)
            : 0;

    }


    if (
        typeof value !== "string"
    ) {

        return 0;

    }


    const parsed =
        Number(
            value.trim(),
        );


    return Number.isFinite(parsed)
        ? Math.max(0, parsed)
        : 0;

}


/**
 * Clamp a percentage to the valid 0–100 range.
 */
function percentage(
    value: number,
): number {

    if (
        !Number.isFinite(value)
    ) {

        return 0;

    }


    return Math.min(
        100,
        Math.max(
            0,
            value,
        ),
    );

}


/**
 * Lightweight deterministic revenue forecast.
 */
export async function getRevenueForecast():
    Promise<RevenueForecast> {

    const supabase =
        await createSupabaseServerClient();


    const {
        data,
        error,
    } =
        await supabase
            .from("leads")
            .select(
                "id, status, created_at, amount",
            );


    if (
        error ||
        !data ||
        data.length === 0
    ) {

        return {
            ...EMPTY_FORECAST,
        };

    }


    const leads =
        data as ForecastLeadRow[];


    let totalValue = 0;

    let wonValue = 0;

    let wonCount = 0;

    let activePipelineValue = 0;

    let activeLeads = 0;


    for (
        const lead of leads
    ) {

        const amount =
            safeAmount(
                lead.amount,
            );


        totalValue += amount;


        if (
            lead.status === "won"
        ) {

            wonValue += amount;

            wonCount++;

            continue;

        }


        if (
            lead.status !== "lost"
        ) {

            activeLeads++;

            activePipelineValue +=
                amount;

        }

    }


    const leadCount =
        leads.length;


    if (
        leadCount <= 0
    ) {

        return {
            ...EMPTY_FORECAST,
        };

    }


    const averageDealSize =
        totalValue /
        leadCount;


    const winProbability =
        percentage(
            (
                wonCount /
                leadCount
            ) * 100,
        );


    const pipelineValue =
        activePipelineValue;


    /*
     * Velocity is intentionally a simple operational signal for the MVP.
     * It should not be interpreted as a financial forecast by itself.
     */
    const velocityScore =
        Math.min(
            100,
            activeLeads * 10,
        );


    /*
     * Forecast = realized won revenue + probability-weighted active pipeline.
     */
    const estimatedMonthlyRevenue =
        wonValue +
        pipelineValue *
        (
            winProbability /
            100
        );


    return {

        estimatedMonthlyRevenue:
            Number(
                estimatedMonthlyRevenue
                    .toFixed(2),
            ),

        pipelineValue:
            Number(
                pipelineValue
                    .toFixed(2),
            ),

        winProbability:
            Number(
                winProbability
                    .toFixed(1),
            ),

        averageDealSize:
            Number(
                averageDealSize
                    .toFixed(2),
            ),

        velocityScore,

    };

}