from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.api.health import router as health_router
from app.api.query import router as query_router
from app.api.ingest import router as ingest_router
from app.api.fleet import router as fleet_router
from app.ingestion.demo_generator import generate_demo_dataset
from app.db.duckdb_client import db_client

app = FastAPI(
    title="DocYork - Industrial Data QA & Fleet Analytics Engine",
    version="2.0.0",
    description="High-precision zero-hallucination data QA backend powered by DuckDB & FastAPI"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health_router, prefix="/api")
app.include_router(query_router, prefix="/api")
app.include_router(ingest_router, prefix="/api")
app.include_router(fleet_router, prefix="/api")

@app.on_event("startup")
def startup_event():
    """Auto-seed demo database with 1,000 machines on initial startup if empty."""
    try:
        tables = db_client.list_tables()
        if "machines" not in tables or db_client.execute_query("SELECT COUNT(*) as cnt FROM machines")[0]["cnt"] == 0:
            print("Seeding initial 1,000 machine demo dataset...")
            generate_demo_dataset()
            print("Demo dataset seeded successfully!")
    except Exception as err:
        print("Startup warning:", err)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
