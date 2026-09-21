import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from backend.app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class WeeklyReport(Base):
    __tablename__ = "weekly_reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    report_title = Column(String(255), default="Weekly AI Learning Report")
    week_start_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    skills_acquired = Column(JSON, default=list)
    skills_improving = Column(JSON, default=list)
    weak_areas = Column(JSON, default=list)
    completed_activities_count = Column(Integer, default=0)
    practice_accuracy_percentage = Column(Float, default=0.0)
    learning_hours_logged = Column(Float, default=0.0)
    recommended_next_week = Column(Text, default="")
    ai_summary = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="reports")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    badge_key = Column(String(100), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, default="")
    icon = Column(String(50), default="Award")
    earned_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="achievements")

class AdaptiveLog(Base):
    __tablename__ = "adaptive_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    trigger_type = Column(String(100), nullable=False)  # struggle_detected, accelerated_mastery, manual_feedback
    topic = Column(String(255), nullable=False)
    accuracy_score = Column(Float, default=0.0)
    action_taken = Column(Text, nullable=False)  # "Inserted revision item into Week 3", etc.
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
