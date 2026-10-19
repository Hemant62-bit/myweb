import type { SiteSettings } from "@/lib/types";

export const DEFAULT_SETTINGS: SiteSettings = {
  brand: "HPL", tagline: "Digital Solution & Automation", phone: "9074520224", whatsapp: "919074520224",
  email: "hpl.digi1@gmail.com", address: "Dewas, Madhya Pradesh", facebook: "", instagram: "", linkedin: "", youtube: "",
};
export const SITE_NAME = "HPL Digital Solution & Automation";
export const SITE_URL = "https://www.hpldigi.in";
export const SERVICE_OPTIONS = [
  "Website Making", "App Making", "Home Automation", "Office Automation", "Office Presentation Making",
  "College & School Digital Project Building", "AI Agent Building", "Other Digital Services",
];
export const BUDGET_OPTIONS = [
  "Under ₹10,000", "₹10,000 - ₹25,000", "₹25,000 - ₹50,000", "₹50,000 - ₹1,00,000", "Above ₹1,00,000", "Not decided yet",
];
export function formatINR(value: number): string { return `₹${value.toLocaleString("en-IN")}`; }
export function whatsappLink(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
export function telLink(phone: string): string { return `tel:+91${phone.replace(/\D/g, "").slice(-10)}`; }
export const DEFAULT_WA_MESSAGE = "Hi HPL Digital, I would like to enquire about your digital & automation services.";
export const NAV_LINKS = [
  { label: "Home", to: "/" }, { label: "Services", to: "/services" }, { label: "Apps", to: "/apps" },
  { label: "Portfolio", to: "/portfolio" }, { label: "About", to: "/about" }, { label: "Contact", to: "/contact" },
];
