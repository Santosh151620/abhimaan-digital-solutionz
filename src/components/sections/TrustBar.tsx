export default function TrustBar() {
  const items = [
    "100+ Projects",
    "AI Powered",
    "Enterprise Grade",
    "SEO Optimized",
  ];

  return (
    <section className="bg-white border-y">

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">

        {items.map((item) => (
          <div
            key={item}
            className="text-center font-semibold"
          >
            {item}
          </div>
        ))}

      </div>

    </section>
  );
}






