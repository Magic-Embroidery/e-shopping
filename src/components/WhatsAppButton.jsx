import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const whatsappUrl = "https://wa.me/919994546013?text=Hello%20Magic%20Embroidery!%20🧵%20I'm%20interested%20in%20ordering%20a%20digital%20embroidery%20design.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-40 flex items-center justify-center bg-green-500 hover:bg-green-600 text-brand-white rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95 animate-pulse-slow
        bottom-6 right-6 w-14 h-14 md:bottom-8 md:right-8 md:w-16 md:h-16
        xs:bottom-6 xs:right-6 xs:w-12 xs:h-12"
      title="Chat on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 md:w-8 md:h-8 xs:w-5 xs:h-5 fill-brand-white" />
    </a>
  );
}
