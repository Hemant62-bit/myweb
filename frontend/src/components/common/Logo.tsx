import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps { tagline?: string; className?: string; compact?: boolean }

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-grid place-items-center", className)}>
      <span aria-hidden className="absolute inset-[-3px] rounded-[14px] opacity-70 blur-[6px] motion-safe:animate-[spin_9s_linear_infinite]"
        style={{ background: "conic-gradient(from 0deg, #2563EB, #22D3EE, #7C3AED, #2563EB)" }} />
      <svg viewBox="0 0 40 40" role="img" aria-label="HPL" className="relative h-full w-full">
        <defs>
          <linearGradient id="hpl-chip" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0E1A2B" /><stop offset="100%" stopColor="#111C2E" /></linearGradient>
          <linearGradient id="hpl-stroke" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#2563EB" /><stop offset="55%" stopColor="#22D3EE" /><stop offset="100%" stopColor="#7C3AED" /></linearGradient>
        </defs>
        <rect x="1.5" y="1.5" width="37" height="37" rx="11" fill="url(#hpl-chip)" />
        <rect x="1.5" y="1.5" width="37" height="37" rx="11" fill="none" stroke="url(#hpl-stroke)" strokeWidth="1.6" />
        <path d="M13.2 12.4a9.6 9.6 0 0 1 13.6 0" fill="none" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        <path d="M16.4 15.4a5.4 5.4 0 0 1 7.2 0" fill="none" stroke="#67E8F9" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
        <path d="M14.5 20v9" stroke="url(#hpl-stroke)" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M25.5 20v9" stroke="url(#hpl-stroke)" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M14.5 24.5h11" stroke="#22D3EE" strokeWidth="2.1" strokeLinecap="round" />
        <circle cx="14.5" cy="19.6" r="1.7" fill="#0A0F1A" stroke="#22D3EE" strokeWidth="1.3" />
        <circle cx="25.5" cy="19.6" r="1.7" fill="#0A0F1A" stroke="#7C3AED" strokeWidth="1.3" />
        <circle cx="20" cy="9.1" r="1.5" fill="#22D3EE" />
      </svg>
    </span>
  );
}

export function Logo({ tagline = "Digital Solution & Automation", className, compact }: LogoProps) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)} data-testid="site-logo">
      <LogoMark className="h-10 w-10 shrink-0 transition-transform duration-300 group-hover:scale-105" />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="font-heading text-xl font-bold tracking-tight">HPL<span className="text-[#22D3EE]">.</span></span>
        {!compact && (
          <span className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{tagline}</span>
        )}
      </span>
    </Link>
  );
}
