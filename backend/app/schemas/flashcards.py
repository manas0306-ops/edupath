from pydantic import BaseModel
from typing import List, Dict, Optional

class FlashcardItem(BaseModel):
    id: str
    topic: str
    subtopic: Optional[str] = None
    difficulty: str  # Beginner, Intermediate, Advanced
    front_prompt: str
    code_snippet: Optional[str] = None
    back_answer: str
    key_takeaway: str
    explanations: Dict[str, str]  # en, hi, pa, es, fr, de, ja
    tags: List[str] = []
    is_mastered: bool = False
    needs_review: bool = False

class FlashcardDeckResponse(BaseModel):
    topic: str
    total_cards: int
    mastered_count: int
    review_count: int
    cards: List[FlashcardItem]
    available_topics: List[Dict[str, str]]

class FlashcardStatusUpdate(BaseModel):
    card_id: str
    status: str  # "mastered" | "review_later" | "reset"

class FlashcardGenerateRequest(BaseModel):
    topic: str
    subtopic: Optional[str] = None
    difficulty: Optional[str] = "Intermediate"
    count: Optional[int] = 3

class QuizCreateRequest(BaseModel):
    topic: str
    difficulty: Optional[str] = "Intermediate"
    num_questions: Optional[int] = 5
    timed: Optional[bool] = False

class QuizQuestion(BaseModel):
    id: str
    topic: str
    difficulty: str
    title: str
    question: str
    code_snippet: Optional[str] = None
    options: List[str]
    correct_answer: str
    hint: Optional[str] = None
    explanations: Dict[str, str]  # en, hi, pa, es, fr, de, ja

class QuizSubmissionRequest(BaseModel):
    topic: str
    answers: Dict[str, str]  # question_id -> user_answer
    time_taken_seconds: int = 60

class QuizQuestionResult(BaseModel):
    id: str
    title: str
    question: str
    code_snippet: Optional[str] = None
    user_answer: Optional[str] = None
    correct_answer: str
    is_correct: bool
    hint: Optional[str] = None
    explanations: Dict[str, str]

class QuizEvaluationResponse(BaseModel):
    topic: str
    score_percentage: float
    correct_count: int
    total_questions: int
    xp_earned: int
    time_taken_seconds: int
    feedback: str
    struggle_detected: bool
    adaptive_action: Optional[str] = None
    results: List[QuizQuestionResult]
