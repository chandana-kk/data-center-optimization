from datetime import datetime, timedelta
import random
import numpy as np
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.models import DataCenter, FailureEvent, Rack, Recommendation, Server, TelemetryLog, User


def seed_database(db: Session, records: int = 100000) -> None:
    if db.scalar(select(func.count(User.id))) == 0:
        db.add(User(email="admin@neurodc.ai", name="NeuroDC Admin", hashed_password=hash_password("NeuroDC2026!"), role="admin"))

    if db.scalar(select(func.count(Server.id))) > 0:
        db.commit()
        return

    dc = DataCenter(name="NeuroDC Ashburn Autonomous Region", region="us-east", renewable_percent=47.8)
    db.add(dc)
    db.flush()

    servers = []
    for room in range(1, 5):
        for rack_num in range(1, 7):
            rack = Rack(data_center_id=dc.id, name=f"R{room}-{rack_num:02d}", room=f"Room {room}", zone=f"Zone {(rack_num % 6) + 1}")
            db.add(rack)
            db.flush()
            for slot in range(1, 13):
                status = random.choices(["healthy", "warning", "critical"], weights=[82, 14, 4])[0]
                server = Server(
                    rack_id=rack.id,
                    hostname=f"srv-{room}{rack_num:02d}{slot:02d}",
                    status=status,
                    cpu_cores=random.choice([32, 48, 64, 96]),
                    gpu_count=random.choice([0, 0, 1, 2, 4, 8]),
                    memory_gb=random.choice([128, 256, 512, 1024]),
                    storage_tb=random.choice([4, 8, 16, 32]),
                )
                db.add(server)
                servers.append(server)
    db.flush()

    start = datetime.utcnow() - timedelta(days=120)
    batch = []
    for i in range(records):
        server = servers[i % len(servers)]
        hour = i % (24 * 120)
        timestamp = start + timedelta(hours=hour, minutes=random.randint(0, 59))
        daily_curve = 18 * np.sin((timestamp.hour - 7) / 24 * 2 * np.pi)
        cpu = float(np.clip(np.random.normal(58 + daily_curve, 20), 1, 99))
        gpu = float(np.clip(np.random.normal(42 + daily_curve, 28), 0, 99)) if server.gpu_count else 0
        ram = float(np.clip(cpu * 0.7 + np.random.normal(22, 12), 5, 99))
        disk = float(np.clip(np.random.normal(61, 18), 4, 98))
        temp = float(np.clip(21 + cpu * 0.11 + gpu * 0.05 + np.random.normal(0, 2.2), 18, 43))
        power = float(np.clip(0.18 + cpu * 0.009 + gpu * 0.006 + server.gpu_count * 0.04, 0.12, 2.4))
        batch.append(
            TelemetryLog(
                server_id=server.id,
                timestamp=timestamp,
                cpu_usage=cpu,
                gpu_usage=gpu,
                ram_usage=ram,
                disk_usage=disk,
                temperature_c=temp,
                power_kw=power,
                latency_ms=float(np.clip(np.random.normal(38 + cpu * 0.35, 18), 2, 220)),
                bandwidth_gbps=float(np.clip(np.random.normal(4.2 + cpu / 30, 2.5), 0.1, 40)),
                fan_speed=float(np.clip(36 + temp * 1.6 + np.random.normal(0, 8), 20, 100)),
                humidity=float(np.clip(np.random.normal(45, 8), 20, 75)),
            )
        )
        if len(batch) >= 5000:
            db.add_all(batch)
            db.flush()
            batch.clear()
    if batch:
        db.add_all(batch)

    for server in random.sample(servers, min(60, len(servers))):
        db.add(
            FailureEvent(
                server_id=server.id,
                timestamp=datetime.utcnow() - timedelta(days=random.randint(0, 90)),
                failure_type=random.choice(["Server Failure", "Disk Failure", "Memory Failure", "CPU Overheating"]),
                severity=random.choice(["medium", "high", "critical"]),
                resolved=random.choice([True, True, False]),
            )
        )

    recommendations = [
        ("Move workloads from Rack A to Rack D", "energy", "high", 42000, 28.4, "Rack A is drawing above-baseline power during peak pricing windows."),
        ("Shutdown idle servers", "energy", "critical", 73200, 41.6, "31 zombie servers have consumed power without meaningful CPU activity."),
        ("Reduce cooling in Zone 3", "cooling", "medium", 18600, 12.2, "Zone 3 humidity and inlet temperatures are below target ranges."),
        ("Increase fan speed in Zone 5", "cooling", "high", 12200, 5.8, "Zone 5 has recurring thermal hotspots near GPU racks."),
        ("Schedule backup after midnight", "cloud", "medium", 21800, 14.1, "Backup jobs overlap with grid peak hours and production latency windows."),
        ("Rightsize idle virtual machines", "cloud", "high", 52200, 22.7, "42 VMs are overprovisioned relative to observed workload DNA."),
    ]
    for title, category, impact, savings, carbon, message in recommendations:
        db.add(Recommendation(title=title, category=category, impact=impact, savings_usd=savings, carbon_reduction_tons=carbon, message=message))

    db.commit()
