from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
from app.core.config import get_settings
from app.database import Base, SessionLocal, engine
from app.services.seed import seed_database

settings = get_settings()

app = FastAPI(title="NeuroDC API", version="1.0.0", description="AI-powered autonomous data center optimization platform.")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db, records=settings.demo_data_records)
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "healthy", "service": settings.app_name}
