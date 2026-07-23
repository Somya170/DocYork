from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
from app.config import RAW_DATA_DIR
from app.ingestion.loader import load_file_to_duckdb
from app.ingestion.demo_generator import generate_demo_dataset
from app.engine.profiler import profile_table, get_active_profile

router = APIRouter()

@router.post("/ingest")
async def upload_and_ingest_file(file: UploadFile = File(...)):
    """Uploads a CSV, JSON, or Excel file, loads it directly into DuckDB, and profiles it."""
    try:
        dest_path = RAW_DATA_DIR / file.filename
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = load_file_to_duckdb(dest_path)
        
        # Profile the newly uploaded table
        table_name = result.get("table_name")
        if table_name:
            profile_table(table_name)
            
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File Ingestion Error: {str(e)}")

@router.get("/table-profile")
def fetch_active_table_profile():
    """Returns the generated suggested queries and insights for the active dataset."""
    return get_active_profile()

@router.post("/demo-data")
def seed_demo_dataset():
    """Generates synthetic 1,000 Industrial Machine dataset in DuckDB."""
    try:
        result = generate_demo_dataset()
        # Profile the demo dataset machines table
        profile_table("machines")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Demo Seed Error: {str(e)}")
