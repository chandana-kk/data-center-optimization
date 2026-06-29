import { useState } from "react";
import { api } from "../lib/api";
import { money } from "../lib/utils";
import { BarPanel, ChartCard } from "../components/charts";
import { Button, Card, MetricCard, PageHeader } from "../components/ui";

export function Sandbox() {
  const [form, setForm] = useState({ add_servers: 4, remove_servers: 12, cooling_delta_percent: -6, power_delta_percent: -8, migrate_workloads_percent: 18 });
  const [result, setResult] = useState<any>(null);

  async function simulate() {
    setResult(await api("/api/sandbox/simulate", { method: "POST", body: JSON.stringify(form) }));
  }

  return (
    <>
      <PageHeader title="Optimization Sandbox" subtitle="Simulate adding or removing servers, changing cooling, changing power usage, and migrating workloads before applying production changes." />
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card>
          <h3 className="font-semibold">Scenario Controls</h3>
          <div className="mt-5 space-y-4">
            {Object.entries(form).map(([key, value]) => (
              <label key={key} className="block">
                <span className="text-sm text-slate-400">{key.replace(/_/g, " ")}</span>
                <input className="mt-2 w-full accent-cyan-300" type="range" min="-40" max="40" value={value} onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })} />
                <div className="text-sm text-cyan-200">{value}</div>
              </label>
            ))}
          </div>
          <Button className="mt-6 w-full" onClick={simulate}>Run Simulation</Button>
        </Card>
        <div>
          <div className="metric-grid">
            <MetricCard label="Before" value={money(result?.before || 0)} />
            <MetricCard label="After" value={money(result?.after || 0)} tone="cyan" />
            <MetricCard label="Energy Savings" value={money(result?.energySavings || 0)} tone="green" />
            <MetricCard label="Performance Impact" value={`${result?.performanceImpact || 0}%`} tone="amber" />
            <MetricCard label="Carbon Impact" value={`${result?.carbonImpact || 0}t`} tone="green" />
          </div>
          <div className="mt-6">
            <ChartCard title="Before vs After"><BarPanel data={[{ name: "Before", value: result?.before || 0 }, { name: "After", value: result?.after || 0 }, { name: "Savings", value: result?.energySavings || 0 }]} /></ChartCard>
          </div>
        </div>
      </div>
    </>
  );
}
