import os
from flask import Flask, request, render_template, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv

from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.llms.base import LLM
from langchain.callbacks.manager import CallbackManagerForLLMRun

# Updated imports for LangChain >= 0.2.0
from langchain_huggingface import HuggingFaceEmbeddings
# Import the correct Pinecone class
from langchain_pinecone import PineconeVectorStore

from pydantic import Field
import requests
import pinecone

# Load environment
load_dotenv()
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "sk-7f1e0e453e6341a0b24c255c425281a2")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV", "us-east-1")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "memoire")

# Check if key is missing and explicitly set it
if not PINECONE_API_KEY:
    PINECONE_API_KEY = "pcsk_3s298S_Kw1PCgtd5uJvsBEV2AFDNRd7DJiAZ3KY49HCVmNhN8myG6q3XTSiLHm32N5ZU7F"
    os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
    print(f"Set PINECONE_API_KEY explicitly in code")

app = Flask(__name__)

# Print Pinecone version for debugging
print(f"Pinecone version: {pinecone.__version__}")

# === DeepSeek Custom LLM ===
class DeepSeekLLM(LLM):
    api_key: str = Field(default=DEEPSEEK_API_KEY)
    model_name: str = Field(default="deepseek-chat")
    temperature: float = Field(default=0.7)
    max_tokens: int = Field(default=500)
    
    @property
    def _llm_type(self) -> str:
        return "deepseek"
    
    def _call(self, prompt: str, stop=None, run_manager: CallbackManagerForLLMRun = None, **kwargs) -> str:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        payload = {
            "model": self.model_name,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": self.temperature,
            "max_tokens": self.max_tokens
        }
        
        try:
            response = requests.post("https://api.deepseek.com/v1/chat/completions", headers=headers, json=payload)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Error calling DeepSeek API: {e}")
            return f"Sorry, there was an error processing your request: {str(e)}"

# === Knowledge Base Setup with Pinecone ===
class PineconeKnowledgeBase:
    def __init__(self):
        # Use the same embedding model that was used to create vectors in Pinecone
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vector_store = None
        self.init_pinecone()
    
    def init_pinecone(self):
        try:
            print(f"Initializing Pinecone with API key: {PINECONE_API_KEY[:5]}...")
            
            # Pinecone client initialization based on version
            pc = pinecone.Pinecone(api_key=PINECONE_API_KEY)
            
            # Check if index exists
            active_indexes = pc.list_indexes().names()
            print(f"Available indexes: {active_indexes}")
            
            if PINECONE_INDEX not in active_indexes:
                print(f"Error: Pinecone index '{PINECONE_INDEX}' not found.")
                return
            
            # Initialize LangChain's PineconeVectorStore with index name instead of index object
            self.vector_store = PineconeVectorStore.from_existing_index(
                index_name=PINECONE_INDEX,
                embedding=self.embeddings,
                text_key="preview"  # Adjust based on your metadata field name
            )
            
            print(f"✅ Connected to Pinecone index: {PINECONE_INDEX}")
            
        except Exception as e:
            print(f"❌ Failed to initialize Pinecone: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    def get_retriever(self):
        if not self.vector_store:
            raise ValueError("Pinecone vector store not initialized.")
        return self.vector_store.as_retriever(search_kwargs={"k": 4})

# Global variable to hold the RAG chain
rag_chain = None

# Initialize RAG chain
def init_rag_chain():
    global rag_chain
    try:
        knowledge_base = PineconeKnowledgeBase()
        
        llm = DeepSeekLLM()
        memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True, output_key="answer")
        rag_chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=knowledge_base.get_retriever(),
            memory=memory,
            return_source_documents=True
        )
        print("✅ RAG chain initialized successfully")
        
    except Exception as e:
        print(f"❌ Failed to initialize RAG chain: {e}")
        # We'll continue and let the routes handle potential errors

# Call the initialization function
init_rag_chain()

# === Flask Routes ===
@app.route("/")
def chat():
    return render_template("chat.html")

@app.route("/ask", methods=["POST"])
def ask():
    user_input = request.json["message"]
    
    # Check if RAG chain is initialized
    global rag_chain
    if rag_chain is None:
        try:
            init_rag_chain()
        except Exception as e:
            return jsonify({"answer": f"System is not properly initialized: {str(e)}"}), 500
    
    try:
        response = rag_chain.invoke({"question": user_input})
        
        # Extract source information for display
        sources = []
        if "source_documents" in response:
            for doc in response["source_documents"]:
                source_info = {
                    "content": doc.page_content[:150] + "..." if len(doc.page_content) > 150 else doc.page_content,
                    "metadata": doc.metadata
                }
                sources.append(source_info)
        
        return jsonify({
            "answer": response["answer"],
            "sources": sources
        })
    except Exception as e:
        print(f"Error processing query: {str(e)}")
        return jsonify({"answer": f"Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)