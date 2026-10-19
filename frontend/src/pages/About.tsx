import { useSeo } from "@/lib/content";
import { IMAGES } from "@/lib/images";
export default function About() {
  useSeo({ title: "About Us", description: "About HPL Digital Solution & Automation, Dewas, Madhya Pradesh.", path: "/about" });
  return (<section className="mx-auto max-w-4xl px-4 py-16">
    <h1 className="font-heading text-4xl font-bold">About <span className="gradient-text">HPL</span></h1>
    <p className="mt-5 leading-relaxed text-muted-foreground">HPL Digital Solution & Automation builds websites, apps, home and office automation, presentations, school/college projects and AI agents for businesses across India.</p>
    <img src={IMAGES.workspaceTeam} alt="HPL team" className="mt-8 w-full rounded-2xl" onError={(e) => (e.currentTarget.style.display = "none")} />
  </section>);
}
