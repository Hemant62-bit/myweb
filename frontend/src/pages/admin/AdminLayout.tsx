import type { ReactNode } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAdminSession, useEndSession } from "@/lib/session";
const LINKS = ["leads", "services", "apps", "portfolio", "testimonials", "faqs", "banners", "settings"];
export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useAdminSession();
  const end = useEndSession(); const nav = useNavigate();
  if (isLoading) return <p className="p-8">Loading…</p>;
  if (isError || !data) return <Navigate to="/admin/login" replace />;
  if (data.must_change_password) return <Navigate to="/admin/change-password" replace />;
  return (<div className="min-h-screen"><header className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
    <Link to="/admin" className="font-heading font-bold">HPL Admin</Link>
    {LINKS.map((l) => <Link key={l} to={`/admin/${l}`} className="text-sm capitalize text-muted-foreground hover:text-foreground">{l}</Link>)}
    <Button size="sm" variant="outline" className="ml-auto" onClick={async () => { await end(); nav("/admin/login"); }}>Sign out</Button></header>
    <main className="mx-auto max-w-6xl p-4">{children}</main></div>);
}
