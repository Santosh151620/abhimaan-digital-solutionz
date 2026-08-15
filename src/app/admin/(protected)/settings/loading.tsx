export default function SettingsLoading() {

    return (

        <div
            aria-busy="true"
            aria-label="Loading platform settings"
            className="space-y-6"
        >

            <div className="flex items-center justify-between">

                <div className="space-y-2">

                    <div
                        className="
                            h-8
                            w-64
                            animate-pulse
                            rounded-md
                            bg-gray-200
                        "
                    />

                    <div
                        className="
                            h-4
                            w-96
                            max-w-full
                            animate-pulse
                            rounded-md
                            bg-gray-100
                        "
                    />

                </div>


                <div
                    className="
                        h-10
                        w-32
                        animate-pulse
                        rounded-md
                        bg-gray-200
                    "
                />

            </div>


            <div
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    bg-white
                    shadow-sm
                "
            >

                <div
                    className="
                        h-12
                        animate-pulse
                        border-b
                        bg-gray-100
                    "
                />


                <div className="divide-y">

                    {Array.from({
                        length: 6,
                    }).map(
                        (_, index) => (

                            <div
                                key={index}
                                className="
                                    grid
                                    min-h-20
                                    grid-cols-6
                                    items-center
                                    gap-4
                                    px-4
                                    py-4
                                "
                            >

                                <div
                                    className="
                                        h-4
                                        w-32
                                        animate-pulse
                                        rounded
                                        bg-gray-200
                                    "
                                />

                                <div
                                    className="
                                        h-4
                                        w-28
                                        animate-pulse
                                        rounded
                                        bg-gray-100
                                    "
                                />

                                <div
                                    className="
                                        h-4
                                        w-24
                                        animate-pulse
                                        rounded
                                        bg-gray-100
                                    "
                                />

                                <div
                                    className="
                                        h-4
                                        w-24
                                        animate-pulse
                                        rounded
                                        bg-gray-100
                                    "
                                />

                                <div
                                    className="
                                        h-4
                                        w-16
                                        animate-pulse
                                        rounded
                                        bg-gray-100
                                    "
                                />

                                <div
                                    className="
                                        h-6
                                        w-16
                                        animate-pulse
                                        rounded-full
                                        bg-gray-200
                                    "
                                />

                            </div>

                        ),
                    )}

                </div>

            </div>

        </div>

    );
}