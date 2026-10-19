import { useState } from "react";
import { Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/content";
import { telLink, whatsappLink } from "@/lib/site";

/** Razorpay-ready placeholder: online payment is intentionally disabled, so the modal routes to WhatsApp or a call. */
export function PaymentNotice({ context = "this package" }: { context?: string }) {
  const [open, setOpen] = useState(false);
  const settings = useSettings();
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} data-testid="pay-online-btn" className="w-full gap-2 text-muted-foreground">
        <Lock className="h-3.5 w-3.5" />Pay Online: Coming soon
      </Button>
      {open && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true"
          onClick={() => setOpen(false)} data-testid="payment-notice-dialog">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Close" onClick={() => setOpen(false)} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
            <h2 className="font-heading text-lg font-semibold">Online payment launching soon</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Card, UPI and netbanking checkout is being activated. Until then we confirm {context} over WhatsApp or a quick call, and send you a GST invoice with UPI and bank transfer details.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <a href={whatsappLink(settings.whatsapp, `Hi HPL Digital, I want to order ${context}. Please share payment details.`)}
                target="_blank" rel="noopener noreferrer" className="w-full" data-testid="payment-whatsapp-btn">
                <Button className="w-full bg-[#25D366] text-white hover:bg-[#1FBE5A]">Order on WhatsApp</Button>
              </a>
              <a href={telLink(settings.phone)} className="w-full" data-testid="payment-call-btn">
                <Button variant="outline" className="w-full">Call {settings.phone}</Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
