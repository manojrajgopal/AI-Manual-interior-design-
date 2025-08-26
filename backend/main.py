from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
import os

app = FastAPI(title="AI Furnish Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    prompt: str
    floorplan: Optional[Dict[str, Any]] = None

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/generate-plan")
def generate_plan(req: GenerateRequest):
    # Step 2 will integrate OpenAI/Gemini. For now, return a mock plan so the UI is testable.
    # The schema matches what the frontend expects.
    mock_plan = {
        "items": [
            {"type": "sofa", "position": [1.2, 0.4], "rotation": 90, "color": "navy"},
            {"type": "tv", "position": [-1.0, 0.2], "rotation": 270, "color": "black"},
            {"type": "coffee_table", "position": [0.2, 0.0], "rotation": 0, "color": "walnut"}
        ],
        "notes": "Mock data – AI integration coming in Step 2",
        "source": "mock"
    }
    return mock_plan