from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ChatMessagePayload(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    audio_transcribed: Optional[bool] = False
    conversation_id: Optional[str] = None

class ChatMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    language: str
    created_at: datetime

class ConversationResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    messages: List[ChatMessageResponse] = []
