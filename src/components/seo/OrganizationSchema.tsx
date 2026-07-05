import { siteConfig }
from "@/config/site";

export default function
OrganizationSchema() {

  const schema = {
    "@context":
      "https://schema.org",

    "@type":
      "Organization",

    name:
      siteConfig.name,

    url:
      siteConfig.url,

    email:
      siteConfig.email,

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
