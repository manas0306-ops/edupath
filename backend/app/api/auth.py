from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from backend.app.database import get_db
from backend.app.models.user import User, Profile
from backend.app.schemas.user import UserRegister, UserLogin, TokenResponse, UserResponse, ProfileResponse
from backend.app.services.auth import hash_password, verify_password, create_access_token, get_current_user
from backend.app.services.demo_seed import seed_demo_data_if_needed, DEMO_USER_EMAIL

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == payload.email.lower()))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user = User(
        name=payload.name,
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        is_active=True,
        is_demo=False
    )
    db.add(user)
    await db.flush()

    profile = Profile(
        user_id=user.id,
        current_role="Student / Aspiring Engineer",
        target_role="AI/ML Engineer",
        experience_level="Beginner",
        weekly_hours=10
    )
    db.add(profile)
    await db.commit()

    token = create_access_token({"sub": user.id})
    
    # Reload with profile
    result = await db.execute(
        select(User).options(selectinload(User.profile)).filter(User.id == user.id)
    )
    full_user = result.scalars().first()
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(full_user)
    )

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).options(selectinload(User.profile)).filter(User.email == payload.email.lower())
    )
    user = result.scalars().first()
    
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials."
        )

    token = create_access_token({"sub": user.id})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/demo", response_model=TokenResponse)
async def login_as_demo(db: AsyncSession = Depends(get_db)):
    demo_user = await seed_demo_data_if_needed(db)
    token = create_access_token({"sub": demo_user.id})
    
    result = await db.execute(
        select(User).options(selectinload(User.profile)).filter(User.id == demo_user.id)
    )
    full_user = result.scalars().first()
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(full_user)
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).options(selectinload(User.profile)).filter(User.id == current_user.id)
    )
    user = result.scalars().first()
    return UserResponse.model_validate(user)
