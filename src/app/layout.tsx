import "@/app/globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="overflow-x-hidden bg-slate-100 text-slate-900">
                <QueryProvider>
                    {children}
                </QueryProvider>
            </body>
        </html>
    );
}