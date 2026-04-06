import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { whatsAppChatUrl, PRESET_FLOAT_ENQUIRY } from "@/utils/whatsapp";
import { getPublicPhoneTelHref } from "@/utils/phone";
import { fetchSitePublic } from "@/services/sitePublic.service";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const { pathname } = useLocation();
  /** On home, FABs sit on the left on small screens so they do not cover the hero search card. */
  const homeMobileFab = pathname === "/";
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { data } = useQuery({
    queryKey: ["site", "public"],
    queryFn: fetchSitePublic,
    staleTime: 5 * 60 * 1000,
  });
  const waDigits = data?.content?.contact?.whatsappNumber;

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] z-40 flex flex-col gap-2 md:bottom-6 md:right-6 md:gap-3",
        homeMobileFab ? "left-3 md:left-auto" : "right-3"
      )}
    >
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
        href={getPublicPhoneTelHref()}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-opacity hover:opacity-90 md:h-14 md:w-14"
        aria-label="Call us"
      >
        <Phone className="h-6 w-6 md:h-7 md:w-7" />
      </a>
      <a
        href={whatsAppChatUrl(PRESET_FLOAT_ENQUIRY, waDigits)}
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
