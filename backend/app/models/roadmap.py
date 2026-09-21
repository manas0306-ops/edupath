import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from backend.app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    target_role = Column(String(255), nullable=False)
    total_weeks = Column(Integer, default=8)
    progress_percentage = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="roadmaps")
    items = relationship("RoadmapItem", back_populates="roadmap", cascade="all, delete-orphan", order_by="RoadmapItem.week_number")

class RoadmapItem(Base):
    __tablename__ = "roadmap_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    roadmap_id = Column(String(36), ForeignKey("roadmaps.id", ondelete="CASCADE"), nullable=False)
    week_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    topic = Column(String(255), nullable=False)
    description = Column(Text, default="")
    estimated_hours = Column(Integer, default=10)
    skill_covered = Column(String(100), nullable=False)
    learning_objectives = Column(JSON, default=list)  # list of strings
    status = Column(String(50), default="pending")  # pending, in_progress, completed, needs_revision
    is_adaptive_addition = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    roadmap = relationship("Roadmap", back_populates="items")
    resources = relationship("Resource", back_populates="roadmap_item", cascade="all, delete-orphan")
    practice_tasks = relationship("PracticeTask", back_populates="roadmap_item", cascade="all, delete-orphan")

class Resource(Base):
    __tablename__ = "resources"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    roadmap_item_id = Column(String(36), ForeignKey("roadmap_items.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    resource_type = Column(String(50), default="Article")  # Documentation, Course, Video, Article, Tutorial, Repository
    provider = Column(String(100), default="Official Docs")
    url = Column(String(500), default="#")
    difficulty = Column(String(50), default="Intermediate")
    estimated_minutes = Column(Integer, default=45)
    skill_covered = Column(String(100), default="")
    recommendation_reason = Column(Text, default="")
    is_completed = Column(Boolean, default=False)

    roadmap_item = relationship("RoadmapItem", back_populates="resources")

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    problem_statement = Column(Text, nullable=False)
    skills_required = Column(JSON, default=list)
    difficulty = Column(String(50), default="Intermediate")
    estimated_duration = Column(String(50), default="2-3 weeks")
    tech_stack = Column(JSON, default=list)
    features = Column(JSON, default=list)
    milestones = Column(JSON, default=list)
    expected_outcomes = Column(Text, default="")
    status = Column(String(50), default="Not Started")  # Not Started, In Progress, Completed
    github_readme = Column(Text, default="")
    resume_bullet = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
