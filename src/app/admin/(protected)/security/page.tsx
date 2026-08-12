import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Security | ADS Admin",
};


export default function AdminSecurityPage() {

    return (
        <section
            className="
                rounded-2xl
                border
                border-white/10
                bg-[#0b0b0b]
                p-6
            "
        >

            <div className="mb-6">

                <h1
                    className="
                        text-xl
                        font-semibold
                        text-white
                    "
                >
                    Security
                </h1>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-400
                    "
                >
                    Manage account security and access controls.
                </p>

            </div>


            <div
                className="
                    space-y-3
                    rounded-xl
                    border
                    border-white/10
                    bg-black/20
                    p-5
                "
            >

                <div
                    className="
                        rounded-lg
                        border
                        border-white/10
                        px-4
                        py-3
                    "
                >
                    <p className="text-sm font-medium text-white">
                        Password Management
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Update administrator authentication settings.
                    </p>
                </div>


                <div
                    className="
                        rounded-lg
                        border
                        border-white/10
                        px-4
                        py-3
                    "
                >
                    <p className="text-sm font-medium text-white">
                        Session Security
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Review active sessions and account protection.
                    </p>
                </div>

            </div>


        </section>
    );
}