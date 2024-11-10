from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.query import Query, QueryResponse
from app.services.rag_service import RAGService
from app.models.document import Document

router = APIRouter()
rag_service = RAGService()

@router.post("/query", response_model=QueryResponse)
async def query_document(
    query: Query,
    current_user = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    # Verify document access
    document = db.query(Document).filter(
        Document.id == query.document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Process query
    answer = rag_service.query_document(
        query=query.question,
        document_id=str(document.id)
    )
    
    return {"answer": answer}
