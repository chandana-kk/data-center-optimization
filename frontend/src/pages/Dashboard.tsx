import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { money } from "../lib/utils";
import { Gauge, ChartCard, PiePanel } from "../components/charts";
import { MetricCard, PageHeader } from "../components/ui";

type Summary = Record<string, number>;

export function Dashboard() {
  const [summary, setSummary] = useState<Summary>({});
  const [exec, setExec] = useState<Record<string, number>>({});

  useEffect(() => {
    api<Summary>("/api/dashboard/summary").then(setSummary).catch(() => {});
    api<Record<string, number>>("/api/executive").then(setExec).catch(() => {});
  }, []);

  return (
    <>
      <PageHeader title="Executive Operations Dashboard" subtitle="Unified health, sustainability, cost, energy, cooling, and reliability intelligence for enterprise data centers." />
      <div className="metric-grid">
        <MetricCard label="Total Servers" value={summary.totalServers ?? "..."} />
        <MetricCard label="Healthy Servers" value={summary.healthyServers ?? "..."} tone="green" />
        <MetricCard label="Idle Servers" value={summary.idleServers ?? "..."} tone="amber" />
        <MetricCard label="Power Consumption" value={`${summary.powerConsumption ?? "..."} kWh`} tone="cyan" />
        <MetricCard label="Energy Cost" value={money(summary.energyCost)} />
        <MetricCard label="Cooling Cost" value={money(summary.coolingCost)} tone="purple" />
        <MetricCard label="Carbon Emissions" value={`${summary.carbonEmissions ?? "..."} t`} tone="green" />
        <MetricCard label="Renewable Energy" value={`${summary.renewableEnergy ?? "..."}%`} tone="cyan" />
        <MetricCard label="Efficiency Score" value={summary.efficiencyScore ?? "..."} />
        <MetricCard label="Sustainability Score" value={summary.sustainabilityScore ?? "..."} tone="green" />
        <MetricCard label="Monthly Savings" value={money(summary.monthlySavings)} tone="cyan" />
        <MetricCard label="Overall Health" value={`${summary.overallHealth ?? "..."}%`} tone="green" />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <ChartCard title="Infrastructure Health Index"><Gauge value={Math.round(exec.infrastructureHealthIndex || summary.overallHealth || 0)} label="health" /></ChartCard>
        <ChartCard title="Sustainability Mix"><PiePanel data={[{ name: "Renewable", value: summary.renewableEnergy || 48 }, { name: "Grid", value: 100 - (summary.renewableEnergy || 48) }]} /></ChartCard>
        <ChartCard title="Optimization Score"><Gauge value={Math.round(exec.optimizationScore || 89)} label="score" /></ChartCard>
      </div>
    </>
  );
}
