import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Our Industries",
  description: "Specialized digital strategies for healthcare, real estate, finance, and e-commerce brands.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-20 text-white animate-fade-in">
      <div className="max-w-3xl space-y-6">
        <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">Expertise</span>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Industries We <span className="text-teal-400">Transform</span>
        </h1>
        <p className="text-xl text-slate-300 leading-relaxed">
          We engineer tailored high-performance digital experiences across key sectors, 
          ensuring your brand stands out and scales effectively.
        </p>
        
        {/* Industry Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 pt-8">
          {industries.map((industry, index) => (
            <div key={index} className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-teal-500 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-2">{industry}</h3>
              <p className="text-slate-400 text-sm">Custom conversion pathways optimized specifically for market sector compliance and performance.</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const industries = [
  "Real Estate",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Hospitality",
  "Travel",
  "Construction",
  "Sports & Fitness",
];