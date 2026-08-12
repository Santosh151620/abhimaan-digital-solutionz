import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Theme Settings | ADS Admin",
};


export default function ChangeThemePage() {

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
                    Theme Settings
                </h1>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-400
                    "
                >
                    Configure your preferred administration appearance.
                </p>

            </div>


            <div
                className="
                    grid
                    gap-3
                    sm:grid-cols-3
                "
            >

                <button
                    type="button"
                    className="
                        rounded-xl
                        border
                        border-amber-300/30
                        bg-amber-300/10
                        px-4
                        py-4
                        text-left
                        text-sm
                        font-medium
                        text-white
                    "
                >
                    Dark
                </button>


                <button
                    type="button"
                    className="
                        rounded-xl
                        border
                        border-white/10
                        bg-black/20
                        px-4
                        py-4
                        text-left
                        text-sm
                        font-medium
                        text-slate-300
                    "
                >
                    Light
                </button>


                <button
                    type="button"
                    className="
                        rounded-xl
                        border
                        border-white/10
                        bg-black/20
                        px-4
                        py-4
                        text-left
                        text-sm
                        font-medium
                        text-slate-300
                    "
                >
                    System
                </button>

            </div>

        </section>
    );
}