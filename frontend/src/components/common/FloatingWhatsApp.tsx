import { MessageCircle } from "lucide-react";
import { useSettings } from "@/lib/content";
import { DEFAULT_WA_MESSAGE, whatsappLink } from "@/lib/site";

export function FloatingWhatsApp() {
  const settings = useSettings();
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      <span className="hidden rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-lg ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10 sm:block">
        Usually replies in under 15 mins (IST)
      </span>
      <a href={whatsappLink(settings.whatsapp, DEFAULT_WA_MESSAGE)} target="_blank" rel="noopener noreferrer"
        aria-label="Chat with HPL on WhatsApp" data-testid="floating-whatsapp-btn"
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)] transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#22D3EE] focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <span className="absolute inset-0 animate-[ring-pulse_2.2s_ease-out_infinite] rounded-full bg-[#25D366]/60" />
        <MessageCircle className="relative h-7 w-7" strokeWidth={2.2} />
      </a>
    </div>
  );
}
