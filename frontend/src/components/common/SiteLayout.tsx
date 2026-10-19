import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { FloatingWhatsApp } from "@/components/common/FloatingWhatsApp";
import { ScrollProgress } from "@/components/common/ScrollProgress";

export function SiteLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <motion.main key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="pt-[68px]">
        {children}
      </motion.main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export function MeshBackdrop({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -left-20 -top-20 h-[240px] w-[240px] animate-[mesh-drift_18s_ease-in-out_infinite] rounded-full bg-[#2563EB]/25 blur-[90px] sm:h-[420px] sm:w-[420px] sm:blur-[110px]" />
      <div className="absolute right-[-18%] top-8 h-[220px] w-[220px] animate-[mesh-drift_22s_ease-in-out_infinite] rounded-full bg-[#22D3EE]/18 blur-[90px] sm:h-[380px] sm:w-[380px] sm:blur-[120px]" />
      <div className="absolute bottom-[-12%] left-1/4 h-[220px] w-[220px] animate-[mesh-drift_26s_ease-in-out_infinite] rounded-full bg-[#7C3AED]/20 blur-[90px] sm:h-[360px] sm:w-[360px] sm:blur-[120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
    </div>
  );
}
