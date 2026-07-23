from typing import List, Dict, Any
from app.db.duckdb_client import db_client

def perform_semantic_search(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Performs dynamic keyword search across text/varchar columns in the active table.
    Automatically prioritizes custom user-uploaded tables over default tables.
    """
    # 1. Discover target table
    tables = db_client.list_tables()
    if not tables:
        return []
        
    custom_tables = [t for t in tables if t not in ["machines", "maintenance_logs", "operator_schedules"]]
    target_table = custom_tables[0] if custom_tables else "maintenance_logs"
    
    if target_table not in tables:
        target_table = tables[0]

    # 2. Retrieve columns and filter for text types
    try:
        cols = db_client.get_table_schema(target_table)
    except Exception:
        return []
        
    text_cols = [c["column"] for c in cols if "varchar" in c["type"].lower() or "string" in c["type"].lower()]
    if not text_cols:
        text_cols = [c["column"] for c in cols] # Fallback to all columns if no text type detected

    # Clean query terms
    terms = [t.strip().lower() for t in query.split() if len(t.strip()) > 3]
    if not terms:
        terms = [query.lower()]

    # 3. Build dynamic WHERE clause matching any query term in any text column
    where_conditions = []
    for term in terms:
        term_escaped = term.replace("'", "''")
        col_conds = [f"LOWER({tc}) LIKE '%{term_escaped}%'" for tc in text_cols]
        where_conditions.append(f"({' OR '.join(col_conds)})")

    where_clause = " AND ".join(where_conditions)

    sql = f"""
        SELECT *
        FROM {target_table}
        WHERE {where_clause}
        LIMIT {limit};
    """

    try:
        return db_client.execute_query(sql)
    except Exception:
        # Final fallback query
        return db_client.execute_query(f"SELECT * FROM {target_table} LIMIT {limit};")
