from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from typing import Optional

from backend.app.schemas.skill import ExtractedProfileData
from backend.app.services.document_parser import parse_document_text, extract_profile_from_text
from backend.app.services.auth import get_current_user
from backend.app.models.user import User

router = APIRouter(prefix="/documents", tags=["Documents"])

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB limit

@router.post("/upload", response_model=ExtractedProfileData)
async def upload_document(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user)
):
    text_content = ""
    
    if file:
        filename = file.filename or "uploaded_document.txt"
        valid_extensions = (".pdf", ".docx", ".txt", ".md")
        if not any(filename.lower().endswith(ext) for ext in valid_extensions):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file format. Please upload a PDF, DOCX, or TXT document."
            )
            
        file_bytes = await file.read()
        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds the 10 MB limit."
            )
            
        text_content = parse_document_text(filename, file_bytes)
        
    elif raw_text:
        text_content = raw_text
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a resume document or project text description."
        )

    if not text_content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract readable text from the provided document."
        )

    extracted = extract_profile_from_text(text_content)
    return extracted
