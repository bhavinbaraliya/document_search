import os
import uuid
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from datetime import datetime
import boto3
import psycopg2
from psycopg2 import sql
import chromadb
from dotenv import load_dotenv
from PyPDF2 import PdfReader
import io
import re
from sentence_transformers import SentenceTransformer
from langchain_google_vertexai import ChatVertexAI
from chromadb.utils.embedding_functions import EmbeddingFunction
from langchain_community.vectorstores import Chroma

from utils.db_handler import save_metadata_to_postgres
from utils.document_handler import HuggingFaceEmbeddingFunction, extract_text_from_pdf, store_embeddings
from utils.s3_handler import upload_to_s3

from fastapi.middleware.cors import CORSMiddleware

# FastAPI app setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust the origins as needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Load environment variables
load_dotenv()


huggingface_ef = HuggingFaceEmbeddingFunction()


# Authenticate with Google Gemini and create the ChatVertexAI instance
llm = ChatVertexAI(
    model="gemini-pro",
    temperature=0,
    max_tokens=5000,
    max_retries=6,
    request_timeout=None,
    stop=None
)

# Initialize the ChromaDB client
current_dir = os.getcwd()
data_folder_path = os.path.join(current_dir, "data")
chromadb_client = chromadb.PersistentClient(path=data_folder_path)


# API Endpoint for uploading documents
@app.post("/upload/")
async def upload_document(file: UploadFile = File(...)):
    try:
        file_content = await file.read()
        pdf_text = extract_text_from_pdf(file_content)

        file_url = upload_to_s3(file)

        save_metadata_to_postgres(file.filename, file_url)

        document_id = str(uuid.uuid4())
        store_embeddings(pdf_text, document_id)

        return {"message": "File uploaded successfully", "file_url": file_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Request body model for query
class QueryRequest(BaseModel):
    query: str

@app.post("/generate-response/")
async def generate_response_endpoint(request: QueryRequest):
    try:
        user_collection = chromadb_client.get_collection(name="document_collection", embedding_function=huggingface_ef)
        query_embedding = huggingface_ef.embed_query(request.query)

        results = user_collection.query(query_embeddings=[query_embedding], n_results=4, include=["documents"])

        if results and "documents" in results and results["documents"]:
            # Flatten the list of lists
            document_texts = "\n".join([doc for sublist in results["documents"] for doc in sublist])

            prompt_template = """
                Answer the following question based on this context:
                {context}
                Question: {question}

                Answer in a clear and concise format:
            """
            prompt = prompt_template.format(context=document_texts, question=request.query)
            response = llm.invoke(prompt)

            # Remove Markdown formatting (e.g., *italic*, **bold**, etc.)
            clean_response = re.sub(r"([*#_~`>]+)", "", response.content)

            return {"response": clean_response}
        else:
            return {"response": "No relevant information found."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during response generation: {str(e)}")
