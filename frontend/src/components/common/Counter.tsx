import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

interface CounterProps { to: number; suffix?: string; duration?: number; testId?: string }

export function Counter({ to, suffix = "", duration = 1400, testId }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setValue(to); return; }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration, reduce]);
  return <span ref={ref} data-testid={testId}>{value.toLocaleString("en-IN")}{suffix}</span>;
}
