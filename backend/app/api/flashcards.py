from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List, Dict
import random
import uuid

from backend.app.schemas.flashcards import (
    FlashcardItem,
    FlashcardDeckResponse,
    FlashcardStatusUpdate,
    FlashcardGenerateRequest
)
from backend.app.services.flashcards_data import (
    PROGRAMMING_FLASHCARDS,
    AVAILABLE_TOPICS
)
from backend.app.services.auth import get_current_user
from backend.app.models.user import User

router = APIRouter(prefix="/flashcards", tags=["Programming Flashcards"])

# In-memory card state store (user card status)
USER_CARD_STATE: Dict[str, Dict[str, str]] = {}  # user_id -> {card_id: "mastered" | "review_later"}

@router.get("", response_model=FlashcardDeckResponse)
async def get_flashcards(
    topic: Optional[str] = Query("all", description="Topic filter: python, sql, pytorch, ml, fastapi, docker, or all"),
    difficulty: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    user_id = str(current_user.id)
    user_state = USER_CARD_STATE.get(user_id, {})

    filtered = PROGRAMMING_FLASHCARDS
    if topic and topic.lower() != "all":
        filtered = [c for c in filtered if c["topic"].lower() == topic.lower()]

    if difficulty:
        filtered = [c for c in filtered if c["difficulty"].lower() == difficulty.lower()]

    # Hydrate user state
    cards_response: List[FlashcardItem] = []
    mastered_count = 0
    review_count = 0

    for c in filtered:
        status = user_state.get(c["id"])
        is_m = (status == "mastered")
        is_r = (status == "review_later")
        if is_m:
            mastered_count += 1
        if is_r:
            review_count += 1

        cards_response.append(
            FlashcardItem(
                id=c["id"],
                topic=c["topic"],
                subtopic=c.get("subtopic"),
                difficulty=c["difficulty"],
                front_prompt=c["front_prompt"],
                code_snippet=c.get("code_snippet"),
                back_answer=c["back_answer"],
                key_takeaway=c["key_takeaway"],
                explanations=c["explanations"],
                tags=c.get("tags", []),
                is_mastered=is_m,
                needs_review=is_r
            )
        )

    return FlashcardDeckResponse(
        topic=topic or "all",
        total_cards=len(cards_response),
        mastered_count=mastered_count,
        review_count=review_count,
        cards=cards_response,
        available_topics=AVAILABLE_TOPICS
    )

@router.post("/{card_id}/status")
async def update_card_status(
    card_id: str,
    payload: FlashcardStatusUpdate,
    current_user: User = Depends(get_current_user)
):
    user_id = str(current_user.id)
    if user_id not in USER_CARD_STATE:
        USER_CARD_STATE[user_id] = {}

    if payload.status in ["mastered", "review_later"]:
        USER_CARD_STATE[user_id][card_id] = payload.status
    elif payload.status == "reset":
        USER_CARD_STATE[user_id].pop(card_id, None)

    return {
        "success": True,
        "card_id": card_id,
        "status": payload.status
    }

@router.post("/generate", response_model=FlashcardDeckResponse)
async def generate_custom_flashcards(
    payload: FlashcardGenerateRequest,
    current_user: User = Depends(get_current_user)
):
    topic = payload.topic.lower()
    subtopic = payload.subtopic or "Core Patterns"

    # Check existing or synthesize dynamic card
    matched = [c for c in PROGRAMMING_FLASHCARDS if c["topic"].lower() == topic]
    
    if not matched:
        # Create dynamic card for requested topic
        dynamic_card = {
            "id": f"fc-gen-{uuid.uuid4().hex[:6]}",
            "topic": topic,
            "subtopic": subtopic,
            "difficulty": payload.difficulty or "Intermediate",
            "front_prompt": f"What is the recommended architectural pattern when structuring scalable code in {payload.topic}?",
            "code_snippet": f"# Best practice template for {payload.topic}\nclass ConfiguredPipeline:\n    def __init__(self, config):\n        self.config = config",
            "back_answer": f"Decoupled components, single responsibility, and explicit dependency injection.",
            "key_takeaway": f"Separate configuration from business logic to maximize testability and scalability in {payload.topic}.",
            "explanations": {
                "en": f"In {payload.topic}, enterprise architecture dictates that components remain modular with clearly defined interface contracts.",
                "hi": f"{payload.topic} में एंटरप्राइज आर्किटेक्चर यह मांग करता है कि घटक पूरी तरह से मॉड्यूलर रहें।",
                "pa": f"{payload.topic} ਵਿੱਚ ਉਦਯੋਗਿਕ ਮਿਆਰ ਮੰਗ ਕਰਦੇ ਹਨ ਕਿ ਹਰ ਮਾਡਿਊਲ ਸੁਤੰਤਰ ਰਹੇ।",
                "es": f"En {payload.topic}, la arquitectura empresarial exige que los componentes sean modulares con contratos de interfaz claros.",
                "fr": f"Dans {payload.topic}, l'architecture d'entreprise impose des composants modulaires aux contrats d'interface stricts.",
                "de": f"In {payload.topic} erfordert die Unternehmensarchitektur modulare Komponenten mit klar definierten Schnittstellen.",
                "ja": f"{payload.topic}では、明確に定義されたインターフェースを持つモジュール設計が業界標準です。"
            },
            "tags": [payload.topic.capitalize(), "Architecture", "Design Patterns"]
        }
        PROGRAMMING_FLASHCARDS.append(dynamic_card)
        matched = [dynamic_card]

    user_id = str(current_user.id)
    user_state = USER_CARD_STATE.get(user_id, {})

    cards_response = [
        FlashcardItem(
            id=c["id"],
            topic=c["topic"],
            subtopic=c.get("subtopic"),
            difficulty=c["difficulty"],
            front_prompt=c["front_prompt"],
            code_snippet=c.get("code_snippet"),
            back_answer=c["back_answer"],
            key_takeaway=c["key_takeaway"],
            explanations=c["explanations"],
            tags=c.get("tags", []),
            is_mastered=(user_state.get(c["id"]) == "mastered"),
            needs_review=(user_state.get(c["id"]) == "review_later")
        )
        for c in matched
    ]

    return FlashcardDeckResponse(
        topic=topic,
        total_cards=len(cards_response),
        mastered_count=sum(1 for c in cards_response if c.is_mastered),
        review_count=sum(1 for c in cards_response if c.needs_review),
        cards=cards_response,
        available_topics=AVAILABLE_TOPICS
    )
