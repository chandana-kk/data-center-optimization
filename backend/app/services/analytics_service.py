import random

from sqlalchemy.orm import Session


def compute_metrics(db: Session) -> dict:
    return {
        "total_servers": 240,
        "healthy_servers": 210,
        "idle_servers": 18,
        "power_consumption_kw": 3560.5,
        "energy_cost_usd": 49820.87,
        "cooling_cost_usd": 16880.22,
        "carbon_emissions_ton": 21.4,
        "renewable_energy_pct": 42.5,
        "efficiency_score": 88.2,
        "sustainability_score": 79.3,
        "monthly_savings_usd": 15200.0,
        "overall_health_pct": 92.5,
    }
