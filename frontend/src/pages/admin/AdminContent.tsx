import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ContentCollection, ContentItem } from "@/lib/types";
import AdminLayout from "./AdminLayout";
/** Generic editor: each item is edited as JSON, saved through the admin CRUD API. */
export default function AdminContent({ collection }: { collection: ContentCollection }) {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["content", collection, true], queryFn: () => apiGet<ContentItem[]>(`/content/${collection}?include_inactive=true`) });
  const [editing, setEditing] = useState<{ id?: string; json: string } | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["content"] });
  const save = async () => {
    try {
      const body = JSON.parse(editing!.json);
      if (editing!.id) await apiPut(`/admin/content/${collection}/${editing!.id}`, body);
      else await apiPost(`/admin/content/${collection}`, body);
      toast.success("Saved"); setEditing(null); refresh();
    } catch { toast.error("Invalid JSON or save failed"); }
  };
  return (<AdminLayout><div className="flex items-center justify-between"><h1 className="font-heading text-2xl font-bold capitalize">{collection}</h1>
    <Button size="sm" onClick={() => setEditing({ json: '{\n  "title": "",\n  "slug": "",\n  "order": 0,\n  "active": true\n}' })}>+ New</Button></div>
    {editing && (<div className="mt-4 space-y-3"><Textarea rows={16} className="font-mono text-xs" value={editing.json} onChange={(e) => setEditing({ ...editing, json: e.target.value })} />
      <div className="flex gap-2"><Button onClick={save}>Save</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div></div>)}
    <div className="mt-4 space-y-2">{(data ?? []).map((item) => (<div key={item.id} className="flex items-center justify-between rounded-xl border p-3 text-sm">
      <span>{item.title ?? item.id} {!item.active && <em className="text-muted-foreground">(hidden)</em>}</span>
      <span className="flex gap-3"><button className="text-[#22D3EE]" onClick={() => setEditing({ id: item.id, json: JSON.stringify(item, null, 2) })}>Edit</button>
        <button className="text-red-400" onClick={async () => { if (confirm("Delete?")) { await apiDelete(`/admin/content/${collection}/${item.id}`); refresh(); } }}>Delete</button></span></div>))}</div></AdminLayout>);
}
