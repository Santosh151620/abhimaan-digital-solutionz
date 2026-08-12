import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Logout | ADS Admin",
};


export default function AdminLogoutPage() {

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
                    Logout
                </h1>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-400
                    "
                >
                    Sign out from the ADS administration portal.
                </p>

            </div>


            <div
                className="
                    rounded-xl
                    border
                    border-white/10
                    bg-black/20
                    p-5
                "
            >

                <p
                    className="
                        mb-4
                        text-sm
                        text-slate-300
                    "
                >
                    You can securely sign out of your current administrator session.
                </p>


                <button
                    type="button"
                    className="
                        rounded-lg
                        bg-amber-300
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-black
                        transition
                        hover:bg-amber-200
                    "
                >
                    Sign Out
                </button>

            </div>

        </section>
    );
}