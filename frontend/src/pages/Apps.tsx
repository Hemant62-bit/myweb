import { Card } from "@/components/ui/card";
import { useContent, useSeo } from "@/lib/content";
import { formatINR } from "@/lib/site";
import type { AppProduct } from "@/lib/types";
export default function Apps() {
  const { data } = useContent<AppProduct>("apps");
  useSeo({ title: "Apps", description: "Ready-made apps by HPL Digital.", path: "/apps" });
  return (<section className="mx-auto max-w-7xl px-4 py-16 lg:px-8"><h1 className="font-heading text-4xl font-bold">Our Apps</h1>
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {(data ?? []).map((a) => (<Card key={a.id} className="p-6"><h2 className="font-heading text-lg font-semibold">{a.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{a.short}</p>{a.price ? <p className="mt-3 font-semibold">{formatINR(a.price)}</p> : null}</Card>))}
      {data?.length === 0 && <p className="text-muted-foreground">Apps coming soon.</p>}</div></section>);
}
