import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Profile | ADS Admin",
};


export default function AdminProfilePage() {

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
                    My Profile
                </h1>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-400
                    "
                >
                    Manage administrator profile information.
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

                <p className="text-sm text-slate-300">
                    Profile management will be available here.
                </p>

            </div>


        </section>
    );
}