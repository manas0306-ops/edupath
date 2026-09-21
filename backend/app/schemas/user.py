from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ProfileBase(BaseModel):
    current_role: Optional[str] = "Student / Aspiring Engineer"
    target_role: Optional[str] = "AI/ML Engineer"
    experience_level: Optional[str] = "Beginner"
    education: Optional[str] = ""
    career_goal: Optional[str] = ""
    weekly_hours: Optional[int] = 10
    preferred_learning_style: Optional[str] = "Hands-on / Practical"
    preferred_language: Optional[str] = "en"

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: str
    user_id: str
    xp: int
    streak_days: int

    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    is_demo: bool
    created_at: datetime
    profile: Optional[ProfileResponse] = None

    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
