import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  Treemap,
  XAxis,
  YAxis
} from "recharts";
import type React from "react";
import { Card } from "./ui";

const colors = ["#3b82f6", "#22d3ee", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e"];

export function ChartCard({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <Card className="min-h-[310px]">
      <h3 className="mb-4 text-base font-semibold text-white">{title}</h3>
      <div className="h-64">{children}</div>
    </Card>
  );
}

export function LinePanel({ data, x = "date", y = "kwh" }: { data: any[]; x?: string; y?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(148,163,184,.15)" />
        <XAxis dataKey={x} stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid rgba(143,173,255,.2)" }} />
        <Line type="monotone" dataKey={y} stroke="#22d3ee" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BarPanel({ data, x = "name", y = "value" }: { data: any[]; x?: string; y?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid stroke="rgba(148,163,184,.15)" />
        <XAxis dataKey={x} stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid rgba(143,173,255,.2)" }} />
        <Bar dataKey={y} radius={[4, 4, 0, 0]}>
          {data.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PiePanel({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
          {data.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid rgba(143,173,255,.2)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function AreaPanel({ data, x = "month", y = "kwh" }: { data: any[]; x?: string; y?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <XAxis dataKey={x} stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid rgba(143,173,255,.2)" }} />
        <Area type="monotone" dataKey={y} stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.22} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RadarPanel({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(148,163,184,.18)" />
        <PolarAngleAxis dataKey="name" stroke="#94a3b8" />
        <Radar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.25} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function ScatterPanel({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <CartesianGrid stroke="rgba(148,163,184,.15)" />
        <XAxis dataKey="cpu" stroke="#94a3b8" name="CPU" />
        <YAxis dataKey="temp" stroke="#94a3b8" name="Temp" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "#0b1020", border: "1px solid rgba(143,173,255,.2)" }} />
        <Scatter data={data} fill="#22d3ee" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function TreemapPanel({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap data={data.map((item) => ({ name: item.rack || item.name, size: item.value || 1 }))} dataKey="size" stroke="#05070f" fill="#3b82f6" />
    </ResponsiveContainer>
  );
}

export function Gauge({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative grid h-44 w-44 place-items-center rounded-full border border-cyan-300/30 bg-cyan-300/5">
        <div className="absolute inset-4 rounded-full border-[12px] border-slate-800" />
        <div className="absolute inset-4 rounded-full border-[12px] border-cyan-300" style={{ clipPath: `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)` }} />
        <div className="text-center">
          <div className="text-4xl font-bold text-cyan-200">{value}</div>
          <div className="text-xs text-slate-400">{label}</div>
        </div>
      </div>
    </div>
  );
}
