import { siteConfig }
from "@/config/site";

export default function
LocalBusinessSchema() {

  const schema = {
    "@context":
      "https://schema.org",

    "@type":
      "ProfessionalService",

    name:
      siteConfig.name,

    address: {
      "@type":
        "PostalAddress",

      addressLocality:
        "Bangalore",

      addressRegion:
        "Karnataka",

      addressCountry:
        "IN",
    },

    telephone:
      siteConfig.phone,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html:
          JSON.stringify(schema),
      }}
    />
  );
}
