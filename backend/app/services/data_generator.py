import os
from pathlib import Path

import numpy as np
import pandas as pd
from sqlalchemy.orm import Session

from ..db.models import User
from ..db.session import SessionLocal


class SyntheticDataLoader:
    DATA_PATH = Path(__file__).resolve().parent.parent.parent / "data"

    def __init__(self):
        self.DATA_PATH.mkdir(parents=True, exist_ok=True)

    def load_synthetic_data(self) -> None:
        users = [
            {"email": "admin@neurodc.ai", "password": "Admin123!", "full_name": "NeuroDC Admin"}
        ]
        self._create_default_users(users)
        self._generate_logs()

    def _create_default_users(self, users):
        db: Session = SessionLocal()
        try:
            for item in users:
                if not db.query(User).filter(User.email == item["email"]).first():
                    user = User(
                        email=item["email"],
                        hashed_password=os.urandom(16).hex(),
                        full_name=item["full_name"],
                    )
                    db.add(user)
            db.commit()
        finally:
            db.close()

    def _generate_logs(self) -> None:
        if not self.DATA_PATH.exists():
            self.DATA_PATH.mkdir(parents=True, exist_ok=True)

        record_count = 100000
        rng = np.random.default_rng(seed=42)
        timestamp = pd.date_range("2025-01-01", periods=record_count, freq="H")

        base = rng.normal(loc=60, scale=10, size=record_count)
        energy = np.clip(base + rng.normal(0, 8, size=record_count), 8, 100)
        server_temp = np.clip(42 + rng.normal(0, 4, size=record_count), 18, 90)
        cpu_usage = np.clip(rng.normal(57, 18, size=record_count), 5, 99)
        memory_usage = np.clip(rng.normal(68, 16, size=record_count), 12, 99)
        network_mbps = np.clip(rng.normal(120, 40, size=record_count), 5, 1000)
        disk_iops = np.clip(rng.normal(450, 140, size=record_count), 1, 1600)
        failure_risk = np.clip(0.02 + 0.001 * (cpu_usage - 40) + 0.0008 * (server_temp - 40), 0, 1)

        data = pd.DataFrame(
            {
                "timestamp": timestamp,
                "energy_kw": energy,
                "temperature_c": server_temp,
                "cpu_usage_pct": cpu_usage,
                "memory_usage_pct": memory_usage,
                "network_mbps": network_mbps,
                "disk_iops": disk_iops,
                "failure_risk": failure_risk,
                "rack_id": rng.integers(1, 20, size=record_count),
                "server_id": rng.integers(1, 240, size=record_count),
                "zone": rng.choice(["A", "B", "C", "D"], size=record_count, p=[0.25, 0.25, 0.25, 0.25]),
            }
        )

        data.to_parquet(self.DATA_PATH / "synthetic_data.parquet")


data_loader = SyntheticDataLoader()
