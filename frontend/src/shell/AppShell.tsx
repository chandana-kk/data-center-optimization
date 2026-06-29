import { Outlet, NavLink } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Bot,
  Boxes,
  BrainCircuit,
  CloudCog,
  Cpu,
  Fan,
  FileText,
  HardDrive,
  LayoutDashboard,
  Network,
  Settings,
  ShieldAlert,
  Zap
} from "lucide-react";

const nav = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Infrastructure", "/infrastructure", Cpu],
  ["Energy", "/energy", Zap],
  ["Cooling", "/cooling", Fan],
  ["Network", "/network", Network],
  ["Storage", "/storage", HardDrive],
  ["Cloud Optimization", "/optimization", BarChart3],
  ["AI Recommendations", "/ai-recommendations", BrainCircuit],
  ["Predictions", "/predictions", ShieldAlert],
  ["Reports", "/reports", FileText],
  ["Optimization Sandbox", "/sandbox", CloudCog],
  ["Digital Twin", "/digital-twin", Boxes],
  ["AI Chatbot", "/chatbot", Bot],
  ["Settings", "/settings", Settings]
] as const;

export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-[#070b16]/95 p-4 backdrop-blur-xl lg:block">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-cyan-300/15 text-cyan-200">
            <Activity size={22} />
          </div>
          <div>
            <div className="text-lg font-bold">NeuroDC</div>
            <div className="text-xs text-slate-400">Autonomous optimization</div>
          </div>
        </div>
        <nav className="space-y-1">
          {nav.map(([label, to, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${isActive ? "bg-primary/18 text-white" : "text-slate-400 hover:bg-white/7 hover:text-white"}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-[#070b16]/85 px-4 py-3 backdrop-blur-xl lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">Enterprise command plane</div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-md border border-border px-3 py-1.5 text-xs text-slate-300 md:block">Ashburn Region · Live</div>
              <div className="h-9 w-9 rounded-md bg-gradient-to-br from-primary to-accent" />
            </div>
          </div>
        </header>
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
