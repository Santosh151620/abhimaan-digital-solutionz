const process = [
  "Discovery",
  "Planning",
  "Development",
  "Launch",
  "Support",
];

export default function ProcessSection() {
  return (
    <section className="bg-slate-50 py-24">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          Our Process
        </h2>

        <div className="grid md:grid-cols-5 gap-6 mt-12">

          {process.map((step, index) => (
            <div
              key={step}
              className="
              bg-white
              rounded-xl
              p-6
              text-center
              border
              "
            >
              <div className="font-bold text-blue-700">
                0{index + 1}
              </div>

              <div className="mt-2">
                {step}
              </div>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

