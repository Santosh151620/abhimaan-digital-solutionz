import {
    getSettings,
    saveSetting,
} from "./page-actions";


import SettingDialog from "@/components/admin/settings/SettingDialog";


import SettingTable from "@/components/admin/settings/SettingTable";


import type {
    PlatformSetting,
} from "@/types/admin/Settings";


import {
    revalidatePath,
} from "next/cache";





export default async function SettingsPage() {


    const settings =
        await getSettings();


    const activeCount =
        settings.filter(
            setting =>
                setting.isActive,
        ).length;


    const inactiveCount =
        settings.length -
        activeCount;


    const encryptedCount =
        settings.filter(
            setting =>
                setting.isEncrypted,
        ).length;


    const categoryCount =
        new Set(
            settings.map(
                setting =>
                    setting.category,
            ),
        ).size;





    async function handleSave(

        setting: PlatformSetting,

    ): Promise<void> {

        "use server";


        await saveSetting(
            setting,
        );


        revalidatePath(
            "/admin/settings",
        );

    }





    return (

        <main
            className="
                space-y-6
            "
        >

            <section
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                "
            >

                <div>

                    <h1
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-gray-900
                        "
                    >

                        Platform Settings

                    </h1>


                    <p
                        className="
                            mt-1
                            max-w-3xl
                            text-sm
                            text-gray-500
                        "
                    >

                        Manage enterprise configuration and
                        organization-scoped platform settings.

                    </p>

                </div>


                <div
                    className="
                        shrink-0
                    "
                >

                    <SettingDialog
                        onSave={
                            handleSave
                        }
                    />

                </div>

            </section>


            <section
                aria-label="Settings summary"
                className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-4
                "
            >

                <div
                    className="
                        rounded-lg
                        border
                        bg-white
                        p-4
                        shadow-sm
                    "
                >

                    <p
                        className="
                            text-sm
                            font-medium
                            text-gray-500
                        "
                    >

                        Total Settings

                    </p>


                    <p
                        className="
                            mt-1
                            text-2xl
                            font-semibold
                            text-gray-900
                        "
                    >

                        {settings.length}

                    </p>

                </div>


                <div
                    className="
                        rounded-lg
                        border
                        bg-white
                        p-4
                        shadow-sm
                    "
                >

                    <p
                        className="
                            text-sm
                            font-medium
                            text-gray-500
                        "
                    >

                        Active

                    </p>


                    <p
                        className="
                            mt-1
                            text-2xl
                            font-semibold
                            text-gray-900
                        "
                    >

                        {activeCount}

                    </p>

                </div>


                <div
                    className="
                        rounded-lg
                        border
                        bg-white
                        p-4
                        shadow-sm
                    "
                >

                    <p
                        className="
                            text-sm
                            font-medium
                            text-gray-500
                        "
                    >

                        Inactive

                    </p>


                    <p
                        className="
                            mt-1
                            text-2xl
                            font-semibold
                            text-gray-900
                        "
                    >

                        {inactiveCount}

                    </p>

                </div>


                <div
                    className="
                        rounded-lg
                        border
                        bg-white
                        p-4
                        shadow-sm
                    "
                >

                    <p
                        className="
                            text-sm
                            font-medium
                            text-gray-500
                        "
                    >

                        Categories

                    </p>


                    <p
                        className="
                            mt-1
                            text-2xl
                            font-semibold
                            text-gray-900
                        "
                    >

                        {categoryCount}

                    </p>


                    {encryptedCount > 0 && (

                        <p
                            className="
                                mt-1
                                text-xs
                                text-gray-500
                            "
                        >

                            {encryptedCount} encrypted
                            {encryptedCount === 1
                                ? " setting"
                                : " settings"}

                        </p>

                    )}

                </div>

            </section>


            <section
                aria-labelledby="settings-list-heading"
                className="
                    space-y-3
                "
            >

                <div>

                    <h2
                        id="settings-list-heading"
                        className="
                            text-lg
                            font-semibold
                            text-gray-900
                        "
                    >

                        Configuration

                    </h2>


                    <p
                        className="
                            text-sm
                            text-gray-500
                        "
                    >

                        Organization settings currently available
                        to the administration layer.

                    </p>

                </div>


                <SettingTable
                    items={settings}
                />

            </section>

        </main>

    );

}