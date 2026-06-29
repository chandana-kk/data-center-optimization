from __future__ import annotations

from collections import defaultdict
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from app.repositories import AnalyticsRepository


def _logs_frame(repo: AnalyticsRepository) -> pd.DataFrame:
    rows = [
        {
            "server_id": log.server_id,
            "cpu": log.cpu_usage,
            "gpu": log.gpu_usage,
            "ram": log.ram_usage,
            "disk": log.disk_usage,
            "temp": log.temperature_c,
            "power": log.power_kw,
            "latency": log.latency_ms,
            "bandwidth": log.bandwidth_gbps,
            "fan": log.fan_speed,
            "humidity": log.humidity,
            "hour": log.timestamp.hour,
        }
        for log in repo.recent_logs()
    ]
    return pd.DataFrame(rows)


class AnalyticsService:
    def __init__(self, repo: AnalyticsRepository):
        self.repo = repo

    def dashboard_summary(self) -> dict:
        df = _logs_frame(self.repo)
        if df.empty:
            return {}
        total_power = float(df["power"].sum())
        energy_cost = total_power * 0.13
        cooling_cost = energy_cost * 0.38
        carbon = total_power * 0.00038
        efficiency = max(0, 100 - (df["temp"].mean() - 22) * 2 - (df["latency"].mean() / 20))
        sustainability = max(0, 55 + (self.repo.data_center().renewable_percent if self.repo.data_center() else 42) * 0.35 - carbon / 100)
        return {
            "totalServers": self.repo.server_count(),
            "healthyServers": self.repo.healthy_count(),
            "idleServers": self.repo.idle_count(),
            "powerConsumption": round(total_power, 2),
            "energyCost": round(energy_cost, 2),
            "coolingCost": round(cooling_cost, 2),
            "carbonEmissions": round(carbon, 2),
            "renewableEnergy": round(self.repo.data_center().renewable_percent if self.repo.data_center() else 42, 1),
            "efficiencyScore": round(efficiency, 1),
            "sustainabilityScore": round(sustainability, 1),
            "monthlySavings": round(energy_cost * 0.18 + cooling_cost * 0.22, 2),
            "overallHealth": round((self.repo.healthy_count() / max(1, self.repo.server_count())) * 100, 1),
        }

    def infrastructure(self) -> dict:
        df = _logs_frame(self.repo)
        grouped = df.groupby("server_id").mean(numeric_only=True).reset_index().head(40) if not df.empty else pd.DataFrame()
        return {
            "utilization": [
                {"name": "CPU", "value": round(float(df.cpu.mean()), 1)},
                {"name": "GPU", "value": round(float(df.gpu.mean()), 1)},
                {"name": "RAM", "value": round(float(df.ram.mean()), 1)},
                {"name": "Disk", "value": round(float(df.disk.mean()), 1)},
            ] if not df.empty else [],
            "heatmap": grouped.to_dict("records") if not grouped.empty else [],
            "rackUtilization": self._rack_utilization(df),
            "vmUtilization": [{"name": f"vm-{i}", "value": int(v)} for i, v in enumerate(np.clip(np.random.normal(62, 18, 18), 3, 98), 1)],
        }

    def energy(self) -> dict:
        df = _logs_frame(self.repo)
        hourly = df.groupby("hour")["power"].sum().reset_index() if not df.empty else pd.DataFrame()
        return {
            "dailyPower": [{"date": d, "kwh": p} for d, p in self.repo.daily_power()],
            "peakHours": hourly.rename(columns={"hour": "name", "power": "value"}).to_dict("records") if not hourly.empty else [],
            "forecast": [{"month": f"M+{i}", "kwh": round(84000 + i * 1600 + np.sin(i) * 4200, 0)} for i in range(1, 13)],
            "recommendations": self.recommendations("energy"),
        }

    def cooling(self) -> dict:
        df = _logs_frame(self.repo)
        return {
            "temperatureHeatmap": self._rack_utilization(df, metric="temp"),
            "hotspots": [{"zone": "Zone 5", "temp": 36.8}, {"zone": "Rack A-17", "temp": 34.2}],
            "fanSpeed": round(float(df.fan.mean()), 1) if not df.empty else 0,
            "humidity": round(float(df.humidity.mean()), 1) if not df.empty else 0,
            "coolingEfficiency": 83.4,
            "recommendations": self.recommendations("cooling"),
        }

    def carbon(self) -> dict:
        summary = self.dashboard_summary()
        return {
            "emissions": summary.get("carbonEmissions", 0),
            "pue": 1.32,
            "renewableEnergy": summary.get("renewableEnergy", 0),
            "greenScore": summary.get("sustainabilityScore", 0),
            "monthlyCarbonSavings": 128.4,
            "forecast": [{"month": f"M+{i}", "co2": round(380 - i * 7 + np.cos(i) * 18, 1)} for i in range(1, 13)],
        }

    def predictions(self) -> dict:
        df = _logs_frame(self.repo)
        if df.empty:
            return {"risks": []}
        df = df.copy()
        df["failure"] = ((df.temp > 34) | (df.disk > 91) | (df.ram > 92) | (df.latency > 130)).astype(int)
        model = RandomForestClassifier(n_estimators=24, random_state=7)
        features = ["cpu", "gpu", "ram", "disk", "temp", "power", "latency", "fan"]
        model.fit(df[features], df["failure"])
        probabilities = model.predict_proba(df[features])[:, 1]
        df["risk"] = probabilities
        top = df.sort_values("risk", ascending=False).head(12)
        return {
            "risks": [
                {
                    "server": f"srv-{int(row.server_id):04d}",
                    "riskScore": round(float(row.risk) * 100, 1),
                    "failureType": self._failure_type(row),
                    "maintenance": "Move workload, inspect cooling path, schedule component diagnostics.",
                }
                for row in top.itertuples()
            ]
        }

    def cloud_optimization(self) -> dict:
        return {
            "idleVirtualMachines": 42,
            "unusedStorageTb": 318,
            "unusedLoadBalancers": 9,
            "unusedDatabases": 14,
            "rightsizingRecommendations": 67,
            "cloudCostSavings": 184200,
        }

    def digital_twin(self) -> dict:
        racks = []
        for rack in self.repo.racks():
            servers = [
                {"id": s.id, "hostname": s.hostname, "status": s.status, "health": 96 if s.status == "healthy" else 71 if s.status == "warning" else 38}
                for s in rack.servers
            ]
            racks.append({"id": rack.id, "name": rack.name, "room": rack.room, "zone": rack.zone, "servers": servers})
        return {"rooms": sorted(set(r["room"] for r in racks)), "racks": racks}

    def sandbox(self, payload) -> dict:
        summary = self.dashboard_summary()
        base_energy = summary.get("energyCost", 0)
        base_carbon = summary.get("carbonEmissions", 0)
        server_delta = payload.add_servers - payload.remove_servers
        power_factor = 1 + payload.power_delta_percent / 100 + server_delta * 0.006 - payload.migrate_workloads_percent / 400
        cooling_factor = 1 + payload.cooling_delta_percent / 100 - payload.migrate_workloads_percent / 500
        after_energy = base_energy * power_factor + summary.get("coolingCost", 0) * cooling_factor
        before = base_energy + summary.get("coolingCost", 0)
        return {
            "before": round(before, 2),
            "after": round(after_energy, 2),
            "energySavings": round(before - after_energy, 2),
            "performanceImpact": round(payload.migrate_workloads_percent * 0.12 - max(0, server_delta) * 0.05, 2),
            "carbonImpact": round(base_carbon * (1 - power_factor), 2),
        }

    def recommendations(self, category: str | None = None) -> list[dict]:
        rows = self.repo.recommendations()
        if category:
            rows = [r for r in rows if r.category == category]
        return [
            {
                "title": r.title,
                "category": r.category,
                "impact": r.impact,
                "savingsUsd": r.savings_usd,
                "carbonReductionTons": r.carbon_reduction_tons,
                "message": r.message,
            }
            for r in rows
        ]

    def executive(self) -> dict:
        summary = self.dashboard_summary()
        return {
            "monthlySavings": summary.get("monthlySavings", 0),
            "revenueSaved": 2_840_000,
            "energySavedMwh": 1840,
            "carbonSavedTons": 512,
            "optimizationScore": 88.7,
            "infrastructureHealthIndex": summary.get("overallHealth", 0),
            "serverHappinessIndex": 91.2,
        }

    def extras(self) -> dict:
        return {
            "costSimulator": {"electricityBill": 428000, "coolingCost": 162000, "maintenanceCost": 91000, "cloudCost": 310000, "roi": 3.8, "paybackMonths": 7},
            "disasterReadiness": {"flood": 14, "fire": 22, "power": 31, "network": 18, "cooling": 28, "earthquake": 11, "score": 86},
            "leaks": {"zombieServers": 31, "unusedStorage": 318, "idleGpus": 19, "idleCpus": 244, "unusedNetwork": 12, "moneyLost": 73200},
            "renewableScheduler": [{"hour": h, "solar": max(0, 70 - abs(13 - h) * 9), "wind": 38 + int(np.sin(h) * 14), "gridCost": round(0.18 - max(0, 70 - abs(13 - h) * 9) / 1000, 3)} for h in range(24)],
            "workloadDna": [{"pattern": p, "confidence": c} for p, c in [("Hourly", 91), ("Daily", 87), ("Weekly", 79), ("Monthly", 72), ("Seasonal", 68)]],
            "communityIntelligence": [{"case": "AI training cluster consolidation", "similarity": 94, "savings": 128000}, {"case": "Cooling pressure rebalance", "similarity": 89, "savings": 83000}],
        }

    def chat(self, question: str) -> dict:
        q = question.lower()
        if "rack 3" in q or "overheating" in q:
            answer = "Rack 3 is overheating because GPU utilization and inlet temperature are rising together while airflow is below baseline. Move batch workloads to Rack D, increase fan speed in Zone 5 by 8%, and inspect blocked tiles."
        elif "energy" in q:
            answer = "The fastest energy reduction is shutting down zombie servers, migrating low-priority jobs after midnight, and rightsizing 42 idle VMs. Estimated savings: $73.2k monthly and 41.6 tons CO2."
        elif "highest cost" in q:
            answer = "The highest cost asset is srv-0042 due to high power draw, sustained GPU load, and elevated cooling overhead. Consider workload migration or accelerator replacement."
        elif "next month" in q or "power bill" in q:
            answer = "Next month's power bill is forecast at $442k with a 6.5% confidence band. Renewable-aware scheduling can reduce it by roughly $38k."
        else:
            answer = "I found optimization potential in idle compute, cooling zones, and backup scheduling. Prioritize workload migration, idle shutdown, and cooling pressure rebalance for measurable savings."
        return {"answer": answer, "confidence": 0.91}

    def _rack_utilization(self, df: pd.DataFrame, metric: str = "cpu") -> list[dict]:
        values = defaultdict(list)
        for row in df.itertuples():
            values[int(row.server_id) % 24].append(getattr(row, metric))
        return [{"rack": f"Rack {key + 1}", "value": round(float(np.mean(value)), 1)} for key, value in values.items()]

    def _failure_type(self, row) -> str:
        if row.temp > 34:
            return "CPU Overheating"
        if row.disk > 91:
            return "Disk Failure"
        if row.ram > 92:
            return "Memory Failure"
        return "Server Failure"
