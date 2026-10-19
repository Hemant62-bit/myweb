export type LeadStatus = "New" | "Contacted" | "Won" | "Lost";
export interface AdminOut { username: string; name: string; must_change_password: boolean }
export interface MessageOut { message: string }
export interface Lead {
  id: string; name: string; phone: string; email: string | null; service: string;
  city: string | null; budget: string | null; message: string; status: LeadStatus; created_at: string;
}
export interface LeadCreate {
  name: string; phone: string; email?: string | null; service: string;
  city?: string | null; budget?: string | null; message: string;
}
export interface LeadStats { total: number; today: number; by_status: Record<string, number>; daily: { date: string; count: number }[] }
export interface SiteSettings {
  brand: string; tagline: string; phone: string; whatsapp: string; email: string; address: string;
  facebook: string; instagram: string; linkedin: string; youtube: string;
}
export interface ContentItem {
  id: string; slug: string | null; title: string | null; order: number; active: boolean;
  [key: string]: unknown;
}
export interface Package { name: string; price: number; duration?: string; popular?: boolean; features: string[] }
export interface ProcessStep { title: string; text: string }
export interface Faq { q: string; a: string }
export interface Service extends ContentItem {
  icon?: string; short?: string; hero_line?: string; description?: string; features?: string[];
  process?: ProcessStep[]; packages?: Package[]; faqs?: Faq[]; demo?: boolean;
}
export interface AppProduct extends ContentItem {
  subtitle?: string; short?: string; description?: string; features?: string[]; price?: number;
  price_note?: string; platform?: string; cta_label?: string; image?: string;
}
export interface Testimonial extends ContentItem { role?: string; rating?: number; text?: string }
export interface PortfolioItem extends ContentItem {
  category?: string; client?: string; summary?: string; tags?: string[]; result?: string; image?: string;
}
export interface FaqItem extends ContentItem { text?: string }
export interface Banner extends ContentItem { text?: string; cta_label?: string; cta_link?: string }
export type ContentCollection = "services" | "apps" | "testimonials" | "portfolio" | "faqs" | "banners";
