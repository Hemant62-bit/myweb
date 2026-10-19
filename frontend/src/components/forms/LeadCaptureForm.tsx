import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/select";
import { apiPost } from "@/lib/api";
import { useSettings } from "@/lib/content";
import { BUDGET_OPTIONS, SERVICE_OPTIONS, whatsappLink } from "@/lib/site";
import type { Lead, LeadCreate } from "@/lib/types";

interface LeadCaptureFormProps { defaultService?: string; compact?: boolean }

/** Saves the enquiry to MongoDB, then opens WhatsApp with the same details prefilled. */
export function LeadCaptureForm({ defaultService, compact }: LeadCaptureFormProps) {
  const settings = useSettings();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState(defaultService ?? SERVICE_OPTIONS[0]);
  const [budget, setBudget] = useState(BUDGET_OPTIONS[0]);
  const [message, setMessage] = useState("");

  // defaultService arrives from an async query, so it can be undefined on first render.
  useEffect(() => { if (defaultService) setService(defaultService); }, [defaultService]);

  // A service title from the CMS may not be in SERVICE_OPTIONS; keep it selectable.
  const serviceOptions = SERVICE_OPTIONS.includes(service) ? SERVICE_OPTIONS : [service, ...SERVICE_OPTIONS];

  const mutation = useMutation({
    mutationFn: (payload: LeadCreate) => apiPost<Lead>("/leads", payload),
    onSuccess: (lead) => {
      toast.success("Enquiry received", { description: "Our team will get back to you within one working day." });
      const summary = [
        `New enquiry from the HPL website`, `Name: ${lead.name}`, `Phone: ${lead.phone}`,
        lead.email ? `Email: ${lead.email}` : "", `Service: ${lead.service}`,
        lead.city ? `City: ${lead.city}` : "", lead.budget ? `Budget: ${lead.budget}` : "",
        lead.message ? `Details: ${lead.message}` : "",
      ].filter(Boolean).join("\n");
      window.open(whatsappLink(settings.whatsapp, summary), "_blank", "noopener");
      setName(""); setPhone(""); setEmail(""); setCity(""); setMessage("");
    },
    onError: (error: unknown) => {
      const status = (error as { status?: number }).status;
      toast.error(status === 429 ? "Too many enquiries from this device. Please try again shortly."
        : "Could not send your enquiry. Please WhatsApp us instead.");
    },
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) { toast.error("Please enter your name"); return; }
    if (phone.replace(/\D/g, "").length < 10) { toast.error("Please enter a valid 10-digit phone number"); return; }
    mutation.mutate({ name: name.trim(), phone: phone.trim(), email: email.trim() || null, city: city.trim() || null, service, budget, message: message.trim() });
  };

  return (
    <form onSubmit={submit} data-testid="lead-capture-form" className="space-y-4">
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-2">
          <Label htmlFor="lead-name">Full name *</Label>
          <Input id="lead-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Arun Thomas" data-testid="lead-name-input" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-phone">Phone / WhatsApp *</Label>
          <Input id="lead-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" inputMode="tel" data-testid="lead-phone-input" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-email">Email</Label>
          <Input id="lead-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" data-testid="lead-email-input" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-city">City</Label>
          <Input id="lead-city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Dewas" data-testid="lead-city-input" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-service">Service needed *</Label>
          <NativeSelect id="lead-service" value={service} onChange={(e) => setService(e.target.value)} data-testid="lead-service-select">
            {serviceOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
          </NativeSelect>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-budget">Budget range</Label>
          <NativeSelect id="lead-budget" value={budget} onChange={(e) => setBudget(e.target.value)} data-testid="lead-budget-select">
            {BUDGET_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
          </NativeSelect>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="lead-message">Tell us about your project</Label>
        <Textarea id="lead-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
          placeholder="What do you need built? Any deadline we should know about?" data-testid="lead-message-input" />
      </div>
      <Button type="submit" disabled={mutation.isPending} data-testid="lead-submit-btn"
        className="w-full gap-2 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white transition-transform duration-200 hover:scale-[1.01] hover:shadow-[0_0_28px_rgba(37,99,235,0.45)]">
        {mutation.isPending ? (<><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>) : (<><Send className="h-4 w-4" /> Send enquiry & open WhatsApp</>)}
      </Button>
      <p className="text-center text-xs text-muted-foreground">We reply within one working day. Your details are never shared.</p>
    </form>
  );
}
