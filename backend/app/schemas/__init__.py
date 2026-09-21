from backend.app.schemas.user import UserRegister, UserLogin, TokenResponse, UserResponse, ProfileUpdate, ProfileResponse
from backend.app.schemas.skill import SkillExtracted, ExtractedProfileData, SkillConfirmRequest, SkillGapItem, SkillGapAnalysisResponse, SkillGraphData, TargetRoleInfo
from backend.app.schemas.roadmap import RoadmapResponse, RoadmapItemResponse, ResourceResponse, RoadmapGenerateRequest, ProjectResponse
from backend.app.schemas.practice import PracticeTaskResponse, PracticeSubmitRequest, PracticeResultResponse
from backend.app.schemas.chat import ChatRequest, ChatMessageResponse, ConversationResponse
from backend.app.schemas.report import WeeklyReportResponse, AchievementResponse, DashboardStatsResponse

__all__ = [
    "UserRegister", "UserLogin", "TokenResponse", "UserResponse", "ProfileUpdate", "ProfileResponse",
    "SkillExtracted", "ExtractedProfileData", "SkillConfirmRequest", "SkillGapItem", "SkillGapAnalysisResponse", "SkillGraphData", "TargetRoleInfo",
    "RoadmapResponse", "RoadmapItemResponse", "ResourceResponse", "RoadmapGenerateRequest", "ProjectResponse",
    "PracticeTaskResponse", "PracticeSubmitRequest", "PracticeResultResponse",
    "ChatRequest", "ChatMessageResponse", "ConversationResponse",
    "WeeklyReportResponse", "AchievementResponse", "DashboardStatsResponse"
]
