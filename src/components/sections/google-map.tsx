import { BUSINESS_INFO } from "@/content/business";

export default function GoogleMap() {
  return (
    <div className="overflow-hidden rounded-2xl">
      <iframe
        src={BUSINESS_INFO.googleMapsEmbed}
        width="100%"
        height="450"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}