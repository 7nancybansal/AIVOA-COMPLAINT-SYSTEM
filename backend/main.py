from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from dotenv import load_dotenv
from groq import Groq
from langgraph.graph import StateGraph, START, END
from typing import TypedDict
import io
import os
import json
import mysql.connector
load_dotenv()

client = Groq(

    api_key=os.getenv("GROQ_API_KEY")
)
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

app = FastAPI(title="AIVOA Complaint Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# LangGraph State
# -----------------------------

class ComplaintState(TypedDict):
    complaint_text: str
    analysis: dict


# -----------------------------
# AI Analysis Node
# -----------------------------

def analyze_complaint(state: ComplaintState):
    complaint_text = state["complaint_text"]

    prompt = f"""
You are an AI assistant for a pharmaceutical Customer Complaint
Management System.

Analyze the complaint below and extract only information supported
by the complaint text.

Do NOT invent missing information.
If a field is missing, return null.

Return ONLY valid JSON with exactly these fields:

{{
    "product_name": null,
    "batch_number": null,
    "strength": null,
    "manufacturing_date": null,
    "expiry_date": null,
    "affected_quantity": null,
    "complaint_category": null,
    "severity": null,
    "description": null,
    "completeness": "Complete",
    "risk_level": "Low",
    "summary": null
}}

Rules:
- complaint_category should be one of:
  Product Defect, Packaging Issue, Labeling Issue,
  Adverse Event, Other
- severity should be one of:
  Minor, Major, Critical
- risk_level should be one of:
  Low, Medium, High
- completeness should be Complete, Partially Complete, or Incomplete.
- Consider missing product/batch/complaint details when deciding completeness.
- Consider patient safety, product quality, contamination, adverse events,
  wrong labeling, or serious defects when deciding risk.
- summary should be a short professional summary.

Complaint text:
----------------
{complaint_text}
----------------
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = response.choices[0].message.content

    # Remove markdown code fences if model adds them
    content = content.replace("```json", "").replace("```", "").strip()

    try:
        result = json.loads(content)
    except json.JSONDecodeError:
        result = {
            "product_name": None,
            "batch_number": None,
            "strength": None,
            "manufacturing_date": None,
            "expiry_date": None,
            "affected_quantity": None,
            "complaint_category": None,
            "severity": None,
            "description": complaint_text,
            "completeness": "Incomplete",
            "risk_level": "Medium",
            "summary": content
        }

    return {
        "complaint_text": complaint_text,
        "analysis": result
    }


# -----------------------------
# LangGraph
# -----------------------------

graph_builder = StateGraph(ComplaintState)

graph_builder.add_node("analyze_complaint", analyze_complaint)

graph_builder.add_edge(START, "analyze_complaint")
graph_builder.add_edge("analyze_complaint", END)

complaint_graph = graph_builder.compile()


# -----------------------------
# Home
# -----------------------------

@app.get("/")
def home():
    return {
        "message": "AIVOA Complaint Management API is running"
    }


# -----------------------------
# Upload + AI Analysis
# -----------------------------

@app.post("/upload-complaint")
async def upload_complaint(file: UploadFile = File(...)):

    file_content = await file.read()

    if file.filename.lower().endswith(".pdf"):

        pdf = PdfReader(io.BytesIO(file_content))

        extracted_text = ""

        for page in pdf.pages:
            text = page.extract_text()

            if text:
                extracted_text += text + "\n"

    else:

        extracted_text = file_content.decode(
            "utf-8",
            errors="ignore"
        )

    # Run LangGraph
    result = complaint_graph.invoke({
        "complaint_text": extracted_text,
        "analysis": {}
    })

    return {
        "filename": file.filename,
        "message": "Complaint analyzed successfully",
        "extracted_text": extracted_text,
        "analysis": result["analysis"]
    }


# -----------------------------
# Test AI
# -----------------------------

@app.get("/test-ai")
def test_ai():

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": "Say hello and confirm you are ready to analyze pharmaceutical complaints."
            }
        ],
    )

    return {
        "ai_response": response.choices[0].message.content
    }


# -----------------------------
# Commit Complaint to QMS Ledger
# -----------------------------

@app.post("/commit-complaint")
def commit_complaint(complaint: dict):

    db = get_db_connection()
    cursor = db.cursor()

    query = """
        INSERT INTO complaints (
            product_name,
            batch_number,
            strength,
            manufacturing_date,
            expiry_date,
            affected_quantity,
            complaint_category,
            severity,
            description,
            risk_level,
            completeness,
            summary
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        complaint.get("productName"),
        complaint.get("batchNumber"),
        complaint.get("strength"),
        complaint.get("manufacturingDate"),
        complaint.get("expiryDate"),
        complaint.get("affectedQuantity"),
        complaint.get("category"),
        complaint.get("severity"),
        complaint.get("description"),
        complaint.get("riskLevel"),
        complaint.get("completeness"),
        complaint.get("summary")
    )

    cursor.execute(query, values)
    db.commit()

    complaint_id = cursor.lastrowid

    cursor.close()
    db.close()

    return {
        "message": "Complaint committed to QMS Ledger",
        "complaint_id": complaint_id
    }