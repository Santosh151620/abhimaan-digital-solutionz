import Link from "next/link";
import { notFound } from "next/navigation";

import {
    getSetting,
} from "../actions";


interface Props {

    params: Promise<{
        id: string;
    }>;

}


/**
 * ============================================================================
 * CRM SETTING DETAILS
 * ============================================================================
 *
 * Responsibilities:
 * - Display one CRM setting.
 * - Respect the canonical Setting domain contract.
 * - Safely render JSON-backed setting values.
 * - Preserve compatibility with legacy Settings UI properties.
 *
 * Does not:
 * - Access the database directly.
 * - Modify settings.
 * - Implement persistence rules.
 * ============================================================================
 */


export async function generateMetadata({
    params,
}: Props) {

    const {
        id,
    } =
        await params;


    const setting =
        await getSetting(
            id,
        );


    return {

        title:
            setting
                ? `${setting.name} | CRM Settings`
                : "CRM Setting",

    };

}


/**
 * Render a setting value safely regardless of its JSON-backed type.
 */
function formatSettingValue(
    value: unknown,
): string {

    if (
        value === null ||
        value === undefined
    ) {

        return "-";

    }


    if (
        typeof value === "string"
    ) {

        return value.trim()
            ? value
            : "-";

    }


    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {

        return String(
            value,
        );

    }


    try {

        return JSON.stringify(
            value,
            null,
            2,
        );

    } catch {

        return String(
            value,
        );

    }

}


/**
 * Render a value while respecting the encryption state.
 */
function displayValue(
    encrypted: boolean,
    value: unknown,
): string {

    if (
        encrypted
    ) {

        return "••••••••";

    }


    return formatSettingValue(
        value,
    );

}


export default async function SettingDetailsPage({
    params,
}: Props) {

    const {
        id,
    } =
        await params;


    const setting =
        await getSetting(
            id,
        );


    if (
        !setting
    ) {

        notFound();

    }


    const encrypted =
        setting.encrypted ??
        setting.isEncrypted ??
        false;


    const editable =
        setting.editable ??
        (
            !setting.isReadonly &&
            !setting.isSystem
        );


    const status =
        setting.status ??
        (
            setting.isActive
                ? "Active"
                : "Inactive"
        );


    return (

        <div
            className="
                space-y-8
            "
        >

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div
                    className="
                        flex
                        items-start
                        gap-3
                    "
                >

                    <Link
                        href="/crm/settings"
                        className="
                            inline-flex
                            items-center
                            rounded-lg
                            border
                            px-3
                            py-2
                            text-sm
                            font-medium
                            transition
                            hover:bg-muted
                            focus:outline-none
                            focus:ring-2
                            focus:ring-primary/20
                        "
                    >
                        ← Back
                    </Link>


                    <div>

                        <h1
                            className="
                                text-2xl
                                font-semibold
                            "
                        >
                            {setting.name}
                        </h1>


                        <p
                            className="
                                text-sm
                                text-muted-foreground
                            "
                        >
                            {setting.settingNumber ?? setting.key}
                        </p>

                    </div>

                </div>


                {
                    editable && (

                        <Link
                            href={
                                `/crm/settings/${setting.id}/edit`
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-lg
                                border
                                px-4
                                py-2
                                text-sm
                                font-medium
                                transition
                                hover:bg-muted
                                focus:outline-none
                                focus:ring-2
                                focus:ring-primary/20
                            "
                        >
                            Edit
                        </Link>

                    )
                }

            </div>


            <div
                className="
                    grid
                    gap-6
                    md:grid-cols-2
                "
            >

                <div
                    className="
                        crm-card
                        space-y-5
                        p-6
                    "
                >

                    <Info
                        label="Key"
                        value={setting.key}
                    />


                    <Info
                        label="Category"
                        value={setting.category}
                    />


                    <Info
                        label="Status"
                        value={status}
                    />

                </div>


                <div
                    className="
                        crm-card
                        space-y-5
                        p-6
                    "
                >

                    <Info
                        label="Editable"
                        value={
                            editable
                                ? "Yes"
                                : "No"
                        }
                    />


                    <Info
                        label="Encrypted"
                        value={
                            encrypted
                                ? "Yes"
                                : "No"
                        }
                    />


                    <div>

                        <div
                            className="
                                text-sm
                                text-muted-foreground
                            "
                        >
                            Value
                        </div>


                        <pre
                            className="
                                mt-2
                                whitespace-pre-wrap
                                break-words
                                rounded-lg
                                bg-muted
                                p-3
                                text-sm
                            "
                        >
                            {
                                displayValue(
                                    encrypted,
                                    setting.value,
                                )
                            }
                        </pre>

                    </div>

                </div>

            </div>


            {
                setting.description && (

                    <div
                        className="
                            crm-card
                            p-6
                        "
                    >

                        <h2
                            className="
                                mb-3
                                font-semibold
                            "
                        >
                            Description
                        </h2>


                        <p
                            className="
                                whitespace-pre-wrap
                                text-sm
                            "
                        >
                            {setting.description}
                        </p>

                    </div>

                )
            }

        </div>

    );

}


function Info({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {

    return (

        <div>

            <div
                className="
                    text-sm
                    text-muted-foreground
                "
            >
                {label}
            </div>


            <div
                className="
                    break-words
                    font-medium
                "
            >
                {
                    value ||
                    "-"
                }
            </div>

        </div>

    );

}