interface ServiceSchemaProps {
  serviceName: string;
  description: string;
}

export default function
ServiceSchema({
  serviceName,
  description,
}: ServiceSchemaProps) {

  const schema = {
    "@context":
      "https://schema.org",

    "@type":
      "Service",

    name:
      serviceName,

    description,
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






