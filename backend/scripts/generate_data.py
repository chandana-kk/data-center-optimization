import argparse
from datetime import datetime, timedelta
import numpy as np
import pandas as pd


def generate(records: int) -> pd.DataFrame:
    start = datetime.utcnow() - timedelta(days=120)
    server_ids = np.arange(1, 289)
    rows = []
    for i in range(records):
        server_id = int(server_ids[i % len(server_ids)])
        ts = start + timedelta(minutes=i * 5)
        cpu = float(np.clip(np.random.normal(58 + 18 * np.sin((ts.hour - 7) / 24 * 2 * np.pi), 20), 1, 99))
        gpu = float(np.clip(np.random.normal(42, 28), 0, 99))
        ram = float(np.clip(cpu * 0.7 + np.random.normal(22, 12), 5, 99))
        disk = float(np.clip(np.random.normal(61, 18), 4, 98))
        temp = float(np.clip(21 + cpu * 0.11 + gpu * 0.05 + np.random.normal(0, 2.2), 18, 43))
        rows.append(
            {
                "timestamp": ts.isoformat(),
                "server_id": server_id,
                "rack": f"R{(server_id % 24) + 1:02d}",
                "cpu_usage": round(cpu, 2),
                "gpu_usage": round(gpu, 2),
                "ram_usage": round(ram, 2),
                "disk_usage": round(disk, 2),
                "temperature_c": round(temp, 2),
                "power_kw": round(np.clip(0.18 + cpu * 0.009 + gpu * 0.006, 0.12, 2.4), 3),
                "latency_ms": round(float(np.clip(np.random.normal(38 + cpu * 0.35, 18), 2, 220)), 2),
                "bandwidth_gbps": round(float(np.clip(np.random.normal(4.2 + cpu / 30, 2.5), 0.1, 40)), 2),
                "failure": int(temp > 34 or disk > 91 or ram > 92),
            }
        )
    return pd.DataFrame(rows)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--records", type=int, default=100000)
    parser.add_argument("--output", default="../data/neurodc_synthetic_100k.csv")
    args = parser.parse_args()
    generate(args.records).to_csv(args.output, index=False)
    print(f"Wrote {args.records} records to {args.output}")
