import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps { children: ReactNode; delay?: number; className?: string; y?: number }

export function Reveal({ children, delay = 0, className, y = 22 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduce ? 0.2 : 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

interface StaggerProps { children: ReactNode; className?: string }

export function Stagger({ children, className }: StaggerProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.08 } } }}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: StaggerProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}>
      {children}
    </motion.div>
  );
}

interface SectionHeadingProps { overline?: string; title: ReactNode; description?: string; align?: "left" | "center"; className?: string }

export function SectionHeading({ overline, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {overline && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">{overline}</p>}
      <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>}
    </Reveal>
  );
}
