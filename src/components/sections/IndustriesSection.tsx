const industries = [
  "Real Estate",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Travel",
  "Construction",
  "Hospitality",
  "Sports & Fitness",
];

export default function IndustriesSection() {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          Industries We Serve
        </h2>

        <div className="grid md:grid-cols-4 gap-6 mt-12">

          {industries.map((industry) => (
            <div
              key={industry}
              className="
              border
              rounded-xl
              p-6
              text-center
              bg-white
              "
            >
              {industry}
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}
