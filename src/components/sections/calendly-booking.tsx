import { BUSINESS_INFO } from "@/constants/business";

export default function CalendlyBooking() {
  return (
    <section className="rounded-2xl border p-8">
      <h2 className="mb-4 text-3xl font-bold">
        Book a Free Consultation
      </h2>

      <p className="mb-6 text-gray-600">
        Schedule a one-on-one consultation
        with our team and discuss your
        business goals.
      </p>

      <a
        href={BUSINESS_INFO.calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-lg bg-black px-6 py-3 text-white"
      >
        Book Consultation
      </a>
    </section>
  );
}