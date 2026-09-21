from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class SkillExtracted(BaseModel):
    name: str
    category: str  # Language, Framework, Tool, Concept, Soft Skill
    proficiency: str  # Beginner, Intermediate, Advanced
    confidence: float

class ExtractedProfileData(BaseModel):
    name: Optional[str] = ""
    education: Optional[str] = ""
    experience_level: Optional[str] = "Beginner"
    technical_skills: List[SkillExtracted] = []
    soft_skills: List[str] = []
    projects_detected: List[str] = []
    tools_and_frameworks: List[str] = []
    raw_summary: str = ""

class SkillConfirmRequest(BaseModel):
    skills: List[SkillExtracted]
    target_role: Optional[str] = "AI/ML Engineer"

class SkillGapItem(BaseModel):
    skill_name: str
    gap_type: str  # Beginner Gap (Unlearned), Intermediate Gap (Partial), Advanced Gap (Missing Req)
    priority: str  # High, Medium, Low
    difficulty: str  # Beginner, Intermediate, Advanced
    estimated_hours: int
    dependencies: List[str] = []
    importance_for_role: str  # Must-have, Important, Nice-to-have
    status: str = "Not Started"

class SkillGapAnalysisResponse(BaseModel):
    target_role: str
    current_skills: List[str]
    missing_skills: List[SkillGapItem]
    partial_skills: List[SkillGapItem]
    mastered_skills: List[str]
    readiness_percentage: float
    total_estimated_hours: int

class SkillGraphNode(BaseModel):
    id: str
    label: str
    category: str
    status: str  # mastered, in_progress, gap, locked
    difficulty: str
    priority: Optional[str] = None

class SkillGraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = "prerequisite"

class SkillGraphData(BaseModel):
    nodes: List[SkillGraphNode]
    edges: List[SkillGraphEdge]
    target_role: str

class TargetRoleInfo(BaseModel):
    id: str
    title: str
    description: str
    average_salary: str
    demand: str
    key_skills: List[str]

class RoleComparisonItem(BaseModel):
    role_id: str
    role_title: str
    description: str
    average_salary: str
    demand: str
    total_required_skills: int
    matched_skills_count: int
    missing_skills_count: int
    readiness_percentage: float
    matched_skills: List[str]
    missing_skills: List[str]
    estimated_weeks_to_ready: int
    difficulty_curve: str

