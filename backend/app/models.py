from datetime import datetime
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(80), default="operator")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class DataCenter(Base):
    __tablename__ = "data_centers"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    region: Mapped[str] = mapped_column(String(80))
    renewable_percent: Mapped[float] = mapped_column(Float, default=42)
    racks = relationship("Rack", back_populates="data_center")


class Rack(Base):
    __tablename__ = "racks"
    id: Mapped[int] = mapped_column(primary_key=True)
    data_center_id: Mapped[int] = mapped_column(ForeignKey("data_centers.id"))
    name: Mapped[str] = mapped_column(String(80))
    room: Mapped[str] = mapped_column(String(80))
    zone: Mapped[str] = mapped_column(String(80))
    data_center = relationship("DataCenter", back_populates="racks")
    servers = relationship("Server", back_populates="rack")


class Server(Base):
    __tablename__ = "servers"
    id: Mapped[int] = mapped_column(primary_key=True)
    rack_id: Mapped[int] = mapped_column(ForeignKey("racks.id"))
    hostname: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(40), default="healthy")
    cpu_cores: Mapped[int] = mapped_column(Integer, default=32)
    gpu_count: Mapped[int] = mapped_column(Integer, default=0)
    memory_gb: Mapped[int] = mapped_column(Integer, default=256)
    storage_tb: Mapped[float] = mapped_column(Float, default=8)
    rack = relationship("Rack", back_populates="servers")


class TelemetryLog(Base):
    __tablename__ = "telemetry_logs"
    id: Mapped[int] = mapped_column(primary_key=True)
    server_id: Mapped[int] = mapped_column(ForeignKey("servers.id"), index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, index=True)
    cpu_usage: Mapped[float] = mapped_column(Float)
    gpu_usage: Mapped[float] = mapped_column(Float)
    ram_usage: Mapped[float] = mapped_column(Float)
    disk_usage: Mapped[float] = mapped_column(Float)
    temperature_c: Mapped[float] = mapped_column(Float)
    power_kw: Mapped[float] = mapped_column(Float)
    latency_ms: Mapped[float] = mapped_column(Float)
    bandwidth_gbps: Mapped[float] = mapped_column(Float)
    fan_speed: Mapped[float] = mapped_column(Float)
    humidity: Mapped[float] = mapped_column(Float)


class FailureEvent(Base):
    __tablename__ = "failure_events"
    id: Mapped[int] = mapped_column(primary_key=True)
    server_id: Mapped[int] = mapped_column(ForeignKey("servers.id"), index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, index=True)
    failure_type: Mapped[str] = mapped_column(String(80))
    severity: Mapped[str] = mapped_column(String(40))
    resolved: Mapped[bool] = mapped_column(Boolean, default=False)


class Recommendation(Base):
    __tablename__ = "recommendations"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(180))
    category: Mapped[str] = mapped_column(String(80))
    impact: Mapped[str] = mapped_column(String(40))
    savings_usd: Mapped[float] = mapped_column(Float)
    carbon_reduction_tons: Mapped[float] = mapped_column(Float)
    message: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
