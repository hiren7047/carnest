import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { whatsAppChatUrl, PRESET_FLOAT_ENQUIRY } from "@/utils/whatsapp";
import { digitsToTelHref, resolvePublicContactDigits } from "@/utils/phone";
import { useSiteContent } from "@/hooks/useSitePublic";

export function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const siteContent = useSiteContent();
  const contactDigits = resolvePublicContactDigits(siteContent.contact.whatsappNumber);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] right-3 z-40 flex flex-col gap-2 md:bottom-6 md:right-6 md:gap-3">
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary shadow-lg transition-opacity hover:opacity-90 md:h-14 md:w-14"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6 md:h-7 md:w-7" />
        </button>
      )}
      <a
        href={digitsToTelHref(contactDigits)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-opacity hover:opacity-90 md:h-14 md:w-14"
        aria-label="Call us"
      >
        <Phone className="h-6 w-6 md:h-7 md:w-7" />
      </a>
      <a
        href={whatsAppChatUrl(PRESET_FLOAT_ENQUIRY, contactDigits)}
        target="_blank"
        rel="noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-opacity hover:opacity-90 md:h-14 md:w-14"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
      </a>
    </div>
  );
}
