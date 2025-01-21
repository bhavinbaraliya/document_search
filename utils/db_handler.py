import psycopg2
from psycopg2 import sql
from fastapi import HTTPException
from datetime import datetime
import uuid
import os

conn = psycopg2.connect(
    dbname=os.getenv("POSTGRES_NAME"),
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD"),
    host=os.getenv("POSTGRES_HOST"),
    port=os.getenv("POSTGRES_PORT")
)

# Helper function to save metadata to PostgreSQL
def save_metadata_to_postgres(filename, file_url):
    try:
        with conn.cursor() as cursor:
            document_id = str(uuid.uuid4())
            timestamp = datetime.now()

            insert_query = sql.SQL("""
                INSERT INTO document_metadata (document_id, title, file_url, timestamp, filename)
                VALUES (%s, %s, %s, %s, %s)
            """)
            cursor.execute(insert_query, (document_id, filename, file_url, timestamp, filename))
            conn.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save metadata to PostgreSQL: {str(e)}")
