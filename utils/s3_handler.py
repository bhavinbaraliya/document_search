import uuid
import boto3
from fastapi import HTTPException, UploadFile
import os

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

# Helper function to upload file to S3 and return the URL
def upload_to_s3(file: UploadFile):
    try:
        file_name = f"{uuid.uuid4()}.pdf"
        s3_client.upload_fileobj(file.file, os.getenv('AWS_BUCKET_NAME'), file_name)
        file_url = f"s3://{os.getenv('AWS_BUCKET_NAME')}/{file_name}"
        return file_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"S3 upload failed: {str(e)}")
