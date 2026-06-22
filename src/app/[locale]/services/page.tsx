import ServiceSchema
from "@/components/seo/ServiceSchema";
import "@/app/globals.css";
<ServiceSchema
  serviceName="Digital Marketing Services"
  description="SEO, PPC, social media marketing, content marketing and business growth solutions."
/>

import { generateSEO }
from "@/lib/seo";

export const metadata =
  generateSEO({
    title:
      "Services",

    description:
      "Digital marketing, web development, branding, resume writing and business growth solutions.",

    path:
      "/services",
  });

const services = [
  "Website Development",
  "CRM Solutions",
  "SaaS Development",
  "Resume Services",
  "Branding Services",
  "Digital Consulting",
];

export default function ServicesPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-20">

      <h1 className="text-5xl font-bold">
        Services
      </h1>

      <div className="grid md:grid-cols-3 gap-8 mt-16">

        {services.map((service) => (
          <div
            key={service}
            className="border rounded-xl p-6"
          >
            <h3 className="text-xl font-bold">
              {service}
            </h3>
          </div>
        ))}

      </div>

    </main>
  );
}