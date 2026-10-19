import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiPost } from "@/lib/api";
import type { AdminOut } from "@/lib/types";
export default function AdminChangePassword() {
  const [cur, setCur] = useState(""); const [next, setNext] = useState("");
  const nav = useNavigate(); const qc = useQueryClient();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const a = await apiPost<AdminOut>("/auth/change-password", { current_password: cur, new_password: next });
      qc.setQueryData(["admin", "me"], a); toast.success("Password changed"); nav("/admin");
    } catch { toast.error("Could not change password (min 8 characters, must differ)"); }
  };
  return (<div className="grid min-h-screen place-items-center px-4"><form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border p-6">
    <h1 className="font-heading text-2xl font-bold">Change password</h1>
    <Input type="password" placeholder="Current password" value={cur} onChange={(e) => setCur(e.target.value)} required />
    <Input type="password" placeholder="New password" value={next} onChange={(e) => setNext(e.target.value)} minLength={8} required />
    <Button type="submit" className="w-full">Update</Button></form></div>);
}
