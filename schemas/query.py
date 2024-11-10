from pydantic import BaseModel

class Query(BaseModel):
    question: str
    document_id: int

class QueryResponse(BaseModel):
    answer: str
