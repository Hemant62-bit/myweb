import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight, BadgeCheck, Bot, Building2, CheckCircle2, Clock, Globe, GraduationCap,
  Headphones, House, type LucideIcon, MessageCircle, Presentation, Quote, ShieldCheck,
  Smartphone, Sparkles, Star, Wallet,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MeshBackdrop } from "@/components/common/SiteLayout";
import { Reveal, SectionHeading, Stagger, StaggerItem } from "@/components/common/Reveal";
import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import { useContent, useSeo, useSettings, organizationSchema } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { DEFAULT_WA_MESSAGE, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { FaqItem, Service, Testimonial } from "@/lib/types";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  Globe, Smartphone, House, Building2, Presentation, GraduationCap, Bot, Sparkles,
};

const TYPED_WORDS = ["Grow Your Business", "Save Your Team Hours", "Win More Customers"];

const PROCESS = [
  { title: "Discuss", text: "A free call to understand the goal, scope and budget — no jargon." },
  { title: "Design", text: "You approve the look and the plan in writing before we build." },
  { title: "Develop", text: "We build in sprints and show you working progress, not status updates." },
  { title: "Deliver", text: "Launch, handover, admin training and all credentials in your name." },
  { title: "Support", text: "Free fixes after launch, then an optional care plan." },
];

const WHY_US = [
  { icon: BadgeCheck, title: "Fixed written quotes", text: "An itemised quote before work starts. No surprise invoices, no scope games." },
  { icon: Clock, title: "Delivery on the promised date", text: "Milestone plan shared on day one and progress demos you can actually see." },
  { icon: Wallet, title: "You own everything", text: "Source code, domain, hosting and store accounts are registered in your name." },
  { icon: Headphones, title: "A human on WhatsApp", text: "Talk to the person who built it — no ticket queues or call centre scripts." },
  { icon: ShieldCheck, title: "Secure by default", text: "HTTPS, validated forms, role-based admin access and encrypted backups." },
  { icon: Sparkles, title: "One team, every need", text: "Web, mobile, automation, decks, AI agents and IT support under one roof." },
];

function TypedHeadline() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) { setText(TYPED_WORDS[0]); return; }
    const word = TYPED_WORDS[index];
    const done = !deleting && text === word;
    const cleared = deleting && text === "";
    const delay = done ? 1800 : cleared ? 240 : deleting ? 36 : 72;
    const timer = setTimeout(() => {
      if (done) setDeleting(true);
      else if (cleared) { setDeleting(false); setIndex((i) => (i + 1) % TYPED_WORDS.length); }
      else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [text, deleting, index, reduce]);

  return (
    <span className="gradient-text" data-testid="hero-typed-headline">
      {text}
      <span className="ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[2px] animate-[caret-blink_1s_step-end_infinite] bg-[#22D3EE] align-middle" />
    </span>
  );
}

