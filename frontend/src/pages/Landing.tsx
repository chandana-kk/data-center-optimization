import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, CloudCog, Leaf, ShieldCheck, Zap } from "lucide-react";
import { Button, Card } from "../components/ui";

const features = [
  ["Reduce Energy", Zap],
  ["Lower Costs", CloudCog],
  ["Improve Sustainability", Leaf],
  ["Predict Failures", ShieldCheck],
  ["Optimize Cloud Infrastructure", BrainCircuit]
] as const;

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <section
        className="relative min-h-[92vh] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(90deg, rgba(5,7,15,.96), rgba(5,7,15,.78), rgba(5,7,15,.45)), url(https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=80)" }}
      >
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12">
          <div className="text-xl font-bold text-white">NeuroDC</div>
          <Link to="/login" className="text-sm text-slate-200 hover:text-white">Sign in</Link>
        </nav>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-6 pb-20 pt-16 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Autonomous data center intelligence</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-tight text-white md:text-7xl">AI Powered Data Center Optimization</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Reduce Energy. Lower Costs. Improve Sustainability. Predict Failures. Optimize Cloud Infrastructure.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login"><Button>Get Started <ArrowRight size={18} /></Button></Link>
              <Link to="/dashboard"><Button variant="secondary">Live Demo</Button></Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 lg:px-12">
          <div className="grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-5">
            {features.map(([label, Icon]) => (
              <div key={label} className="glass rounded-lg p-4">
                <Icon className="mb-3 text-cyan-200" size={22} />
                <div className="text-sm font-semibold text-white">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid gap-4 md:grid-cols-4">
          {[["18%", "Energy reduction"], ["$2.8M", "Annualized savings"], ["91", "Health score"], ["512t", "CO2 saved"]].map(([value, label]) => (
            <Card key={label}><div className="text-4xl font-bold text-cyan-200">{value}</div><div className="mt-2 text-sm text-slate-400">{label}</div></Card>
          ))}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <Card>
            <h2 className="text-2xl font-bold">Architecture Diagram</h2>
            <div className="mt-6 grid gap-3 text-sm md:grid-cols-4">
              {["React Console", "FastAPI Gateway", "ML Analytics", "PostgreSQL"].map((item, i) => (
                <div key={item} className="rounded-md border border-border bg-white/5 p-4">
                  <div className="text-cyan-200">0{i + 1}</div>
                  <div className="mt-2 font-semibold">{item}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="text-2xl font-bold">Trusted by operators</h2>
            <p className="mt-4 text-slate-300">“NeuroDC turns telemetry noise into a precise plan for energy, resilience, and sustainability.”</p>
            <p className="mt-4 text-sm text-slate-500">VP Infrastructure, Global SaaS Enterprise</p>
          </Card>
        </div>
      </section>
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-slate-500">NeuroDC · Autonomous optimization for enterprise data centers</footer>
    </div>
  );
}
