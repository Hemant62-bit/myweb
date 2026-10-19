import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE, apiDelete, apiGet, apiPatch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { Lead, LeadStatus } from "@/lib/types";
import AdminLayout from "./AdminLayout";
const STATUSES: LeadStatus[] = ["New", "Contacted", "Won", "Lost"];
export default function AdminLeads() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "leads"], queryFn: () => apiGet<Lead[]>("/admin/leads") });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin"] });
  return (<AdminLayout><div className="flex items-center justify-between"><h1 className="font-heading text-2xl font-bold">Leads</h1>
    <a href={`${API_BASE}/admin/leads-export`}><Button variant="outline" size="sm">Export CSV</Button></a></div>
    <div className="mt-4 space-y-3">{(data ?? []).map((l) => (<div key={l.id} className="rounded-xl border p-4 text-sm">
      <div className="flex flex-wrap justify-between gap-2"><b>{l.name}</b><span>{l.phone}</span><span>{l.service}</span>
        <select value={l.status} className="rounded border bg-background px-2" onChange={async (e) => { await apiPatch(`/admin/leads/${l.id}`, { status: e.target.value }); refresh(); }}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <button className="text-red-400" onClick={async () => { if (confirm("Delete lead?")) { await apiDelete(`/admin/leads/${l.id}`); refresh(); } }}>Delete</button></div>
      {l.message && <p className="mt-2 text-muted-foreground">{l.message}</p>}</div>))}
      {data?.length === 0 && <p className="text-muted-foreground">No leads yet.</p>}</div></AdminLayout>);
}
