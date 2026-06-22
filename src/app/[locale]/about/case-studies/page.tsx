import { generateSEO } from "@/lib/seo";
import "@/app/globals.css";
// import CaseStudySchema from "@/components/seo/CaseStudySchema";

export const metadata = generateSEO({
  title: "Case Studies",
  description: "Explore real results achieved for our global business partners.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-20 text-white">
      <h1 className="text-4xl font-bold text-teal-400 mb-6">Case Studies</h1>
      <p className="text-lg text-slate-300">Explore real results achieved for our global business partners.</p>
    </main>
  );
}
