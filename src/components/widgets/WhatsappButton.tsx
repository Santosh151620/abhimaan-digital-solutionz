"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton() {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917406045800";
  const message = encodeURIComponent("Hello Abhimaan Digital Solutionz. I am interested in your services.");
  const whatsappUrl = `https://wa.me{phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      /* ATTACH THE NEW CLASS NAME 'animate-whatsapp-float' BELOW: */
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition duration-300 z-50 flex items-center justify-center border border-white/20 animate-whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      {/* Your SVG Icon or text code */}
      <span className="font-semibold text-sm">Chat with us</span>
    </a>
  );
}

