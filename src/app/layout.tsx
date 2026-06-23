import "@/app/globals.css"; 
import WhatsAppButton from "../components/layout/WhatsAppButton";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Provide the matching parameters for valid page routing boundaries
export function generateStaticParams() {
  return [  { locale: 'en' }, 
    { locale: 'hi' }, 
    { locale: 'kn' }, 
    { locale: 'te' }, 
    { locale: 'mr' }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 1. Unwrap the dynamic route parameters safely for Next.js 16
  const { locale } = await params;

  // 2. Fetch the current language json dictionary from your messages folder
  const messages = await getMessages();

  return (
  <html lang={locale}>
    <head />
    <body className="overflow-x-hidden">
      <NextIntlClientProvider locale={locale} messages={messages}>
        
        <div className="w-full relative z-50 block">
          <Header />
        </div>
        
        <main className="flex-grow pt-24">{children}</main>
        
        <Footer />

        {/* This displays the high-performance floating widget on ALL sub-pages! */}
        <WhatsAppButton />

      </NextIntlClientProvider>
    </body>
  </html>
);

}
<body className="overflow-x-hidden"></body>