export default function Home() {
  const settings = useSettings();
  const { data: services, isError: servicesError } = useContent<Service>("services");
  const { data: testimonials } = useContent<Testimonial>("testimonials");
  const { data: faqs } = useContent<FaqItem>("faqs");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);

  useSeo({
    title: "Website, App & Automation Company in Dewas, Madhya Pradesh",
    description: "HPL Digital Solution & Automation builds websites, mobile apps, home and office automation, corporate presentations, academic projects and custom AI agents. Get a free quote today.",
    path: "/",
    jsonLd: organizationSchema(settings),
  });

  const list = services ?? [];
  const reviews = testimonials ?? [];

  useEffect(() => {
    if (reviews.length < 2) return;
    const timer = setInterval(() => setSlide((s) => (s + 1) % reviews.length), 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20">
        <MeshBackdrop />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="hero-pill" data-testid="hero-badge">Trusted by businesses, schools &amp; students across Madhya Pradesh</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 font-heading text-[2rem] font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                We Build Digital & Automation Solutions That <TypedHeadline />
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Websites, mobile apps, smart home and office automation, corporate presentations, academic projects and custom AI agents — designed, built and supported by one accountable team.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/contact" data-testid="hero-quote-cta"
                  className={cn(buttonVariants({ size: "lg" }), "tap-cta gap-2 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white transition-transform duration-200 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]")}>
                  Get Free Quote <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={whatsappLink(settings.whatsapp, DEFAULT_WA_MESSAGE)} target="_blank" rel="noopener noreferrer" data-testid="hero-whatsapp-cta"
                  className={cn(buttonVariants({ size: "lg", variant: "outline" }), "tap-cta gap-2 border-[#25D366]/40 text-[#25D366] transition-transform duration-200 hover:scale-[1.03] hover:bg-[#25D366]/10")}>
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4" data-testid="hero-highlights">
                {[
                  { icon: BadgeCheck, label: "Fixed written quotes" },
                  { icon: Clock, label: "Delivery on the promised date" },
                  { icon: Wallet, label: "You own the source code" },
                  { icon: Headphones, label: "Support after launch" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-card/50 p-4 backdrop-blur-sm" data-testid={`hero-highlight-${item.label}`}>
                    <item.icon className="h-5 w-5 text-[#22D3EE]" />
                    <p className="mt-2.5 text-xs font-medium leading-snug text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="relative lg:col-span-5">
            <Reveal delay={0.18}>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 motion-safe:animate-[glow-breathe_5s_ease-in-out_infinite]">
                <img src={IMAGES.heroVisual} alt="Smart automation control dashboard with lighting, fan and door-lock controls"
                  width={1264} height={848} loading="eager" fetchPriority="high" decoding="async" className="aspect-[4/3] w-full object-cover" />
                <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A1016] via-transparent to-transparent" />
                <span aria-hidden className="shimmer-overlay pointer-events-none absolute inset-0 overflow-hidden" />
              </div>
            </Reveal>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:absolute lg:-bottom-6 lg:-left-6 lg:mt-0 lg:w-[66%] lg:grid-cols-1 lg:gap-3">
              {[
                { icon: House, title: "Smart Home Live", text: "Lights, fan & door lock — one tap", tone: "#22D3EE", delay: 0 },
                { icon: Globe, title: "Fast & SEO-ready", text: "Hand-coded, mobile-first builds", tone: "#2563EB", delay: 0.6 },
                { icon: Bot, title: "AI Agents", text: "Answering customers 24/7", tone: "#7C3AED", delay: 1.2 },
              ].map((card) => (
                <motion.div key={card.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.1 + card.delay * 0.2 }}
                  className="motion-safe:lg:animate-[drift-y_6s_ease-in-out_infinite]" style={{ animationDelay: `${card.delay}s` }}>
                  <Card className="gradient-border rounded-2xl p-3.5 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `${card.tone}22`, color: card.tone }}>
                        <card.icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-heading text-sm font-semibold">{card.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{card.text}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="services">
        <SectionHeading overline="What we do" title="Eight services, one accountable team" description="Pick what you need today — we handle the rest when you are ready to grow." />
        {servicesError && (
          <p className="mt-6 text-sm text-muted-foreground" data-testid="services-offline-note">
            Service list is temporarily unavailable. Call {settings.phone} and we will walk you through it.
          </p>
        )}
        <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((service) => {
            const Icon = SERVICE_ICONS[String(service.icon)] ?? Sparkles;
            return (
              <StaggerItem key={service.id}>
                <Link to={`/services/${service.slug}`} data-testid={`service-card-${service.slug}`}>
                  <Card className="group h-full rounded-2xl border-white/10 bg-card/60 p-6 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[#2563EB]/50 hover:shadow-[0_18px_44px_rgba(37,99,235,0.18)]">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#2563EB]/20 to-[#7C3AED]/20 text-[#22D3EE] transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 font-heading text-lg font-semibold">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#22D3EE]">
                      Explore <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Card>
                </Link>
              </StaggerItem>
            );
          })}
          {list.length === 0 && !servicesError && (
            <>{[0, 1, 2, 3, 4, 5].map((i) => (<div key={i} className="h-56 animate-pulse rounded-2xl border border-white/10 bg-card/40" />))}</>
          )}
        </Stagger>
      </section>

      {/* AUTOMATION SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <div className="group relative overflow-hidden rounded-2xl border border-white/10">
              <img src={IMAGES.automationShowcase} alt="Smart automation in a modern living room: dimmed cove lighting, motorised curtains and a glowing wall control panel"
                width={1264} height={848} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#0A1016]/70 via-transparent to-transparent" />
            </div>
          </Reveal>
          <div className="lg:col-span-6">
            <SectionHeading overline="Automation, made simple" title="Your home and office, under one tap"
              description="Retrofit smart control into the building you already have — no rewiring, no broken walls. Lights, fans, curtains, locks and cameras in one app, with scenes and schedules doing the routine for you." />
            <ul className="mt-7 space-y-3">
              {[
                "Works with your existing switchboards and manual switches",
                "Voice control through Alexa and Google Home",
                "One-tap scenes: Movie Night, Work Mode, Sleep, Away Security",
                "Installed and serviced by our own technicians",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#22D3EE]" />{point}
                </li>
              ))}
            </ul>
            <Link to="/services/home-automation" data-testid="showcase-automation-cta"
              className={cn(buttonVariants({ variant: "outline" }), "tap-cta mt-7 gap-2 border-[#22D3EE]/40 text-[#22D3EE] hover:bg-[#22D3EE]/10")}>
              Try the live demo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="relative overflow-hidden bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading overline="Why choose HPL" title="Built like engineers, run like a service business"
            description="The things clients tell us matter most — written quotes, honest timelines and someone who answers the phone." />
          <Stagger className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((item) => (
              <StaggerItem key={item.title}>
                <div className="flex h-full gap-4 rounded-2xl border border-white/10 bg-background/40 p-5 transition-colors duration-300 hover:border-[#22D3EE]/40">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#22D3EE]/12 text-[#22D3EE]"><item.icon className="h-5 w-5" /></span>
                  <div>
                    <h3 className="font-heading text-base font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading overline="How we work" title="Discuss → Design → Develop → Deliver → Support" description="Five stages, each with something you can see and sign off." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl border border-white/10 bg-card/50 p-5">
                <span className="font-heading text-3xl font-bold text-[#2563EB]/35">0{i + 1}</span>
                <h3 className="mt-2 font-heading text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                {i < PROCESS.length - 1 && (<span className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-[#2563EB] to-transparent lg:block" />)}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      {reviews.length > 0 && (
        <section className="relative overflow-hidden bg-card/30 py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionHeading align="center" overline="Client words" title="What our clients say" />
            <div className="mt-10" data-testid="testimonials-slider">
              <motion.div key={reviews[slide]?.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
                className="rounded-2xl border border-white/10 bg-background/50 p-7 text-center backdrop-blur-sm sm:p-10">
                <Quote className="mx-auto h-8 w-8 text-[#2563EB]/50" />
                <div className="mt-4 flex justify-center gap-1">
                  {Array.from({ length: Number(reviews[slide]?.rating ?? 5) }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />))}
                </div>
                <p className="mt-5 text-base leading-relaxed text-foreground/90 sm:text-lg">“{reviews[slide]?.text}”</p>
                <p className="mt-5 font-heading text-sm font-semibold">{reviews[slide]?.title}</p>
                <p className="text-xs text-muted-foreground">{reviews[slide]?.role}</p>
              </motion.div>
              <div className="mt-6 flex justify-center gap-1">
                {reviews.map((review, i) => (
                  <button key={review.id} onClick={() => setSlide(i)} aria-label={`Show testimonial ${i + 1}`} data-testid={`testimonial-dot-${i}`}
                    data-compact="true" className="group grid h-11 w-8 place-items-center">
                    <span className={cn("h-2 rounded-full transition-all duration-300", i === slide ? "w-7 bg-[#22D3EE]" : "w-2 bg-muted-foreground/40 group-hover:bg-muted-foreground")} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading align="center" overline="FAQ" title="Questions we hear often" />
        <div className="mt-10 space-y-3" data-testid="home-faq-list">
          {(faqs ?? []).map((faq) => {
            const open = openFaq === faq.id;
            return (
              <div key={faq.id} className="overflow-hidden rounded-xl border border-white/10 bg-card/50">
                <button onClick={() => setOpenFaq(open ? null : faq.id)} aria-expanded={open} data-testid={`faq-toggle-${faq.id}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium transition-colors hover:text-[#22D3EE]">
                  {faq.title}
                  <ArrowRight className={cn("h-4 w-4 shrink-0 transition-transform duration-300", open && "rotate-90 text-[#22D3EE]")} />
                </button>
                <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.text}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT */}
      <section className="relative overflow-hidden py-20" id="contact">
        <MeshBackdrop />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading overline="Start a project" title="Tell us what you need. Get a written quote in 24 hours."
              description="Fill this in and we will save your enquiry and open WhatsApp with the details already typed out, so nothing gets lost." />
            <ul className="mt-8 space-y-3">
              {["Free 30-minute requirement call", "Itemised quote with fixed timeline", "No obligation, no pushy follow-ups"].map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />{point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={`tel:+91${settings.phone}`} data-testid="home-call-cta"><Button variant="outline" className="w-full gap-2 sm:w-auto">Call +91 {settings.phone}</Button></a>
              <a href={`mailto:${settings.email}`} data-testid="home-email-cta"><Button variant="ghost" className="w-full gap-2 sm:w-auto">{settings.email}</Button></a>
            </div>
          </div>
          <Reveal>
            <Card className="rounded-2xl border-white/10 bg-card/70 p-6 backdrop-blur-xl sm:p-8"><LeadCaptureForm compact /></Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
