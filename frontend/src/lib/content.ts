import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { DEFAULT_SETTINGS, SITE_NAME, SITE_URL } from "@/lib/site";
import type { ContentCollection, ContentItem, SiteSettings } from "@/lib/types";

export function useSettings(): SiteSettings {
  const { data } = useQuery({ queryKey: ["settings"], queryFn: () => apiGet<SiteSettings>("/settings"), staleTime: 5 * 60 * 1000 });
  return data ?? DEFAULT_SETTINGS;
}

export function useContent<T extends ContentItem>(collection: ContentCollection, includeInactive = false) {
  return useQuery({
    queryKey: ["content", collection, includeInactive],
    queryFn: () => apiGet<T[]>(`/content/${collection}${includeInactive ? "?include_inactive=true" : ""}`),
    staleTime: 60 * 1000,
  });
}

export function useContentItem<T extends ContentItem>(collection: ContentCollection, slug?: string) {
  return useQuery({
    queryKey: ["content", collection, "item", slug],
    queryFn: () => apiGet<T>(`/content/${collection}/${slug}`),
    enabled: Boolean(slug),
  });
}

interface SeoOptions {
  title: string; description: string; path?: string; image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

export function useSeo({ title, description, path = "/", image, jsonLd }: SeoOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;
    const url = `${SITE_URL}${path}`;
    const ogImage = image ?? `${SITE_URL}/favicon.svg`;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = url;
    const scriptId = "page-json-ld";
    document.getElementById(scriptId)?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = scriptId; script.type = "application/ld+json"; script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, path, image, jsonLd]);
}

export function organizationSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org", "@type": "LocalBusiness", name: SITE_NAME, alternateName: "HPL Digital",
    url: SITE_URL, telephone: `+91${settings.phone}`, email: settings.email,
    description: "HPL Digital Solution & Automation builds websites, mobile apps, home and office automation, corporate presentations, academic projects and custom AI agents.",
    address: { "@type": "PostalAddress", addressLocality: "Dewas", addressRegion: "Madhya Pradesh", addressCountry: "IN" },
    areaServed: "India", priceRange: "₹₹",
  };
}
