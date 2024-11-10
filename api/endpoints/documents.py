from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.schemas.document import Document, DocumentCreate
from app.models.user import User
from app.core.storage import store_document

router = APIRouter()

@router.post("/upload", response_model=Document)
async def upload_document(
    title: str,
    description: str = None,
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    # Store file in storage
    file_path = await store_document(file)
    
    # Create document record
    db_document = Document(
        title=title,
        description=description,
        file_path=file_path,
        user_id=current_user.id
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@router.get("/", response_model=List[Document])
def get_documents(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    return db.query(Document).filter(Document.user_id == current_user.id).all()
