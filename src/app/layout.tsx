import "@/app/globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="overflow-x-hidden">
                <QueryProvider>
                    {children}
                </QueryProvider>
            </body>
        </html>
    );
}