import { Card } from "@/components/ui/card";
import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import { useSeo, useSettings } from "@/lib/content";
export default function Contact() {
  const s = useSettings();
  useSeo({ title: "Contact Us", description: "Get a free quote from HPL Digital Solution & Automation.", path: "/contact" });
  return (<section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:px-8">
    <div><h1 className="font-heading text-4xl font-bold">Contact <span className="gradient-text">HPL</span></h1>
      <p className="mt-4 text-muted-foreground">Call +91 {s.phone} · {s.email} · {s.address}</p></div>
    <Card className="p-6"><LeadCaptureForm /></Card></section>);
}
