import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";


export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <>
      <Header />

      <main className="min-h-screen pt-24">
        {children}
      </main>

      <Footer />

      <WhatsAppButton />

    </>

  );
}