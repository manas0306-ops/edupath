from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
import random
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.database import get_db
from backend.app.models.user import User, Profile
from backend.app.schemas.practice import (
    PracticeTaskResponse,
    PracticeSubmitRequest,
    PracticeResultResponse
)
from backend.app.schemas.flashcards import (
    QuizCreateRequest,
    QuizQuestion,
    QuizSubmissionRequest,
    QuizEvaluationResponse,
    QuizQuestionResult
)
from backend.app.services.auth import get_current_user
from backend.app.services.practice_engine import get_practice_for_skill, evaluate_practice_attempt
from backend.app.services.adaptive_engine import evaluate_and_adapt_roadmap
from backend.app.services.flashcards_data import (
    SELF_ASSESSMENT_QUIZ_BANK,
    AVAILABLE_TOPICS
)

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

# --- SELF-ASSESSMENT QUIZ ENDPOINTS ---

@router.post("/quiz/create", response_model=List[QuizQuestion])
async def create_self_assessment_quiz(
    payload: QuizCreateRequest,
    current_user: User = Depends(get_current_user)
):
    topic = payload.topic.lower()
    pool = SELF_ASSESSMENT_QUIZ_BANK

    if topic != "all":
        pool = [q for q in pool if q["topic"].lower() == topic]

    # If pool has fewer questions than requested or topic has no questions yet, use all available
    if not pool:
        pool = SELF_ASSESSMENT_QUIZ_BANK

    num_q = min(payload.num_questions or 5, len(pool))
    selected = random.sample(pool, num_q) if len(pool) >= num_q else pool

    return [
        QuizQuestion(
            id=q["id"],
            topic=q["topic"],
            difficulty=q["difficulty"],
            title=q["title"],
            question=q["question"],
            code_snippet=q.get("code_snippet"),
            options=q["options"],
            correct_answer=q["correct_answer"],
            hint=q.get("hint"),
            explanations=q["explanations"]
        )
        for q in selected
    ]

@router.post("/quiz/evaluate", response_model=QuizEvaluationResponse)
async def evaluate_self_assessment_quiz(
    payload: QuizSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Lookup bank by question ID
    q_map = {q["id"]: q for q in SELF_ASSESSMENT_QUIZ_BANK}

    results: List[QuizQuestionResult] = []
    correct_count = 0
    total = len(payload.answers) if payload.answers else 1

    for q_id, user_ans in payload.answers.items():
        q_data = q_map.get(q_id)
        if not q_data:
            continue

        is_correct = (user_ans.strip().lower() == q_data["correct_answer"].strip().lower())
        if is_correct:
            correct_count += 1

        results.append(
            QuizQuestionResult(
                id=q_data["id"],
                title=q_data["title"],
                question=q_data["question"],
                code_snippet=q_data.get("code_snippet"),
                user_answer=user_ans,
                correct_answer=q_data["correct_answer"],
                is_correct=is_correct,
                hint=q_data.get("hint"),
                explanations=q_data["explanations"]
            )
        )

    score_pct = round((correct_count / (len(results) or 1)) * 100, 1)
    xp_earned = (correct_count * 25) + 15
    struggle = score_pct < 70.0

    # Award XP in Profile
    profile_res = await db.execute(select(Profile).filter(Profile.user_id == current_user.id))
    profile = profile_res.scalars().first()
    if profile:
        profile.xp += xp_earned

    # Trigger Adaptive Engine
    adaptive_action = None
    if struggle:
        adaptive_action = await evaluate_and_adapt_roadmap(
            user_id=current_user.id,
            topic=payload.topic.upper(),
            accuracy=score_pct,
            db=db
        )
    await db.commit()

    feedback = (
        "Outstanding mastery! You have demonstrated exceptional command across all evaluated concepts."
        if score_pct >= 90
        else "Solid performance! Review the detailed explanations below to cement any tricky edge cases."
        if score_pct >= 70
        else "Good effort! Focused revision modules have been highlighted for these topics."
    )

    return QuizEvaluationResponse(
        topic=payload.topic,
        score_percentage=score_pct,
        correct_count=correct_count,
        total_questions=len(results),
        xp_earned=xp_earned,
        time_taken_seconds=payload.time_taken_seconds,
        feedback=feedback,
        struggle_detected=struggle,
        adaptive_action=adaptive_action,
        results=results
    )
