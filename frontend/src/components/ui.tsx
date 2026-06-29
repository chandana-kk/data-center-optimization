import { motion } from "framer-motion";
import type React from "react";
import { cn } from "../lib/utils";

export function Button({ className, variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50",
        variant === "primary" && "bg-primary text-white hover:bg-blue-400",
        variant === "secondary" && "border border-border bg-white/7 text-slate-100 hover:bg-white/12",
        variant === "ghost" && "text-slate-300 hover:bg-white/8",
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(34, 211, 238, 0.12)" }}
      transition={{ duration: 0.28 }}
      className={cn("glass rounded-lg p-5 transition-shadow duration-300", className)}
    >
      {children}
    </motion.div>
  );
}

export function MetricCard({ label, value, detail, tone = "blue" }: { label: string; value: string | number; detail?: string; tone?: "blue" | "cyan" | "purple" | "green" | "amber" | "red" }) {
  const tones = {
    blue: "text-blue-300",
    cyan: "text-cyan-300",
    purple: "text-violet-300",
    green: "text-emerald-300",
    amber: "text-amber-300",
    red: "text-rose-300"
  };
  return (
    <Card className="min-h-[118px]">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <div className={cn("mt-3 text-3xl font-bold", tones[tone])}>{value}</div>
      {detail && <p className="mt-2 text-sm text-slate-400">{detail}</p>}
    </Card>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-accent">NeuroDC command center</p>
        <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">{subtitle}</p>
      </div>
      <div className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">Autonomous mode active</div>
    </div>
  );
}
