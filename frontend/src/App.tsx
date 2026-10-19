import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SiteLayout } from "@/components/common/SiteLayout";

const Home = lazy(() => import("@/pages/Home"));
const Services = lazy(() => import("@/pages/Services"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Apps = lazy(() => import("@/pages/Apps"));
const About = lazy(() => import("@/pages/About"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminChangePassword = lazy(() => import("@/pages/admin/AdminChangePassword"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminLeads = lazy(() => import("@/pages/admin/AdminLeads"));
const AdminContent = lazy(() => import("@/pages/admin/AdminContent"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" data-testid="route-loading">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#2563EB] border-t-transparent" />
    </div>
  );
}

function Public({ children }: { children: React.ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}

export default function App() {
  return (
    <>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Public><Home /></Public>} />
          <Route path="/services" element={<Public><Services /></Public>} />
          <Route path="/services/:slug" element={<Public><ServiceDetail /></Public>} />
          <Route path="/apps" element={<Public><Apps /></Public>} />
          <Route path="/about" element={<Public><About /></Public>} />
          <Route path="/portfolio" element={<Public><Portfolio /></Public>} />
          <Route path="/contact" element={<Public><Contact /></Public>} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/change-password" element={<AdminChangePassword />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/admin/services" element={<AdminContent collection="services" />} />
          <Route path="/admin/apps" element={<AdminContent collection="apps" />} />
          <Route path="/admin/portfolio" element={<AdminContent collection="portfolio" />} />
          <Route path="/admin/testimonials" element={<AdminContent collection="testimonials" />} />
          <Route path="/admin/faqs" element={<AdminContent collection="faqs" />} />
          <Route path="/admin/banners" element={<AdminContent collection="banners" />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route path="*" element={<Public><NotFound /></Public>} />
        </Routes>
      </Suspense>
      <Toaster richColors />
    </>
  );
}
