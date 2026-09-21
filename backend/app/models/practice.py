import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from backend.app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class PracticeTask(Base):
    __tablename__ = "practice_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    roadmap_item_id = Column(String(36), ForeignKey("roadmap_items.id", ondelete="CASCADE"), nullable=True)
    skill_name = Column(String(100), nullable=False)
    task_type = Column(String(50), default="mcq")  # mcq, code_challenge, debugging, scenario
    difficulty = Column(String(50), default="Intermediate")  # Beginner, Intermediate, Advanced
    title = Column(String(255), nullable=False)
    question = Column(Text, nullable=False)
    code_snippet = Column(Text, default="")
    options = Column(JSON, default=list)  # list of strings for MCQs
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, default="")
    hint = Column(Text, default="")

    roadmap_item = relationship("RoadmapItem", back_populates="practice_tasks")

class PracticeAttempt(Base):
    __tablename__ = "practice_attempts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    task_id = Column(String(36), ForeignKey("practice_tasks.id", ondelete="CASCADE"), nullable=False)
    user_answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    score = Column(Float, default=0.0)  # 0.0 to 100.0
    time_taken_seconds = Column(Integer, default=30)
    attempts_count = Column(Integer, default=1)
    struggle_detected = Column(Boolean, default=False)
    feedback = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="practice_attempts")
