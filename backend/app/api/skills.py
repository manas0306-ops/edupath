from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete

from backend.app.database import get_db
from backend.app.models.user import User, Profile
from backend.app.models.skill import UserSkill, SkillGap
from backend.app.schemas.skill import (
    SkillExtracted, SkillConfirmRequest, SkillGapAnalysisResponse,
    SkillGraphData, TargetRoleInfo
)
from backend.app.services.auth import get_current_user
from backend.app.services.skill_gap import (
    get_available_roles, compute_skill_gaps, build_skill_graph
)

router = APIRouter(prefix="/skills", tags=["Skills & Gap Analysis"])

@router.get("/roles", response_model=List[TargetRoleInfo])
async def list_target_roles():
    return get_available_roles()

@router.get("/my-skills", response_model=List[SkillExtracted])
async def get_my_skills(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(UserSkill).filter(UserSkill.user_id == current_user.id))
    skills = result.scalars().all()
    return [
        SkillExtracted(
            name=s.skill_name,
            category="Technical",
            proficiency=s.proficiency,
            confidence=s.confidence_score
        )
        for s in skills
    ]

@router.post("/confirm")
async def confirm_skills(
    payload: SkillConfirmRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # 1. Update target role in profile if provided
    profile_result = await db.execute(select(Profile).filter(Profile.user_id == current_user.id))
    profile = profile_result.scalars().first()
    if profile and payload.target_role:
        profile.target_role = payload.target_role
        
    # 2. Clear old user skills and save confirmed skills
    await db.execute(delete(UserSkill).filter(UserSkill.user_id == current_user.id))
    
    skill_names = []
    for s in payload.skills:
        skill_names.append(s.name)
        db.add(UserSkill(
            user_id=current_user.id,
            skill_name=s.name,
            proficiency=s.proficiency,
            source="confirmed_profile",
            confidence_score=s.confidence,
            verified=True
        ))
        
    # 3. Compute and store new skill gaps
    role_to_use = payload.target_role or (profile.target_role if profile else "AI/ML Engineer")
    gap_result = compute_skill_gaps(skill_names, role_to_use)
    
    await db.execute(delete(SkillGap).filter(SkillGap.user_id == current_user.id))
    for gap in gap_result.partial_skills + gap_result.missing_skills:
        db.add(SkillGap(
            user_id=current_user.id,
            skill_name=gap.skill_name,
            gap_type=gap.gap_type,
            priority=gap.priority,
            difficulty=gap.difficulty,
            estimated_hours=gap.estimated_hours,
            dependencies=gap.dependencies,
            importance_for_role=gap.importance_for_role,
            status="Not Started"
        ))
        
    await db.commit()
    return {
        "status": "success",
        "saved_skills_count": len(payload.skills),
        "target_role": role_to_use,
        "gaps_identified_count": len(gap_result.missing_skills) + len(gap_result.partial_skills)
    }

@router.post("/gap-analysis", response_model=SkillGapAnalysisResponse)
async def analyze_skill_gaps(
    target_role: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    profile_result = await db.execute(select(Profile).filter(Profile.user_id == current_user.id))
    profile = profile_result.scalars().first()
    role = target_role or (profile.target_role if profile else "AI/ML Engineer")

    skills_result = await db.execute(select(UserSkill).filter(UserSkill.user_id == current_user.id))
    skills = [s.skill_name for s in skills_result.scalars().all()]
    
    # If no skills saved yet, provide default fallback for demoing
    if not skills:
        skills = ["Python", "SQL", "Git"]

    return compute_skill_gaps(skills, role)

@router.get("/graph", response_model=SkillGraphData)
async def get_skill_graph(
    target_role: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    profile_result = await db.execute(select(Profile).filter(Profile.user_id == current_user.id))
    profile = profile_result.scalars().first()
    role = target_role or (profile.target_role if profile else "AI/ML Engineer")

    skills_result = await db.execute(select(UserSkill).filter(UserSkill.user_id == current_user.id))
    skills = [s.skill_name for s in skills_result.scalars().all()]
    if not skills:
        skills = ["Python", "SQL", "Git"]

    return build_skill_graph(skills, role)
