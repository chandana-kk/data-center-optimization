from pydantic import BaseModel


class DashboardMetrics(BaseModel):
    total_servers: int
    healthy_servers: int
    idle_servers: int
    power_consumption_kw: float
    energy_cost_usd: float
    cooling_cost_usd: float
    carbon_emissions_ton: float
    renewable_energy_pct: float
    efficiency_score: float
    sustainability_score: float
    monthly_savings_usd: float
    overall_health_pct: float

    class Config:
        orm_mode = True
