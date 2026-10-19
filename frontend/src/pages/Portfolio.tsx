import { Card } from "@/components/ui/card";
import { useContent, useSeo } from "@/lib/content";
import type { PortfolioItem } from "@/lib/types";
export default function Portfolio() {
  const { data } = useContent<PortfolioItem>("portfolio");
  useSeo({ title: "Portfolio", description: "Projects delivered by HPL Digital.", path: "/portfolio" });
  return (<section className="mx-auto max-w-7xl px-4 py-16 lg:px-8"><h1 className="font-heading text-4xl font-bold">Portfolio</h1>
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {(data ?? []).map((p) => (<Card key={p.id} className="p-6"><h2 className="font-heading font-semibold">{p.title}</h2>
        <p className="mt-1 text-xs text-[#22D3EE]">{p.category}</p><p className="mt-2 text-sm text-muted-foreground">{p.summary}</p></Card>))}
      {data?.length === 0 && <p className="text-muted-foreground">Projects will appear here.</p>}</div></section>);
}
