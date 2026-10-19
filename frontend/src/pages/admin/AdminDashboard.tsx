import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { LeadStats } from "@/lib/types";
import AdminLayout from "./AdminLayout";
export default function AdminDashboard() {
  const { data } = useQuery({ queryKey: ["admin", "stats"], queryFn: () => apiGet<LeadStats>("/admin/leads-stats") });
  return (<AdminLayout><h1 className="font-heading text-2xl font-bold">Dashboard</h1>
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      {[["Total leads", data?.total], ["Today", data?.today], ...Object.entries(data?.by_status ?? {})].map(([k, v]) => (
        <div key={String(k)} className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">{k}</p><p className="text-3xl font-bold">{v ?? "–"}</p></div>))}
    </div></AdminLayout>);
}
