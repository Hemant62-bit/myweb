import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiPut } from "@/lib/api";
import { useSettings } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SiteSettings } from "@/lib/types";
import AdminLayout from "./AdminLayout";
export default function AdminSettings() {
  const current = useSettings(); const qc = useQueryClient();
  const [form, setForm] = useState<SiteSettings>(current);
  useEffect(() => setForm(current), [current]);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await apiPut("/admin/settings", form); qc.invalidateQueries({ queryKey: ["settings"] }); toast.success("Saved"); }
    catch { toast.error("Save failed"); }
  };
  return (<AdminLayout><h1 className="font-heading text-2xl font-bold">Site settings</h1>
    <form onSubmit={save} className="mt-4 grid max-w-xl gap-3">
      {(Object.keys(form) as (keyof SiteSettings)[]).map((k) => (<label key={k} className="grid gap-1 text-sm capitalize">{k}
        <Input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></label>))}
      <Button type="submit">Save</Button></form></AdminLayout>);
}
