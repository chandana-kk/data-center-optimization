from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...db.session import get_db
from ...schemas.dashboard import DashboardMetrics
from ...services.analytics_service import compute_metrics

router = APIRouter()


@router.get("/metrics", response_model=DashboardMetrics)
def get_metrics(db: Session = Depends(get_db)):
    return compute_metrics(db)
