from pydantic import BaseModel
from typing import List, Optional

class ResourceResponse(BaseModel):
    id: str
    title: str
    resource_type: str
    provider: str
    url: str
    difficulty: str
    estimated_minutes: int
    skill_covered: str
    recommendation_reason: str
    is_completed: bool

class RoadmapItemResponse(BaseModel):
    id: str
    week_number: int
    title: str
    topic: str
    description: str
    estimated_hours: int
    skill_covered: str
    learning_objectives: List[str]
    status: str
    is_adaptive_addition: bool
    resources: List[ResourceResponse] = []

class RoadmapResponse(BaseModel):
    id: str
    title: str
    target_role: str
    total_weeks: int
    progress_percentage: float
    is_active: bool
    items: List[RoadmapItemResponse] = []

class RoadmapGenerateRequest(BaseModel):
    target_role: Optional[str] = None
    weekly_hours: Optional[int] = None

class ProjectResponse(BaseModel):
    id: str
    title: str
    problem_statement: str
    skills_required: List[str]
    difficulty: str
    estimated_duration: str
    tech_stack: List[str]
    features: List[str]
    milestones: List[str]
    expected_outcomes: str
    status: str
    github_readme: str
    resume_bullet: str

class ProjectGenerateRequest(BaseModel):
    topic: Optional[str] = None
    difficulty: Optional[str] = "Intermediate"
    target_skills: Optional[List[str]] = None

class ProjectUpdateRequest(BaseModel):
    title: Optional[str] = None
    problem_statement: Optional[str] = None
    github_readme: Optional[str] = None
    resume_bullet: Optional[str] = None
    status: Optional[str] = None

