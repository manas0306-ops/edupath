from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import delete
from datetime import datetime, timezone

from backend.app.database import get_db
from backend.app.models.user import User, Profile
from backend.app.models.skill import UserSkill
from backend.app.models.roadmap import Roadmap, RoadmapItem, Resource, Project
from backend.app.schemas.roadmap import (
    RoadmapResponse, RoadmapItemResponse, ResourceResponse,
    RoadmapGenerateRequest, ProjectResponse
)
from backend.app.services.auth import get_current_user
from backend.app.services.roadmap_engine import generate_dynamic_roadmap

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

@router.get("", response_model=RoadmapResponse)
async def get_roadmap(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Roadmap)
        .options(selectinload(Roadmap.items).selectinload(RoadmapItem.resources))
        .filter(Roadmap.user_id == current_user.id, Roadmap.is_active == True)
        .order_by(Roadmap.created_at.desc())
    )
    roadmap = result.scalars().first()
    
    if not roadmap:
        # Generate initial roadmap automatically
        profile_result = await db.execute(select(Profile).filter(Profile.user_id == current_user.id))
        profile = profile_result.scalars().first()
        target_role = profile.target_role if profile else "AI/ML Engineer"
        weekly_hours = profile.weekly_hours if profile else 10
        
        skills_result = await db.execute(select(UserSkill).filter(UserSkill.user_id == current_user.id))
        skills = [s.skill_name for s in skills_result.scalars().all()]
        if not skills:
            skills = ["Python", "SQL", "Git"]
            
        generated = generate_dynamic_roadmap(skills, target_role, weekly_hours)
        
        # Persist to database
        db_roadmap = Roadmap(
            user_id=current_user.id,
            title=generated.title,
            target_role=generated.target_role,
            total_weeks=generated.total_weeks,
            progress_percentage=generated.progress_percentage,
            is_active=True
        )
        db.add(db_roadmap)
        await db.flush()
        
        for item in generated.items:
            db_item = RoadmapItem(
                roadmap_id=db_roadmap.id,
                week_number=item.week_number,
                title=item.title,
                topic=item.topic,
                description=item.description,
                estimated_hours=item.estimated_hours,
                skill_covered=item.skill_covered,
                learning_objectives=item.learning_objectives,
                status=item.status,
                is_adaptive_addition=item.is_adaptive_addition
            )
            db.add(db_item)
            await db.flush()
            
            for res in item.resources:
                db.add(Resource(
                    roadmap_item_id=db_item.id,
                    title=res.title,
                    resource_type=res.resource_type,
                    provider=res.provider,
                    url=res.url,
                    difficulty=res.difficulty,
                    estimated_minutes=res.estimated_minutes,
                    skill_covered=res.skill_covered,
                    recommendation_reason=res.recommendation_reason,
                    is_completed=res.is_completed
                ))
                
        await db.commit()
        return generated

    # Return existing roadmap formatted
    items_response = []
    for item in roadmap.items:
        resources_formatted = [
            ResourceResponse(
                id=r.id,
                title=r.title,
                resource_type=r.resource_type,
                provider=r.provider,
                url=r.url,
                difficulty=r.difficulty,
                estimated_minutes=r.estimated_minutes,
                skill_covered=r.skill_covered,
                recommendation_reason=r.recommendation_reason,
                is_completed=r.is_completed
            )
            for r in item.resources
        ]
        items_response.append(RoadmapItemResponse(
            id=item.id,
            week_number=item.week_number,
            title=item.title,
            topic=item.topic,
            description=item.description,
            estimated_hours=item.estimated_hours,
            skill_covered=item.skill_covered,
            learning_objectives=item.learning_objectives or [],
            status=item.status,
            is_adaptive_addition=item.is_adaptive_addition,
            resources=resources_formatted
        ))

    return RoadmapResponse(
        id=roadmap.id,
        title=roadmap.title,
        target_role=roadmap.target_role,
        total_weeks=roadmap.total_weeks,
        progress_percentage=roadmap.progress_percentage,
        is_active=roadmap.is_active,
        items=items_response
    )

@router.post("/items/{item_id}/toggle")
async def toggle_roadmap_item(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(RoadmapItem)
        .join(Roadmap)
        .filter(RoadmapItem.id == item_id, Roadmap.user_id == current_user.id)
    )
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Roadmap item not found")

    new_status = "completed" if item.status != "completed" else "in_progress"
    item.status = new_status
    item.completed_at = datetime.now(timezone.utc) if new_status == "completed" else None

    # Recalculate roadmap progress
    all_items_res = await db.execute(
        select(RoadmapItem).filter(RoadmapItem.roadmap_id == item.roadmap_id)
    )
    all_items = all_items_res.scalars().all()
    completed_count = sum(1 for it in all_items if it.status == "completed")
    total_count = len(all_items)
    
    roadmap_res = await db.execute(select(Roadmap).filter(Roadmap.id == item.roadmap_id))
    roadmap = roadmap_res.scalars().first()
    if roadmap and total_count > 0:
        roadmap.progress_percentage = round((completed_count / total_count) * 100, 1)

    await db.commit()
    return {
        "item_id": item.id,
        "new_status": new_status,
        "roadmap_progress": roadmap.progress_percentage if roadmap else 0.0
    }

@router.get("/projects", response_model=List[ProjectResponse])
async def list_portfolio_projects(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project).filter(Project.user_id == current_user.id))
    projects = result.scalars().all()
    
    if not projects:
        # Return fallback template project
        return [
            ProjectResponse(
                id="proj-default-1",
                title="AI-Powered Sentiment & Intent Classification API",
                problem_statement="Build and deploy a real-time NLP classification microservice for streaming client communications.",
                skills_required=["Python", "PyTorch", "FastAPI", "Docker"],
                difficulty="Intermediate",
                estimated_duration="2 weeks",
                tech_stack=["PyTorch", "FastAPI", "Docker", "Hugging Face"],
                features=[
                    "Transformer fine-tuning pipeline",
                    "Low-latency asynchronous REST endpoint",
                    "Containerized production Dockerfile"
                ],
                milestones=[
                    "Data ingestion and preprocessing",
                    "Model training and metric evaluation",
                    "FastAPI REST integration",
                    "Docker container deployment"
                ],
                expected_outcomes="High-value portfolio asset demonstrating end-to-end Machine Learning deployment.",
                status="In Progress",
                github_readme="""# Real-Time Intent Classification Microservice
Production-grade asynchronous machine learning API serving fine-tuned transformer weights via FastAPI and Docker.""",
                resume_bullet="Designed and deployed an asynchronous NLP inference engine using PyTorch and FastAPI, achieving sub-25ms latency inside Docker containers."
            )
        ]
        
    return [
        ProjectResponse(
            id=p.id,
            title=p.title,
            problem_statement=p.problem_statement,
            skills_required=p.skills_required or [],
            difficulty=p.difficulty,
            estimated_duration=p.estimated_duration,
            tech_stack=p.tech_stack or [],
            features=p.features or [],
            milestones=p.milestones or [],
            expected_outcomes=p.expected_outcomes,
            status=p.status,
            github_readme=p.github_readme,
            resume_bullet=p.resume_bullet
        )
        for p in projects
    ]
