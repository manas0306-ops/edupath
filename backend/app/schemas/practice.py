from pydantic import BaseModel
from typing import List, Optional

class PracticeTaskResponse(BaseModel):
    id: str
    roadmap_item_id: Optional[str] = None
    skill_name: str
    task_type: str
    difficulty: str
    title: str
    question: str
    code_snippet: Optional[str] = None
    options: List[str] = []
    hint: Optional[str] = None

class PracticeSubmitRequest(BaseModel):
    task_id: str
    user_answer: str
    time_taken_seconds: int = 30

class PracticeResultResponse(BaseModel):
    is_correct: bool
    score: float
    correct_answer: str
    explanation: str
    feedback: str
    struggle_detected: bool
    xp_earned: int
    adaptive_action: Optional[str] = None
