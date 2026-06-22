import "@/app/globals.css";
//import { generateSEO } from "@/lib/seo";

export default function TestimonialsPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-20">

      <h1 className="text-5xl font-bold">
        Testimonials
      </h1>

      <div className="grid md:grid-cols-3 gap-8 mt-16">

        {[1,2,3].map((item) => (
          <div
            key={item}
            className="border rounded-xl p-6"
          >
            <p>
              Outstanding service and support.
            </p>

            <h4 className="mt-4 font-bold">
              Client {item}
            </h4>
          </div>
        ))}

      </div>

    </main>
  );
}