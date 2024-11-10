
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from app.core.config import settings

class RAGService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.llm = OpenAI(temperature=0)
        
    def process_document(self, text: str, document_id: str):
        chunks = self.text_splitter.split_text(text)
        vectorstore = Chroma.from_texts(
            texts=chunks,
            embedding=self.embeddings,
            collection_name=f"doc_{document_id}"
        )
        return vectorstore
        
    def query_document(self, query: str, document_id: str):
        vectorstore = Chroma(
            embedding_function=self.embeddings,
            collection_name=f"doc_{document_id}"
        )
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=vectorstore.as_retriever()
        )
        response = qa_chain.run(query)
        return response
