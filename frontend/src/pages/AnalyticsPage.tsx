import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { AreaPanel, BarPanel, ChartCard, LinePanel, PiePanel, RadarPanel, ScatterPanel, TreemapPanel } from "../components/charts";
import { Card, MetricCard, PageHeader } from "../components/ui";
import { money } from "../lib/utils";

const pageMeta: Record<string, [string, string]> = {
  infrastructure: ["Infrastructure Analytics", "CPU, GPU, RAM, disk, server health, rack utilization, VM utilization, and thermal heatmaps."],
  energy: ["Energy Optimization", "Power usage, peak hours, forecasts, idle server detection, electricity cost, and saving recommendations."],
  cooling: ["Cooling Intelligence", "Temperature heatmaps, hotspots, fan speed, airflow, humidity, and cooling efficiency recommendations."],
  network: ["Network Analytics", "Latency, bandwidth, unused network paths, congestion risk, and workload movement opportunities."],
  storage: ["Storage Analytics", "Unused storage, disk risk, capacity trend, data growth, and archive recommendations."],
  recommendations: ["AI Optimization Advisor", "Autonomous LLM-style recommendations with cost savings and carbon reduction estimates."],
  predictions: ["Server Failure Prediction", "Machine learning risk scores for server, disk, memory, and overheating failures."],
  cloud: ["Cloud Resource Optimization", "Idle VMs, unused storage, load balancers, databases, rightsizing, and cloud cost savings."]
};

