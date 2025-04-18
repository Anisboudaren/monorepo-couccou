import uuid
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec

# === Config ===
PINECONE_API_KEY = "pcsk_3s298S_Kw1PCgtd5uJvsBEV2AFDNRd7DJiAZ3KY49HCVmNhN8myG6q3XTSiLHm32N5ZU7F"
PINECONE_ENV = "us-east-1"
PINECONE_INDEX = "memoire"
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"

# === Load embedding model ===
model = SentenceTransformer(EMBED_MODEL_NAME)

# === Initialize Pinecone ===
pc = Pinecone(api_key=PINECONE_API_KEY)

# Create index if it doesn't exist
if PINECONE_INDEX not in pc.list_indexes().names():
    pc.create_index(
        name=PINECONE_INDEX,
        dimension=384,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region=PINECONE_ENV)
    )

index = pc.Index(PINECONE_INDEX)

# === Function to embed and upload text ===
def upload_text_to_pinecone(text: str, doc_id: str = None):
    if not text.strip():
        print("❌ Empty text. Nothing to upload.")
        return

    embedding = model.encode(text).tolist()
    doc_id = doc_id or str(uuid.uuid4())  # Generate a random ID if not provided

    index.upsert([
        {
            "id": doc_id,
            "values": embedding,
            "metadata": {
                "source": "manual_input",
                "preview": text[:3000]
            }
        }
    ])

    print(f"✅ Text uploaded to Pinecone with ID: {doc_id}")

# === Example usage ===
sample_text = """
        Section 1: Introduction
This document outlines the essential customer service policies and answers frequently asked questions regarding shipping, delivery, returns, and refunds for our online store ShopEase. It is used to power our AI-driven support chatbot and helpdesk.

🔹 Section 2: Frequently Asked Questions (FAQs)
Q: How long does shipping take?
A: Standard shipping within the U.S. takes 3–5 business days. Expedited shipping is available for 1–2 day delivery.

Q: Can I track my order?
A: Yes. Once your order ships, you’ll receive a tracking link via email and SMS.

Q: Do you offer international shipping?
A: Yes, we ship to over 50 countries. International orders may take 7–15 business days.

Q: What should I do if my package is lost or delayed?
A: Please contact our support team with your order ID. We'll initiate an investigation within 24 hours.

🔹 Section 3: Policies
📦 Shipping Policy
Orders are processed within 24 hours.

Free shipping is offered for orders over $50.

A shipping confirmation email is sent once the item is dispatched.

🔁 Return & Refund Policy
Returns accepted within 30 days of delivery.

Products must be unused and in original packaging.

Refunds are processed within 5–7 business days after inspection.

🛑 Cancellation Policy
Orders can be canceled within 1 hour of placement.

After 1 hour, cancellation is not guaranteed if the order is already processed.

🔹 Section 4: Troubleshooting & How-To Guides
🧩 Issue: My package says “delivered” but I didn’t receive it.
Solution:

Double-check your mailbox, porch, or with neighbors.

Wait 24 hours—sometimes carriers mark it early.

Contact our support if not found within 24 hours.

🧩 Issue: I received a damaged item.
Solution:

Take clear photos of the item and packaging.

Email support@shopease.com with your order number and photos.

We’ll send a replacement or issue a refund within 3 business days.

🔹 Section 5: Contact & Escalation
Live Chat Hours: Mon–Fri, 9:00 AM – 6:00 PM EST

Email: support@shopease.com

Phone Support: +1 (800) 555-1234

Escalation: If you don’t receive a response within 48 hours, forward your case to escalation@shopease.com with subject line “URGENT: Escalation”.

🔹 Section 6: Glossary
Term	Definition
SKU	Stock Keeping Unit – a unique product code
ETA	Estimated Time of Arrival
RMA	Return Merchandise Authorization
"""
upload_text_to_pinecone(sample_text)
