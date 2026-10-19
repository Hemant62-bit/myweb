import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MeshBackdrop } from "@/components/common/SiteLayout";
import { Reveal, Stagger, StaggerItem } from "@/components/common/Reveal";
import { SERVICE_ICONS } from "@/pages/Home";
import { useContent, useSeo } from "@/lib/content";
import { formatINR } from "@/lib/site";
import type { Package, Service } from "@/lib/types";

export default function Services() {
  const { data: services, isError } = useContent<Service>("services");
  useSeo({
    title: "Our Services — Web, Apps, Automation & AI",
    description: "Explore HPL Digital services: website making, app development, home and office automation, presentation design, school and college projects, AI agents and other digital services with transparent INR pricing.",
    path: "/services",
  });
  const list = services ?? [];
  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-20">
        <MeshBackdrop />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="hero-pill">Services</p>
            <h1 className="mt-5 max-w-3xl font-heading text-[2rem] font-bold leading-[1.15] tracking-tight sm:text-5xl">
              Everything digital your business needs, <span className="gradient-text">under one roof</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Eight focused service lines with starting prices published up front. Every package is customisable — tell us your requirement and we will quote precisely.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {isError && (<p className="text-sm text-muted-foreground" data-testid="services-error-note">We could not load the service list right now. Please call 9074520224 — we will help directly.</p>)}
        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((service) => {
            const Icon = SERVICE_ICONS[String(service.icon)] ?? Sparkles;
            const packages = (service.packages ?? []) as Package[];
            const from = packages.length ? Math.min(...packages.map((p) => p.price)) : null;
            return (
              <StaggerItem key={service.id}>
                <Link to={`/services/${service.slug}`} data-testid={`services-page-card-${service.slug}`}>
                  <Card className="group flex h-full flex-col rounded-2xl border-white/10 bg-card/60 p-6 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[#2563EB]/50 hover:shadow-[0_18px_44px_rgba(37,99,235,0.18)]">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#2563EB]/20 to-[#7C3AED]/20 text-[#22D3EE] transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="mt-5 font-heading text-lg font-semibold">{service.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      {from !== null ? (
                        <span className="text-sm"><span className="text-muted-foreground">From </span><span className="font-heading font-semibold text-foreground">{formatINR(from)}</span></span>
                      ) : (<span className="text-sm text-muted-foreground">Custom quote</span>)}
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#22D3EE]">
                        View <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Card>
                </Link>
              </StaggerItem>
            );
          })}
          {list.length === 0 && !isError && (<>{[0, 1, 2, 3, 4, 5].map((i) => (<div key={i} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-card/40" />))}</>)}
        </Stagger>
      </section>
    </>
  );
}
