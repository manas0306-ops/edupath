import uuid
from typing import List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.models.roadmap import Roadmap, RoadmapItem, Resource
from backend.app.models.report import AdaptiveLog
from backend.app.models.practice import PracticeAttempt

async def evaluate_and_adapt_roadmap(
    user_id: str,
    topic: str,
    accuracy: float,
    db: AsyncSession
) -> Optional[str]:
    """
    Analyzes student performance on a topic and modifies roadmap if struggle is detected.
    """
    if accuracy < 65.0:
        # Trigger Adaptive Action: Weakness detected
        action_msg = f"Struggle detected in '{topic}' ({accuracy:.0f}% accuracy). Inserted adaptive revision module and targeted exercises into active roadmap."
        
        # Log to adaptive logs
        log_entry = AdaptiveLog(
            user_id=user_id,
            trigger_type="struggle_detected",
            topic=topic,
            accuracy_score=accuracy,
            action_taken=action_msg
        )
        db.add(log_entry)
        
        # Locate active roadmap
        result = await db.execute(
            select(Roadmap).filter(Roadmap.user_id == user_id, Roadmap.is_active == True)
        )
        active_roadmap = result.scalars().first()
        
        if active_roadmap:
            # Check if revision already exists to prevent duplicate spam
            item_result = await db.execute(
                select(RoadmapItem).filter(
                    RoadmapItem.roadmap_id == active_roadmap.id,
                    RoadmapItem.title.like(f"%Revision: {topic}%")
                )
            )
            existing_revision = item_result.scalars().first()
            
            if not existing_revision:
                # Add revision item
                revision_item = RoadmapItem(
                    roadmap_id=active_roadmap.id,
                    week_number=active_roadmap.total_weeks + 1,
                    title=f"Adaptive Revision: Deep Dive on {topic}",
                    topic=topic,
                    description=f"AI-generated reinforcement module to solidify understanding of {topic} before tackling advanced dependencies.",
                    estimated_hours=6,
                    skill_covered=topic,
                    learning_objectives=[
                        f"Review core pitfalls and edge cases in {topic}.",
                        f"Complete 3 targeted remedial coding exercises.",
                        f"Retake mastery quiz with >=85% target threshold."
                    ],
                    status="needs_revision",
                    is_adaptive_addition=True
                )
                db.add(revision_item)
                await db.flush()
                
                # Add supplementary resource
                supp_resource = Resource(
                    roadmap_item_id=revision_item.id,
                    title=f"{topic} Concept Breakdown & Debugging Walkthrough",
                    resource_type="Tutorial",
                    provider="EduPath Adaptive Mentor",
                    url="#",
                    difficulty="Beginner",
                    estimated_minutes=45,
                    skill_covered=topic,
                    recommendation_reason=f"Recommended automatically by the Adaptive Learning Engine to address identified conceptual gaps in {topic}."
                )
                db.add(supp_resource)
                
            await db.commit()
            return action_msg
            
    elif accuracy >= 90.0:
        # High performance: Fast-track next topic
        action_msg = f"Mastery demonstrated in '{topic}' ({accuracy:.0f}% accuracy)! Next module unlocked ahead of schedule."
        log_entry = AdaptiveLog(
            user_id=user_id,
            trigger_type="accelerated_mastery",
            topic=topic,
            accuracy_score=accuracy,
            action_taken=action_msg
        )
        db.add(log_entry)
        await db.commit()
        return action_msg
        
    return None
