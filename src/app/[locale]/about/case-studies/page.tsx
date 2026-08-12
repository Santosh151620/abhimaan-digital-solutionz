import { generateSEO } from "@/lib/seo";
import "@/app/globals.css";

export const metadata = generateSEO({
  title: "Case Studies",
  description:
    "Explore how Abhimaan Digital Solutionz helps organizations improve digital experiences, customer engagement, operational visibility, and business growth.",
  path: "/about/case-studies",
});

const caseStudies = [
  {
    title: "Digital Experience Transformation",
    category: "Digital Transformation",
    description:
      "Modernizing customer-facing digital experiences with scalable architecture, intuitive interfaces, and a foundation designed for long-term growth.",
    outcomes: [
      "Improved digital experience",
      "Scalable platform foundation",
      "Stronger customer engagement",
    ],
  },
  {
    title: "Customer Relationship Modernization",
    category: "Customer Experience",
    description:
      "Connecting customer information, sales processes, activities, and business intelligence into a more unified operating experience.",
    outcomes: [
      "Better customer visibility",
      "More consistent sales execution",
      "Improved decision-making",
    ],
  },
  {
    title: "Business Operations Enablement",
    category: "Business Solutions",
    description:
      "Designing modular digital solutions that allow organizations to adopt the capabilities they need while maintaining flexibility for future expansion.",
    outcomes: [
      "Modular business capabilities",
      "Reduced operational complexity",
      "Future-ready architecture",
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">

        <div className="max-w-4xl space-y-6">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-400">
            Client Success
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Case Studies
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            Discover how Abhimaan Digital Solutionz approaches complex digital
            challenges through thoughtful strategy, scalable technology, and
            customer-focused execution.
          </p>

        </div>


        <div className="mt-16 grid gap-6 lg:grid-cols-3">

          {caseStudies.map((caseStudy) => (

            <article
              key={caseStudy.title}
              className="
                flex
                h-full
                flex-col
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                p-7
                transition
                duration-200
                hover:-translate-y-1
                hover:border-teal-400/30
                hover:bg-white/[0.05]
              "
            >

              <div className="mb-6">

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-400">
                  {caseStudy.category}
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  {caseStudy.title}
                </h2>

              </div>


              <p className="leading-7 text-slate-300">
                {caseStudy.description}
              </p>


              <div className="mt-8 border-t border-white/10 pt-6">

                <p className="text-sm font-semibold text-white">
                  Focus areas
                </p>

                <ul className="mt-4 space-y-3">

                  {caseStudy.outcomes.map((outcome) => (

                    <li
                      key={outcome}
                      className="flex gap-3 text-sm text-slate-300"
                    >

                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400"
                      />

                      <span>
                        {outcome}
                      </span>

                    </li>

                  ))}

                </ul>

              </div>

            </article>

          ))}

        </div>


        <section
          className="
            mt-16
            rounded-2xl
            border
            border-teal-400/20
            bg-gradient-to-br
            from-teal-400/[0.08]
            via-blue-500/[0.05]
            to-transparent
            p-8
            sm:p-10
          "
        >

          <div className="max-w-4xl">

            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-400">
              Our Approach
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Technology should create business leverage.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-300">
              We build digital solutions around real business objectives rather
              than technology alone. Our approach combines strategy, user
              experience, engineering, data, automation, and scalable
              architecture to help organizations move from fragmented processes
              toward connected digital operations.
            </p>

          </div>

        </section>


        <section className="mt-16 border-t border-white/10 pt-10">

          <p className="max-w-3xl text-sm leading-6 text-slate-400">
            Client information and measurable results are presented with
            appropriate confidentiality. Detailed engagement stories can be
            provided where client disclosure and publication permissions allow.
          </p>

        </section>

      </section>
    </main>
  );
}