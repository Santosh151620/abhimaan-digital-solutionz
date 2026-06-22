import { generateSEO } from "@/lib/seo";
import "@/app/globals.css";

export const metadata = generateSEO({
  title: "About Us",
  description: "Learn more about Abhimaan Digital Solutionz and our journey.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-20 text-white">
      <div className="space-y-6">
        <h1 className="text-5xl font-bold tracking-tight text-teal-400 mb-4">
          About Us
        </h1>
        <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
          Welcome to Abhimaan Digital Solutionz. We are dedicated to delivering 
          high-quality digital transformation and web development experiences tailored 
          to scale your business.
        </p>
      </div>
    </main>
  );
}
