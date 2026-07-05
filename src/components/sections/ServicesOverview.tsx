const services = [
  {
    title: "Website Development",
    desc: "Premium business websites built for growth.",
  },

  {
    title: "CRM Solutions",
    desc: "Lead management and business automation.",
  },

  {
    title: "SaaS Development",
    desc: "Custom scalable software platforms.",
  },

  {
    title: "Branding Services",
    desc: "Logos, creatives and identity systems.",
  },
];

export default function ServicesOverview() {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          Our Services
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">

          {services.map((service) => (
            <div
              key={service.title}
              className="
              p-6
              rounded-xl
              border
              bg-white
              shadow-sm
              "
            >
              <h3 className="font-bold text-xl">
                {service.title}
              </h3>

              <p className="mt-4 text-slate-600">
                {service.desc}
              </p>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

