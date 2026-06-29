from datetime import datetime, timedelta
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.models import DataCenter, FailureEvent, Rack, Recommendation, Server, TelemetryLog, User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> User | None:
        return self.db.scalar(select(User).where(User.email == email))

    def create(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user


class AnalyticsRepository:
    def __init__(self, db: Session):
        self.db = db

    def server_count(self) -> int:
        return self.db.scalar(select(func.count(Server.id))) or 0

    def healthy_count(self) -> int:
        return self.db.scalar(select(func.count(Server.id)).where(Server.status == "healthy")) or 0

    def idle_count(self) -> int:
        return self.db.scalar(
            select(func.count(func.distinct(TelemetryLog.server_id))).where(TelemetryLog.cpu_usage < 10, TelemetryLog.power_kw > 0.35)
        ) or 0

    def recent_logs(self, limit: int = 2000) -> list[TelemetryLog]:
        return list(self.db.scalars(select(TelemetryLog).order_by(TelemetryLog.timestamp.desc()).limit(limit)))

    def failures(self, limit: int = 100) -> list[FailureEvent]:
        return list(self.db.scalars(select(FailureEvent).order_by(FailureEvent.timestamp.desc()).limit(limit)))

    def recommendations(self) -> list[Recommendation]:
        return list(self.db.scalars(select(Recommendation).order_by(Recommendation.savings_usd.desc()).limit(12)))

    def racks(self) -> list[Rack]:
        return list(self.db.scalars(select(Rack)))

    def servers(self) -> list[Server]:
        return list(self.db.scalars(select(Server)))

    def daily_power(self, days: int = 30) -> list[tuple[str, float]]:
        since = datetime.utcnow() - timedelta(days=days)
        rows = self.db.execute(
            select(func.date(TelemetryLog.timestamp), func.sum(TelemetryLog.power_kw))
            .where(TelemetryLog.timestamp >= since)
            .group_by(func.date(TelemetryLog.timestamp))
            .order_by(func.date(TelemetryLog.timestamp))
        ).all()
        return [(str(day), round(power or 0, 2)) for day, power in rows]

    def data_center(self) -> DataCenter | None:
        return self.db.scalar(select(DataCenter).limit(1))
