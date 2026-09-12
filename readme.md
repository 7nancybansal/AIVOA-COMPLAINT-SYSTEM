# AIVOA Complaint Management System

AI-powered Customer Complaint Management System for pharmaceutical manufacturing.

## Tech Stack

### Frontend
- React
- Redux Toolkit
- CSS
- Vite

### Backend
- Python
- FastAPI
- LangGraph
- Groq AI
- MySQL

## Features

- Upload customer complaint PDF/text files
- Extract complaint information using AI
- Automatically populate complaint form
- AI complaint completeness assessment
- AI risk classification
- AI-generated complaint summary
- Commit complaint to QMS Ledger
- Store complaint records in MySQL
- Redux-based frontend state management

## Architecture

Complaint File
→ React Frontend
→ FastAPI
→ LangGraph
→ Groq AI
→ Complaint Analysis
→ React + Redux
→ MySQL QMS Ledger

## How to Run

### Backend

```bash
cd backend
.\env\Scripts\activate
uvicorn main:app --reload