import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { DoorClosed, DoorOpen, Fan, Film, Laptop, Lightbulb, Moon, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ROOMS = ["Living Room", "Master Bed", "Office", "Entrance"] as const;
type Room = (typeof ROOMS)[number];
type SceneKey = "movie" | "work" | "sleep" | "away";

interface SceneConfig { key: SceneKey; label: string; icon: typeof Film; brightness: number; fan: number; locked: boolean; motion: boolean; tone: string }

const SCENES: SceneConfig[] = [
  { key: "movie", label: "Movie Night", icon: Film, brightness: 20, fan: 2, locked: true, motion: false, tone: "#F59E0B" },
  { key: "work", label: "Work Mode", icon: Laptop, brightness: 90, fan: 1, locked: false, motion: false, tone: "#22D3EE" },
  { key: "sleep", label: "Sleep Mode", icon: Moon, brightness: 5, fan: 1, locked: true, motion: true, tone: "#7C3AED" },
  { key: "away", label: "Away Security", icon: ShieldCheck, brightness: 0, fan: 0, locked: true, motion: true, tone: "#34D399" },
];

export function InteractiveHomeSimulator() {
  const [room, setRoom] = useState<Room>("Living Room");
  const [brightness, setBrightness] = useState(65);
  const [fanSpeed, setFanSpeed] = useState(2);
  const [locked, setLocked] = useState(true);
  const [motionSensor, setMotionSensor] = useState(false);
  const [activeScene, setActiveScene] = useState<SceneKey | null>(null);

  const power = useMemo(() => {
    const light = (brightness / 100) * 0.09;
    const fan = fanSpeed * 0.028;
    const sensors = motionSensor ? 0.004 : 0;
    return (light + fan + sensors).toFixed(3);
  }, [brightness, fanSpeed, motionSensor]);

  const applyScene = (scene: SceneConfig) => {
    setBrightness(scene.brightness); setFanSpeed(scene.fan); setLocked(scene.locked);
    setMotionSensor(scene.motion); setActiveScene(scene.key);
  };

  const lightOn = brightness > 0;
  const spinDuration = fanSpeed === 0 ? 0 : 1.1 - fanSpeed * 0.3;

  return (
    <div data-testid="home-automation-simulator"
      className="grid grid-cols-1 gap-8 rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl sm:p-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {ROOMS.map((r) => (
            <button key={r} onClick={() => setRoom(r)} aria-pressed={room === r}
              data-testid={`demo-room-${r.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn("min-h-[40px] rounded-full px-4 py-2 text-xs font-medium transition-all duration-200",
                room === r ? "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_0_18px_rgba(37,99,235,0.4)]"
                  : "bg-secondary text-muted-foreground hover:text-foreground")}>
              {r}
            </button>
          ))}
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#070B1C]">
          <motion.div aria-hidden animate={{ opacity: lightOn ? 0.18 + (brightness / 100) * 0.62 : 0.03 }} transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,#FDE68A,transparent_62%)]" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-8">
              <motion.div animate={{ scale: lightOn ? 1 : 0.92 }} transition={{ duration: 0.3 }}
                className="relative grid h-16 w-16 place-items-center rounded-full"
                style={{
                  boxShadow: lightOn ? `0 0 ${20 + brightness * 0.7}px rgba(253,224,71,${0.25 + brightness / 220})` : "none",
                  background: lightOn ? "rgba(253,224,71,0.14)" : "rgba(148,163,184,0.08)",
                }}>
                <Lightbulb className={cn("h-8 w-8 transition-colors duration-300", lightOn ? "text-amber-300" : "text-slate-600")} strokeWidth={1.8} />
              </motion.div>
              <motion.div animate={spinDuration ? { rotate: 360 } : { rotate: 0 }}
                transition={spinDuration ? { repeat: Infinity, ease: "linear", duration: spinDuration } : { duration: 0.3 }} className="text-slate-400">
                <Fan className={cn("h-12 w-12", fanSpeed > 0 && "text-[#22D3EE]")} strokeWidth={1.6} />
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-medium text-slate-200 backdrop-blur">
            {locked ? <DoorClosed className="h-3.5 w-3.5 text-emerald-400" /> : <DoorOpen className="h-3.5 w-3.5 text-red-400" />}
            <span data-testid="demo-door-status">{locked ? "Door locked" : "Door unlocked"}</span>
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-medium text-slate-200 backdrop-blur">
            <Zap className="h-3.5 w-3.5 text-amber-300" /><span data-testid="demo-power-usage">{power} kW</span>
          </div>
          <Badge className="absolute left-3 top-3 bg-black/45 text-[11px] text-slate-200 backdrop-blur" variant="outline">{room}</Badge>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-7">
        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <div className="flex items-center justify-between">
            <Label>Lighting</Label>
            <span className="text-sm font-semibold text-[#22D3EE]" data-testid="demo-brightness-value">{brightness}%</span>
          </div>
          <input type="range" min={0} max={100} value={brightness} aria-label="Light brightness"
            onChange={(e) => { setBrightness(Number(e.target.value)); setActiveScene(null); }} data-testid="demo-brightness-slider"
            className="mt-4 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[#2563EB]"
            style={{ background: `linear-gradient(to right, #2563EB 0%, #22D3EE ${brightness}%, var(--secondary) ${brightness}%)` }} />
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant={lightOn ? "default" : "outline"}
              onClick={() => { setBrightness(lightOn ? 0 : 70); setActiveScene(null); }} data-testid="demo-light-toggle">
              {lightOn ? "Turn lights off" : "Turn lights on"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-background/40 p-4">
            <Label>Smart fan</Label>
            <div className="mt-3 flex gap-2">
              {[0, 1, 2, 3].map((speed) => (
                <button key={speed} onClick={() => { setFanSpeed(speed); setActiveScene(null); }} aria-pressed={fanSpeed === speed}
                  data-testid={`demo-fan-speed-${speed}`}
                  className={cn("h-11 flex-1 rounded-lg text-sm font-semibold transition-all duration-200",
                    fanSpeed === speed ? "bg-gradient-to-r from-[#2563EB] to-[#22D3EE] text-white" : "bg-secondary text-muted-foreground hover:text-foreground")}>
                  {speed === 0 ? "Off" : speed}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-background/40 p-4">
            <Label>RFID door lock</Label>
            <Button variant={locked ? "default" : "destructive"} onClick={() => { setLocked((v) => !v); setActiveScene(null); }}
              data-testid="demo-door-toggle" className="mt-3 w-full gap-2">
              {locked ? <DoorClosed className="h-4 w-4" /> : <DoorOpen className="h-4 w-4" />}
              {locked ? "Locked — tap to unlock" : "Unlocked — tap to lock"}
            </Button>
          </div>
        </div>

        <div>
          <Label>One-tap scenes</Label>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SCENES.map((scene) => (
              <button key={scene.key} onClick={() => applyScene(scene)} aria-pressed={activeScene === scene.key} data-testid={`demo-scene-${scene.key}`}
                className={cn("group flex min-h-[84px] flex-col items-center justify-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all duration-200",
                  activeScene === scene.key ? "border-transparent bg-secondary text-foreground shadow-[0_0_22px_rgba(37,99,235,0.3)]"
                    : "border-white/10 bg-background/40 text-muted-foreground hover:text-foreground")}>
                <scene.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" style={{ color: scene.tone }} />
                {scene.label}
              </button>
            ))}
          </div>
          {motionSensor && (<p className="mt-3 text-xs text-emerald-400" data-testid="demo-motion-status">Motion sensors armed — you get a phone alert on any movement.</p>)}
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</span>;
}
