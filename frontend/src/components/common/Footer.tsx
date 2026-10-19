import { Link } from "react-router-dom";
import { Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiYoutube } from "@icons-pack/react-simple-icons";
import { Logo } from "@/components/common/Logo";
import { useContent, useSettings } from "@/lib/content";
import { NAV_LINKS, telLink } from "@/lib/site";
import type { Service } from "@/lib/types";

export function Footer() {
  const settings = useSettings();
  const { data: services } = useContent<Service>("services");
  const year = new Date().getFullYear();

  const socials: { href: string; label: string; render: () => React.ReactNode }[] = [
    { href: settings.facebook, label: "Facebook", render: () => <SiFacebook size={16} /> },
    { href: settings.instagram, label: "Instagram", render: () => <SiInstagram size={16} /> },
    { href: settings.linkedin, label: "LinkedIn", render: () => <Linkedin className="h-4 w-4" /> },
    { href: settings.youtube, label: "YouTube", render: () => <SiYoutube size={16} /> },
  ].filter((s) => s.href);

  const linkCls = "inline-flex min-h-10 items-center text-sm text-muted-foreground transition-colors hover:text-foreground";
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-card/40" data-testid="site-footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Logo tagline={settings.tagline} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            We build websites, apps, home and office automation, presentations, academic projects and custom AI agents for businesses across India.
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map(({ href, render, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:text-[#22D3EE]">
                  {render()}
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">Services</h3>
          <ul className="mt-4 space-y-2.5">
            {(services ?? []).slice(0, 8).map((service) => (
              <li key={service.id}>
                <Link to={`/services/${service.slug}`} className={linkCls} data-testid={`footer-service-${service.slug}`}>{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">Company</h3>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((link) => (<li key={link.to}><Link to={link.to} className={linkCls}>{link.label}</Link></li>))}
            <li><Link to="/admin/login" className={linkCls} data-testid="footer-admin-link">Admin Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <a href={telLink(settings.phone)} className="flex min-h-10 items-center gap-2.5 transition-colors hover:text-foreground" data-testid="footer-phone">
                <Phone className="h-4 w-4 text-[#22D3EE]" />+91 {settings.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="flex min-h-10 items-center gap-2.5 transition-colors hover:text-foreground" data-testid="footer-email">
                <Mail className="h-4 w-4 text-[#22D3EE]" />{settings.email}
              </a>
            </li>
            {settings.address && (<li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-[#22D3EE]" />{settings.address}</li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} HPL Digital Solution & Automation. All rights reserved.</p>
          <p>www.hpldigi.in</p>
        </div>
      </div>
    </footer>
  );
}
