import { MessageCircle } from "lucide-react";
import { PRESET_FLOAT_ENQUIRY, whatsAppChatUrl } from "@/utils/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={whatsAppChatUrl(PRESET_FLOAT_ENQUIRY)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg hover:opacity-90 transition-opacity"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
