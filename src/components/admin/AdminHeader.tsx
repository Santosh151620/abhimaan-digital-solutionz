import Link from "next/link";


export default function AdminHeader() {

    return (

        <header className="flex h-16 items-center justify-between border-b bg-background px-6">


            <div>

                <h1 className="text-lg font-semibold">
                    Admin Portal
                </h1>

                <p className="text-sm text-muted-foreground">
                    Platform administration and configuration
                </p>

            </div>


            <div className="flex items-center gap-4">


                <Link
                    href="/admin/settings"
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
                >
                    Settings
                </Link>


                <div className="flex items-center gap-3 rounded-lg border px-3 py-2">


                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                    >
                        A
                    </div>


                    <div className="hidden sm:block">

                        <p className="text-sm font-medium">
                            Administrator
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Platform Admin
                        </p>

                    </div>


                </div>


            </div>


        </header>

    );

}