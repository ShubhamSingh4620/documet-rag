import boto3
from fastapi import UploadFile
from app.core.config import settings
import uuid

s3_client = boto3.client(
    's3',
    endpoint_url=f"http://{settings.MINIO_URL}",
    aws_access_key_id=settings.MINIO_ROOT_USER,
    aws_secret_access_key=settings.MINIO_ROOT_PASSWORD,
    region_name='us-east-1'
)

async def store_document(file: UploadFile) -> str:
    file_id = str(uuid.uuid4())
    file_extension = file.filename.split('.')[-1]
    file_path = f"{file_id}.{file_extension}"
    
    s3_client.upload_fileobj(
        file.file,
        settings.MINIO_BUCKET,
        file_path
    )
    
    return file_path
