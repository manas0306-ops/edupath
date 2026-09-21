from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.database import get_db
from backend.app.models.user import User, Profile
from backend.app.schemas.practice import PracticeTaskResponse, PracticeSubmitRequest, PracticeResultResponse
from backend.app.services.auth import get_current_user
from backend.app.services.practice_engine import get_practice_for_skill, evaluate_practice_attempt
from backend.app.services.adaptive_engine import evaluate_and_adapt_roadmap

router = APIRouter(prefix="/practice", tags=["Practice & Assessment"])

@router.get("/{skill_name}", response_model=List[PracticeTaskResponse])
async def get_practice_tasks(
    skill_name: str,
    current_user: User = Depends(get_current_user)
):
    return get_practice_for_skill(skill_name)

@router.post("/submit", response_model=PracticeResultResponse)
async def submit_practice_task(
    payload: PracticeSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Evaluate attempt
    result = evaluate_practice_attempt(payload.task_id, payload.user_answer, payload.time_taken_seconds)
    
    # Update user XP and streak in Profile
    profile_res = await db.execute(select(Profile).filter(Profile.user_id == current_user.id))
    profile = profile_res.scalars().first()
    if profile:
        profile.xp += result.xp_earned
        
    # Trigger Adaptive Engine
    topic = payload.task_id.split("-")[0].upper()
    adaptive_message = await evaluate_and_adapt_roadmap(
        user_id=current_user.id,
        topic=topic,
        accuracy=result.score,
        db=db
    )
    if adaptive_message:
        result.adaptive_action = adaptive_message

    await db.commit()
    return result
