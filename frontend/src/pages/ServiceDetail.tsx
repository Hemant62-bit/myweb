import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Check, MessageCircle, Sparkles, Star } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MeshBackdrop } from "@/components/common/SiteLayout";
import { Reveal, SectionHeading, Stagger, StaggerItem } from "@/components/common/Reveal";
import { PaymentNotice } from "@/components/common/PaymentNotice";
import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import { InteractiveHomeSimulator } from "@/components/home-automation/InteractiveHomeSimulator";
import { SERVICE_ICONS } from "@/pages/Home";
import { useContent, useContentItem, useSeo, useSettings } from "@/lib/content";
import { SITE_URL, formatINR, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Faq, Package, ProcessStep, Service } from "@/lib/types";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const settings = useSettings();
  const { data: service, isError, isLoading } = useContentItem<Service>("services", slug);
  const { data: allServices } = useContent<Service>("services");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const title = service?.title ?? "Service";
  useSeo({
    title,
    description: service?.short ?? "HPL Digital Solution & Automation — professional digital and automation services with transparent INR pricing.",
    path: `/services/${slug ?? ""}`,
    jsonLd: service ? {
      "@context": "https://schema.org", "@type": "Service", name: service.title, description: service.short,
      provider: { "@type": "Organization", name: "HPL Digital Solution & Automation", url: SITE_URL },
      areaServed: "India", url: `${SITE_URL}/services/${service.slug}`,
    } : undefined,
  });

  const Icon = SERVICE_ICONS[String(service?.icon)] ?? Sparkles;
  const packages = (service?.packages ?? []) as Package[];
  const steps = (service?.process ?? []) as ProcessStep[];
  const faqs = (service?.faqs ?? []) as Faq[];
  const features = (service?.features ?? []) as string[];
  const related = (allServices ?? []).filter((s) => s.slug !== slug).slice(0, 3);

  const quoteMessage = (packageName?: string) =>
    packageName
      ? `Hi HPL Digital, I am interested in the "${packageName}" package under ${title}. Please share a quote.`
      : `Hi HPL Digital, I would like a quote for ${title}.`;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <MeshBackdrop />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Link to="/services" data-testid="back-to-services" className="inline-flex min-h-11 items-center text-xs font-medium uppercase tracking-widest text-[#22D3EE] hover:underline">← All services</Link>
            <div className="mt-6 flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#2563EB]/25 to-[#7C3AED]/25 text-[#22D3EE]"><Icon className="h-7 w-7" /></span>
              <Badge variant="outline" className="border-white/15">{isLoading ? "Loading…" : "Service"}</Badge>
            </div>
            <h1 className="mt-6 max-w-3xl font-heading text-3xl font-bold tracking-tight sm:text-5xl" data-testid="service-title">{service?.hero_line ?? title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{service?.short}</p>
            {isError && (<p className="mt-5 text-sm text-muted-foreground" data-testid="service-error-note">This service page could not load right now. WhatsApp us on {settings.phone} and we will send the details directly.</p>)}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" data-testid="service-quote-cta"
                className={cn(buttonVariants({ size: "lg" }), "tap-cta gap-2 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white transition-transform duration-200 hover:scale-[1.03]")}>
                Get Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={whatsappLink(settings.whatsapp, quoteMessage())} target="_blank" rel="noopener noreferrer" data-testid="service-whatsapp-cta"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "tap-cta gap-2 border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10")}>
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DESCRIPTION + FEATURES */}
      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="font-heading text-2xl font-bold">What you get</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{service?.description}</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <Card className="rounded-2xl border-white/10 bg-card/60 p-6 backdrop-blur-sm">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#22D3EE]">Included features</h3>
              <ul className="mt-4 space-y-3" data-testid="service-features-list">
                {features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{feature}</li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* INTERACTIVE DEMO */}
      {service?.demo === true && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading overline="Try it live" title="Play with a real automation dashboard"
            description="This is an interactive simulation of what you control from your phone after installation — dim the lights, change fan speed, lock the door or fire a scene." />
          <div className="mt-10"><InteractiveHomeSimulator /></div>
        </section>
      )}

      {/* PACKAGES */}
      {packages.length > 0 && (
        <section className="relative bg-card/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading overline="Packages & pricing" title="Transparent starting prices"
              description="Market-rate starter packages. Final pricing depends on scope — we always send an itemised quote before work begins." />
            <Stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <StaggerItem key={pkg.name}>
                  <Card data-testid={`package-card-${pkg.name}`}
                    className={cn("relative flex h-full flex-col rounded-2xl border-white/10 bg-background/50 p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5",
                      pkg.popular && "gradient-border shadow-[0_18px_44px_rgba(37,99,235,0.22)]")}>
                    {pkg.popular && (<Badge className="absolute -top-3 left-6 gap-1 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white"><Star className="h-3 w-3" /> Most popular</Badge>)}
                    <h3 className="font-heading text-lg font-semibold">{pkg.name}</h3>
                    <p className="mt-3"><span className="font-heading text-3xl font-bold">{formatINR(pkg.price)}</span><span className="ml-1 text-xs text-muted-foreground">onwards</span></p>
                    {pkg.duration && <p className="mt-1 text-xs text-muted-foreground">Delivery: {pkg.duration}</p>}
                    <ul className="mt-5 flex-1 space-y-2.5">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex gap-2.5 text-sm text-muted-foreground"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />{feature}</li>
                      ))}
                    </ul>
                    <div className="mt-6 space-y-2">
                      <a href={whatsappLink(settings.whatsapp, quoteMessage(pkg.name))} target="_blank" rel="noopener noreferrer" data-testid={`package-quote-btn-${pkg.name}`} className="block">
                        <Button className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white transition-transform duration-200 hover:scale-[1.02]">Get Quote</Button>
                      </a>
                      <PaymentNotice context={`the ${pkg.name} package`} />
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* PROCESS */}
      {steps.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading overline="Our process" title="How this project will run" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-card/50 p-5">
                  <span className="font-heading text-3xl font-bold text-[#7C3AED]/40">0{i + 1}</span>
                  <h3 className="mt-2 font-heading text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
          <SectionHeading align="center" overline="FAQ" title={`${title} — common questions`} />
          <div className="mt-10 space-y-3" data-testid="service-faq-list">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} className="overflow-hidden rounded-xl border border-white/10 bg-card/50">
                  <button onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open} data-testid={`service-faq-toggle-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium transition-colors hover:text-[#22D3EE]">
                    {faq.q}
                    <ArrowRight className={cn("h-4 w-4 shrink-0 transition-transform duration-300", open && "rotate-90 text-[#22D3EE]")} />
                  </button>
                  <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* LEAD FORM */}
      <section className="relative overflow-hidden py-16">
        <MeshBackdrop />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <SectionHeading overline="Get started" title={`Request a quote for ${title}`} description="Send your requirement and we will reply with an itemised quote within one working day." />
          <Card className="rounded-2xl border-white/10 bg-card/70 p-6 backdrop-blur-xl sm:p-8">
            <LeadCaptureForm compact defaultService={service?.title ?? undefined} />
          </Card>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <SectionHeading overline="Related" title="You may also need" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((item) => {
              const RelIcon = SERVICE_ICONS[String(item.icon)] ?? Sparkles;
              return (
                <Link key={item.id} to={`/services/${item.slug}`} data-testid={`related-service-${item.slug}`}>
                  <Card className="group h-full rounded-2xl border-white/10 bg-card/50 p-5 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[#22D3EE]/40">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#22D3EE]/12 text-[#22D3EE]"><RelIcon className="h-5 w-5" /></span>
                    <h3 className="mt-4 font-heading text-base font-semibold">{item.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.short}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
