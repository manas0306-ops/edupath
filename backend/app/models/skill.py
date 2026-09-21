import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from backend.app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Skill(Base):
    __tablename__ = "skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), default="Technical")  # Language, Framework, Library, Tool, Concept, Soft Skill
    description = Column(Text, default="")
    difficulty = Column(String(50), default="Intermediate")  # Beginner, Intermediate, Advanced
    icon = Column(String(50), default="Code")

class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), index=True, nullable=False)
    proficiency = Column(String(50), default="Intermediate")  # Beginner, Intermediate, Advanced, Mastered
    source = Column(String(50), default="manual")  # resume, manual, quiz_verified
    confidence_score = Column(Float, default=0.8)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="skills")

class TargetRole(Base):
    __tablename__ = "target_roles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(150), unique=True, index=True, nullable=False)
    description = Column(Text, default="")
    average_salary = Column(String(100), default="")
    industry_demand = Column(String(50), default="High")  # High, Very High, Moderate

class RoleSkill(Base):
    __tablename__ = "role_skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    role_id = Column(String(36), ForeignKey("target_roles.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    required_level = Column(String(50), default="Intermediate")  # Beginner, Intermediate, Advanced
    importance = Column(String(50), default="Must-have")  # Must-have, Important, Nice-to-have
    category = Column(String(50), default="Core")
    order_index = Column(Integer, default=0)

class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    gap_type = Column(String(50), nullable=False)  # Beginner Gap (Unlearned), Intermediate Gap (Partial), Advanced Gap (Missing Req)
    priority = Column(String(50), default="High")  # High, Medium, Low
    difficulty = Column(String(50), default="Intermediate")
    estimated_hours = Column(Integer, default=15)
    dependencies = Column(JSON, default=list)  # list of prerequisite skill names
    importance_for_role = Column(String(50), default="Must-have")
    status = Column(String(50), default="Not Started")  # Not Started, In Progress, Completed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
