from backend.app.database import Base
from backend.app.models.user import User, Profile
from backend.app.models.skill import Skill, UserSkill, TargetRole, RoleSkill, SkillGap
from backend.app.models.roadmap import Roadmap, RoadmapItem, Resource, Project
from backend.app.models.practice import PracticeTask, PracticeAttempt
from backend.app.models.chat import Conversation, ChatMessage
from backend.app.models.report import WeeklyReport, Achievement, AdaptiveLog

__all__ = [
    "Base",
    "User",
    "Profile",
    "Skill",
    "UserSkill",
    "TargetRole",
    "RoleSkill",
    "SkillGap",
    "Roadmap",
    "RoadmapItem",
    "Resource",
    "Project",
    "PracticeTask",
    "PracticeAttempt",
    "Conversation",
    "ChatMessage",
    "WeeklyReport",
    "Achievement",
    "AdaptiveLog"
]
