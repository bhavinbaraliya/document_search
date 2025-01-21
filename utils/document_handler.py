import io
from PyPDF2 import PdfReader
from fastapi import HTTPException
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.utils.embedding_functions import EmbeddingFunction, HuggingFaceEmbeddingFunction

chromadb_client = chromadb.PersistentClient(path="./chroma_data")

# Custom embedding function using Hugging Face
class HuggingFaceEmbeddingFunction:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)

    def __call__(self, input):
        if isinstance(input, str):
            input = [input]
        embeddings = self.model.encode(input)
        return embeddings.tolist()
    
    def embed_documents(self, texts):
        embeddings = self.model.encode(texts)
        return embeddings.tolist()
    
    def embed_query(self, query):
        embedding = self.model.encode(query)
        return embedding.tolist()

# Create the embedding function
huggingface_ef = HuggingFaceEmbeddingFunction()

# Helper function to extract text from a PDF
def extract_text_from_pdf(file):
    try:
        pdf_file = io.BytesIO(file)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
        if not text.strip():
            raise ValueError("No text could be extracted from the PDF.")
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text from PDF: {str(e)}")

# Helper function to store embeddings in ChromaDB
def store_embeddings(file_text, document_id):
    try:
        user_collection = chromadb_client.get_or_create_collection(name="document_collection", embedding_function=huggingface_ef)
        user_collection.add(
            documents=[file_text],
            ids=[document_id],
            metadatas=[{"document_id": document_id}]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store embeddings in ChromaDB: {str(e)}")
