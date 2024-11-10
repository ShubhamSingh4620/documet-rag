from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class DocumentBase(BaseModel):
    title: str
    description: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int
    user_id: int
    file_path: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
