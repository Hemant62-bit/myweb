import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiPost } from "@/lib/api";
import type { AdminOut } from "@/lib/types";
export default function AdminLogin() {
  const [username, setU] = useState(""); const [password, setP] = useState("");
  const nav = useNavigate(); const qc = useQueryClient();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const a = await apiPost<AdminOut>("/auth/login", { username, password });
      qc.setQueryData(["admin", "me"], a);
      nav(a.must_change_password ? "/admin/change-password" : "/admin");
    } catch { toast.error("Invalid username or password"); }
  };
  return (<div className="grid min-h-screen place-items-center px-4"><form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border p-6">
    <h1 className="font-heading text-2xl font-bold">Admin Login</h1>
    <Input placeholder="Username" value={username} onChange={(e) => setU(e.target.value)} required />
    <Input type="password" placeholder="Password" value={password} onChange={(e) => setP(e.target.value)} required />
    <Button type="submit" className="w-full">Sign in</Button></form></div>);
}
