export default function AdminLoading() {

    return (

        <div className="flex min-h-[200px] items-center justify-center">

            <div className="flex items-center gap-3 text-sm text-muted-foreground">

                <div
                    className="
                        h-5
                        w-5
                        animate-spin
                        rounded-full
                        border-2
                        border-primary
                        border-t-transparent
                    "
                />

                <span>
                    Loading admin data...
                </span>

            </div>

        </div>

    );

}