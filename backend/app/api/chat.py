import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from backend.app.database import get_db
from backend.app.models.user import User, Profile
from backend.app.models.skill import UserSkill, SkillGap
from backend.app.models.roadmap import Roadmap
from backend.app.models.chat import Conversation, ChatMessage
from backend.app.models.report import AdaptiveLog
from backend.app.schemas.chat import ChatRequest, ChatMessageResponse, ConversationResponse
from backend.app.services.auth import get_current_user
from backend.app.services.ai_service import query_ai_mentor

router = APIRouter(prefix="/chat", tags=["AI Mentor Chat"])

@router.post("", response_model=ChatMessageResponse)
async def send_chat_message(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # 1. Gather comprehensive learner context
    profile_res = await db.execute(select(Profile).filter(Profile.user_id == current_user.id))
    profile = profile_res.scalars().first()
    
    skills_res = await db.execute(select(UserSkill).filter(UserSkill.user_id == current_user.id))
    current_skills = [s.skill_name for s in skills_res.scalars().all()] or ["Python", "SQL", "Git"]
    
    gaps_res = await db.execute(select(SkillGap).filter(SkillGap.user_id == current_user.id))
    gaps = [g.skill_name for g in gaps_res.scalars().all()] or ["Deep Learning", "PyTorch", "MLOps"]
    
    struggles_res = await db.execute(
        select(AdaptiveLog.topic).filter(AdaptiveLog.user_id == current_user.id).limit(3)
    )
    weak_areas = [t for t in struggles_res.scalars().all()] or ["SQL Joins"]
    
    context = {
        "name": current_user.name,
        "target_role": profile.target_role if profile else "AI/ML Engineer",
        "experience_level": profile.experience_level if profile else "Beginner",
        "current_skills": current_skills,
        "skill_gaps": gaps,
        "weak_areas": weak_areas,
        "weekly_hours": profile.weekly_hours if profile else 10
    }
    
    # 2. Get or create conversation
    conv_id = payload.conversation_id
    conversation = None
    if conv_id:
        conv_res = await db.execute(select(Conversation).filter(Conversation.id == conv_id, Conversation.user_id == current_user.id))
        conversation = conv_res.scalars().first()
        
    if not conversation:
        conversation = Conversation(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            title=f"Chat: {payload.message[:30]}..."
        )
        db.add(conversation)
        await db.flush()
        
    # 3. Store user message
    user_msg = ChatMessage(
        id=str(uuid.uuid4()),
        conversation_id=conversation.id,
        role="user",
        content=payload.message,
        language=payload.language or "en",
        audio_transcribed=payload.audio_transcribed or False
    )
    db.add(user_msg)
    
    # 4. Generate AI Mentor Response
    ai_reply_text = await query_ai_mentor(
        query=payload.message,
        context=context,
        language=payload.language or "en"
    )
    
    # 5. Store assistant message
    assistant_msg = ChatMessage(
        id=str(uuid.uuid4()),
        conversation_id=conversation.id,
        role="assistant",
        content=ai_reply_text,
        language=payload.language or "en",
        audio_transcribed=False
    )
    db.add(assistant_msg)
    await db.commit()
    
    return ChatMessageResponse(
        id=assistant_msg.id,
        role=assistant_msg.role,
        content=assistant_msg.content,
        language=assistant_msg.language,
        created_at=assistant_msg.created_at
    )

@router.get("/history", response_model=list[ConversationResponse])
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Conversation)
        .options(selectinload(Conversation.messages))
        .filter(Conversation.user_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
    )
    conversations = result.scalars().all()
    
    response = []
    for c in conversations:
        msgs = [
            ChatMessageResponse(
                id=m.id,
                role=m.role,
                content=m.content,
                language=m.language,
                created_at=m.created_at
            )
            for m in c.messages
        ]
        response.append(ConversationResponse(
            id=c.id,
            title=c.title,
            created_at=c.created_at,
            messages=msgs
        ))
    return response
