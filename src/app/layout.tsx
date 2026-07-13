import "@/app/globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import WhatsAppButton from "../components/layout/WhatsAppButton";
import { NextIntlClientProvider } from "next-intl";
import QueryProvider from "@/components/providers/QueryProvider";

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = "en";

  const messages = (await import("../../messages/en.json")).default;

  return (
    <html lang={locale}>
      <body className="overflow-x-hidden">
        <QueryProvider>
  <NextIntlClientProvider
    locale={locale}
    messages={messages}
  >
          <Header />
          <main className="pt-24">{children}</main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
