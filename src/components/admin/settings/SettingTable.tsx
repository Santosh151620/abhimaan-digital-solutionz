"use client";

import type {
    PlatformSetting,
} from "@/types/admin/Settings";


interface SettingTableProps {

    items: PlatformSetting[];

}


function formatValue(
    value: PlatformSetting["value"],
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

        return value || "-";

    }


    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {

        return String(value);

    }


    try {

        return JSON.stringify(
            value,
            null,
            0,
        );

    } catch {

        return "[Unserializable value]";

    }

}


function formatDate(
    value?: string,
): string {

    if (!value) {

        return "-";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {

        return "-";

    }


    return new Intl.DateTimeFormat(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short",
        },
    ).format(date);

}


export default function SettingTable({
    items,
}: SettingTableProps) {


    if (
        items.length === 0
    ) {

        return (

            <div
                className="
                    rounded-lg
                    border
                    bg-white
                    px-6
                    py-12
                    text-center
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-md
                    "
                >

                    <h3
                        className="
                            text-base
                            font-semibold
                            text-gray-900
                        "
                    >

                        No settings found.

                    </h3>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-gray-500
                        "
                    >

                        There are currently no platform
                        settings available for this organization.

                    </p>

                </div>

            </div>

        );

    }


    return (

        <div
            className="
                overflow-hidden
                rounded-lg
                border
                bg-white
                shadow-sm
            "
        >

            <div
                className="
                    overflow-x-auto
                "
            >

                <table
                    className="
                        min-w-full
                        divide-y
                        divide-gray-200
                    "
                >

                    <caption className="sr-only">
                        Platform settings
                    </caption>


                    <thead
                        className="
                            bg-gray-50
                        "
                    >

                        <tr>

                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-gray-600
                                "
                            >

                                Name

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-gray-600
                                "
                            >

                                Key

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-gray-600
                                "
                            >

                                Category

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-gray-600
                                "
                            >

                                Scope

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-gray-600
                                "
                            >

                                Type

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-gray-600
                                "
                            >

                                Value

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-gray-600
                                "
                            >

                                Status

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-gray-600
                                "
                            >

                                Updated

                            </th>

                        </tr>

                    </thead>


                    <tbody
                        className="
                            divide-y
                            divide-gray-200
                            bg-white
                        "
                    >

                        {items.map(
                            setting => {

                                const value =
                                    formatValue(
                                        setting.value,
                                    );


                                return (

                                    <tr
                                        key={setting.id}
                                        className="
                                            transition-colors
                                            hover:bg-gray-50
                                        "
                                    >

                                        <td
                                            className="
                                                max-w-xs
                                                px-4
                                                py-4
                                                align-top
                                            "
                                        >

                                            <div
                                                className="
                                                    font-medium
                                                    text-gray-900
                                                "
                                            >

                                                {setting.name}

                                            </div>


                                            {setting.description && (

                                                <div
                                                    className="
                                                        mt-1
                                                        line-clamp-2
                                                        text-sm
                                                        text-gray-500
                                                    "
                                                    title={
                                                        setting.description
                                                    }
                                                >

                                                    {
                                                        setting.description
                                                    }

                                                </div>

                                            )}

                                        </td>


                                        <td
                                            className="
                                                max-w-xs
                                                px-4
                                                py-4
                                                align-top
                                            "
                                        >

                                            <code
                                                className="
                                                    break-all
                                                    rounded
                                                    bg-gray-100
                                                    px-2
                                                    py-1
                                                    text-xs
                                                    text-gray-700
                                                "
                                            >

                                                {setting.key}

                                            </code>

                                        </td>


                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-4
                                                py-4
                                                align-top
                                                text-sm
                                                text-gray-700
                                            "
                                        >

                                            {setting.category}

                                        </td>


                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-4
                                                py-4
                                                align-top
                                                text-sm
                                                text-gray-700
                                            "
                                        >

                                            {setting.scope}

                                        </td>


                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-4
                                                py-4
                                                align-top
                                            "
                                        >

                                            <span
                                                className="
                                                    inline-flex
                                                    rounded-md
                                                    border
                                                    bg-gray-50
                                                    px-2
                                                    py-1
                                                    text-xs
                                                    font-medium
                                                    text-gray-700
                                                "
                                            >

                                                {setting.valueType}

                                            </span>

                                        </td>


                                        <td
                                            className="
                                                max-w-sm
                                                px-4
                                                py-4
                                                align-top
                                            "
                                        >

                                            <div
                                                className="
                                                    max-w-sm
                                                    truncate
                                                    font-mono
                                                    text-xs
                                                    text-gray-700
                                                "
                                                title={value}
                                            >

                                                {setting.isEncrypted
                                                    ? "••••••••"
                                                    : value}

                                            </div>

                                        </td>


                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-4
                                                py-4
                                                align-top
                                            "
                                        >

                                            <span
                                                className={`
                                                    inline-flex
                                                    rounded-full
                                                    px-2.5
                                                    py-1
                                                    text-xs
                                                    font-medium
                                                    ${
                                                        setting.isActive
                                                            ? `
                                                                bg-green-100
                                                                text-green-700
                                                            `
                                                            : `
                                                                bg-gray-100
                                                                text-gray-600
                                                            `
                                                    }
                                                `}
                                            >

                                                {setting.isActive
                                                    ? "Active"
                                                    : "Inactive"}

                                            </span>

                                        </td>


                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-4
                                                py-4
                                                align-top
                                                text-sm
                                                text-gray-500
                                            "
                                        >

                                            {formatDate(
                                                setting.updatedAt,
                                            )}

                                        </td>

                                    </tr>

                                );

                            },
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}