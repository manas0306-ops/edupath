from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class WeeklyReportResponse(BaseModel):
    id: str
    report_title: str
    week_start_date: datetime
    skills_acquired: List[str]
    skills_improving: List[str]
    weak_areas: List[str]
    completed_activities_count: int
    practice_accuracy_percentage: float
    learning_hours_logged: float
    recommended_next_week: str
    ai_summary: str

class AchievementResponse(BaseModel):
    id: str
    badge_key: str
    title: str
    description: str
    icon: str
    earned_at: datetime

class DashboardStatsResponse(BaseModel):
    overall_progress_percentage: float
    skills_acquired_count: int
    skills_in_progress_count: int
    remaining_gaps_count: int
    total_learning_hours: float
    practice_accuracy: float
    streak_days: int
    xp: int
    today_goals: List[Dict[str, Any]]
    struggle_topics: List[str]
    ai_insights: str
    recommended_next_step: str
