import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Language Settings | ADS Admin",
};


export default function ChangeLanguagePage() {

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
                    Language Settings
                </h1>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-400
                    "
                >
                    Configure the preferred administration language.
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

                <label
                    className="
                        block
                        text-sm
                        font-medium
                        text-slate-300
                    "
                >
                    Application Language
                </label>


                <select
                    className="
                        mt-3
                        w-full
                        rounded-lg
                        border
                        border-white/10
                        bg-[#111111]
                        px-3
                        py-2
                        text-sm
                        text-white
                        outline-none
                    "
                    defaultValue="en"
                >
                    <option value="en">
                        English
                    </option>

                    <option value="hi">
                        Hindi
                    </option>

                    <option value="kn">
                        Kannada
                    </option>

                </select>

            </div>


        </section>
    );
}