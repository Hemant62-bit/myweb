import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useSettings } from "@/lib/content";
import { DEFAULT_WA_MESSAGE, NAV_LINKS, telLink, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const settings = useSettings();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header data-testid="site-navbar"
      className={cn("fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled ? "border-b border-white/10 bg-background/80 shadow-[0_6px_30px_rgba(2,6,23,0.25)] backdrop-blur-xl" : "bg-transparent")}>
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 pt-1 sm:px-6 lg:px-8">
        <Logo tagline={settings.tagline} />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} data-testid={`nav-link-${link.label.toLowerCase()}`}
              className={({ isActive }) => cn("relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {({ isActive }) => (<>
                {link.label}
                {isActive && (<motion.span layoutId="nav-active" className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#22D3EE]" />)}
              </>)}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href={telLink(settings.phone)} data-testid="navbar-phone-link"
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:flex">
            <Phone className="h-4 w-4" />{settings.phone}
          </a>
          <a href={whatsappLink(settings.whatsapp, DEFAULT_WA_MESSAGE)} target="_blank" rel="noopener noreferrer" data-testid="navbar-whatsapp-cta"
            className={cn(buttonVariants({ size: "sm" }), "hidden bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white transition-transform duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(37,99,235,0.45)] sm:inline-flex")}>
            WhatsApp Us
          </a>
          <Button variant="ghost" size="icon" className="size-10 lg:hidden" aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open} onClick={() => setOpen((v) => !v)} data-testid="mobile-menu-toggle">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-white/10 bg-background/95 backdrop-blur-xl lg:hidden" data-testid="mobile-menu-panel">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 pb-5 pt-2 sm:px-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i, duration: 0.25 }}>
                  <NavLink to={link.to} end={link.to === "/"} data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                    className={({ isActive }) => cn("block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                      isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60")}>
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Link to="/contact" className={cn(buttonVariants(), "w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white")} data-testid="mobile-quote-cta">Get Free Quote</Link>
                <a href={whatsappLink(settings.whatsapp, DEFAULT_WA_MESSAGE)} target="_blank" rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")} data-testid="mobile-whatsapp-cta">WhatsApp {settings.phone}</a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