export function AnalyticsPage({ type }: { type: string }) {
  const [data, setData] = useState<any>({});
  const [extras, setExtras] = useState<any>({});
  const [recs, setRecs] = useState<any[]>([]);
  const [title, subtitle] = pageMeta[type] || pageMeta.infrastructure;

  useEffect(() => {
    const endpoint =
      type === "infrastructure" ? "/api/infrastructure/analytics" :
      type === "energy" ? "/api/energy/analytics" :
      type === "cooling" ? "/api/cooling/analytics" :
      type === "predictions" ? "/api/predictions/failures" :
      type === "cloud" ? "/api/optimization/cloud" :
      type === "recommendations" ? "/api/recommendations" :
      "/api/extras";
    api<any>(endpoint).then((payload) => Array.isArray(payload) ? setRecs(payload) : setData(payload)).catch(() => {});
    api<any>("/api/extras").then(setExtras).catch(() => {});
    api<any[]>("/api/recommendations").then(setRecs).catch(() => {});
  }, [type]);

  const synthetic = useMemo(() => Array.from({ length: 24 }, (_, i) => ({ name: `${i}:00`, value: Math.round(40 + Math.sin(i / 2) * 22 + i), cpu: 30 + i * 2, temp: 22 + Math.sin(i) * 7 + i / 3 })), []);

  if (type === "predictions") {
    return (
      <>
        <PageHeader title={title} subtitle={subtitle} />
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Critical Risks" value={(data.risks || []).filter((r: any) => r.riskScore > 80).length} tone="red" />
          <MetricCard label="Model Confidence" value="91%" tone="cyan" />
          <MetricCard label="Maintenance Windows" value="12" tone="amber" />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {(data.risks || []).map((risk: any) => <Card key={risk.server}><div className="flex justify-between"><h3 className="font-semibold">{risk.server}</h3><span className="text-rose-300">{risk.riskScore}%</span></div><p className="mt-2 text-sm text-slate-400">{risk.failureType}</p><p className="mt-3 text-sm text-slate-300">{risk.maintenance}</p></Card>)}
        </div>
      </>
    );
  }

  if (type === "cloud") {
    return (
      <>
        <PageHeader title={title} subtitle={subtitle} />
        <div className="metric-grid">
          <MetricCard label="Idle Virtual Machines" value={data.idleVirtualMachines} />
          <MetricCard label="Unused Storage" value={`${data.unusedStorageTb} TB`} tone="amber" />
          <MetricCard label="Unused Load Balancers" value={data.unusedLoadBalancers} />
          <MetricCard label="Unused Databases" value={data.unusedDatabases} tone="purple" />
          <MetricCard label="Rightsizing Recommendations" value={data.rightsizingRecommendations} tone="cyan" />
          <MetricCard label="Cloud Cost Savings" value={money(data.cloudCostSavings)} tone="green" />
        </div>
        <Recommendations recs={recs} />
      </>
    );
  }

  if (type === "recommendations") {
    return (
      <>
        <PageHeader title={title} subtitle={subtitle} />
        <Recommendations recs={recs} />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <ChartCard title="Community Intelligence Similarity"><BarPanel data={extras.communityIntelligence || []} x="case" y="similarity" /></ChartCard>
          <ChartCard title="Workload DNA Confidence"><RadarPanel data={(extras.workloadDna || []).map((x: any) => ({ name: x.pattern, value: x.confidence }))} /></ChartCard>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      {type === "energy" && (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard title="Power Usage"><LinePanel data={data.dailyPower || []} /></ChartCard>
            <ChartCard title="Peak Hours"><BarPanel data={data.peakHours || []} /></ChartCard>
            <ChartCard title="Energy Forecast"><AreaPanel data={data.forecast || []} /></ChartCard>
            <ChartCard title="Renewable Scheduler"><BarPanel data={extras.renewableScheduler || []} x="hour" y="solar" /></ChartCard>
          </div>
          <Recommendations recs={recs.filter((r) => r.category === "energy")} />
        </>
      )}
      {type === "cooling" && (
        <>
          <div className="metric-grid">
            <MetricCard label="Cooling Efficiency" value={`${data.coolingEfficiency || 0}%`} tone="cyan" />
            <MetricCard label="Fan Speed" value={`${data.fanSpeed || 0}%`} />
            <MetricCard label="Humidity" value={`${data.humidity || 0}%`} tone="purple" />
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <ChartCard title="Temperature Heatmap"><TreemapPanel data={data.temperatureHeatmap || []} /></ChartCard>
            <ChartCard title="Hotspots"><BarPanel data={(data.hotspots || []).map((x: any) => ({ name: x.zone, value: x.temp }))} /></ChartCard>
          </div>
          <Recommendations recs={recs.filter((r) => r.category === "cooling")} />
        </>
      )}
      {type === "infrastructure" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard title="Resource Utilization"><PiePanel data={data.utilization || []} /></ChartCard>
          <ChartCard title="Rack Utilization Heatmap"><TreemapPanel data={data.rackUtilization || []} /></ChartCard>
          <ChartCard title="VM Utilization"><BarPanel data={data.vmUtilization || []} /></ChartCard>
          <ChartCard title="CPU vs Temperature"><ScatterPanel data={data.heatmap || synthetic} /></ChartCard>
        </div>
      )}
      {(type === "network" || type === "storage") && (
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard title={type === "network" ? "Latency Pattern" : "Capacity Growth"}><LinePanel data={synthetic} x="name" y="value" /></ChartCard>
          <ChartCard title={type === "network" ? "Bandwidth by Hour" : "Unused Storage by Tier"}><BarPanel data={synthetic} /></ChartCard>
          <ChartCard title="Hidden Energy Leak Detection"><BarPanel data={Object.entries(extras.leaks || {}).map(([name, value]) => ({ name, value }))} /></ChartCard>
          <ChartCard title="Disaster Readiness"><RadarPanel data={Object.entries(extras.disasterReadiness || {}).map(([name, value]) => ({ name, value }))} /></ChartCard>
        </div>
      )}
    </>
  );
}

function Recommendations({ recs }: { recs: any[] }) {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      {recs.map((rec) => (
        <Card key={rec.title}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">{rec.title}</h3>
            <span className="rounded-md bg-cyan-300/10 px-2 py-1 text-xs text-cyan-200">{rec.impact}</span>
          </div>
          <p className="mt-3 text-sm text-slate-400">{rec.message}</p>
          <div className="mt-4 text-sm text-emerald-300">{money(rec.savingsUsd)} · {rec.carbonReductionTons}t CO2</div>
        </Card>
      ))}
    </div>
  );
}
