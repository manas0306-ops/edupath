import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.models.user import User, Profile
from backend.app.models.skill import UserSkill, SkillGap
from backend.app.models.roadmap import Roadmap, RoadmapItem, Resource, Project
from backend.app.models.practice import PracticeTask, PracticeAttempt
from backend.app.models.report import WeeklyReport, Achievement, AdaptiveLog
from backend.app.services.auth import hash_password
from backend.app.services.roadmap_engine import RESOURCE_CATALOG

DEMO_USER_EMAIL = "alex@edupath.ai"

async def seed_demo_data_if_needed(db: AsyncSession):
    # Check if demo user already exists
    result = await db.execute(select(User).filter(User.email == DEMO_USER_EMAIL))
    existing_user = result.scalars().first()
    if existing_user:
        return existing_user

    # 1. Create Demo User
    demo_user = User(
        id=str(uuid.uuid4()),
        email=DEMO_USER_EMAIL,
        hashed_password=hash_password("edupath2026"),
        name="Alex Rivera",
        is_active=True,
        is_demo=True,
        created_at=datetime.now(timezone.utc) - timedelta(days=14)
    )
    db.add(demo_user)
    await db.flush()

    # 2. Create Profile
    profile = Profile(
        user_id=demo_user.id,
        current_role="Junior Data Analyst",
        target_role="AI/ML Engineer",
        experience_level="Intermediate",
        education="B.S. in Computer Science",
        career_goal="Transition into a high-impact Machine Learning Engineering role building scalable deep learning systems.",
        weekly_hours=12,
        preferred_learning_style="Hands-on / Practical",
        preferred_language="en",
        xp=480,
        streak_days=5,
        last_active_date=datetime.now(timezone.utc)
    )
    db.add(profile)

    # 3. Create Current Skills
    current_skills_data = [
        ("Python", "Advanced", 0.95),
        ("SQL", "Intermediate", 0.85),
        ("Machine Learning", "Intermediate", 0.80),
        ("Git", "Intermediate", 0.90),
        ("Pandas", "Intermediate", 0.88),
        ("NumPy", "Intermediate", 0.85)
    ]
    for skill_name, prof, conf in current_skills_data:
        db.add(UserSkill(
            user_id=demo_user.id,
            skill_name=skill_name,
            proficiency=prof,
            source="resume",
            confidence_score=conf,
            verified=True
        ))

    # 4. Create Skill Gaps
    gaps_data = [
        ("Deep Learning", "Intermediate Gap (Partial Knowledge)", "High", "Advanced", 35, ["Machine Learning"]),
        ("PyTorch", "Advanced Gap (Missing Requirement)", "High", "Advanced", 40, ["Deep Learning", "Python"]),
        ("Model Deployment", "Intermediate Gap (Partial Knowledge)", "High", "Intermediate", 25, ["PyTorch", "FastAPI"]),
        ("MLOps", "Advanced Gap (Missing Requirement)", "High", "Advanced", 30, ["Model Deployment", "Docker"]),
        ("Docker", "Beginner Gap (Unlearned Concept)", "Medium", "Intermediate", 15, [])
    ]
    for name, g_type, priority, diff, hours, deps in gaps_data:
        db.add(SkillGap(
            user_id=demo_user.id,
            skill_name=name,
            gap_type=g_type,
            priority=priority,
            difficulty=diff,
            estimated_hours=hours,
            dependencies=deps,
            importance_for_role="Must-have",
            status="In Progress" if name == "PyTorch" else "Not Started"
        ))

    # 5. Create Roadmap & RoadmapItems
    roadmap = Roadmap(
        id=str(uuid.uuid4()),
        user_id=demo_user.id,
        title="AI/ML Engineer Acceleration Roadmap",
        target_role="AI/ML Engineer",
        total_weeks=6,
        progress_percentage=28.5,
        is_active=True
    )
    db.add(roadmap)
    await db.flush()

    weeks_topics = [
        (1, "Deep Learning Fundamentals", "Deep Learning", "completed", False),
        (2, "PyTorch Tensor Operations & Autograd", "PyTorch", "in_progress", False),
        (3, "Neural Network Architectures (CNNs & Transformers)", "PyTorch", "pending", False),
        (4, "Model Deployment with FastAPI", "Model Deployment", "pending", False),
        (5, "Containerization with Docker", "Docker", "pending", False),
        (6, "Production MLOps & CI/CD Pipelines", "MLOps", "pending", False)
    ]

    for week_num, title, skill, status, is_adapt in weeks_topics:
        item = RoadmapItem(
            roadmap_id=roadmap.id,
            week_number=week_num,
            title=title,
            topic=skill,
            description=f"Focused mastery of {skill} according to industry production standards.",
            estimated_hours=12,
            skill_covered=skill,
            learning_objectives=[
                f"Master core architecture patterns of {skill}.",
                f"Complete end-of-week implementation lab for {skill}.",
                f"Pass the {skill} technical assessment with >=80% accuracy."
            ],
            status=status,
            is_adaptive_addition=is_adapt,
            completed_at=datetime.now(timezone.utc) - timedelta(days=7) if status == "completed" else None
        )
        db.add(item)
        await db.flush()

        # Add resources
        raw_res = RESOURCE_CATALOG.get(skill, [])
        for r in raw_res:
            db.add(Resource(
                roadmap_item_id=item.id,
                title=r["title"],
                resource_type=r["type"],
                provider=r["provider"],
                url=r["url"],
                difficulty=r["difficulty"],
                estimated_minutes=r["minutes"],
                skill_covered=skill,
                recommendation_reason=r["reason"],
                is_completed=(status == "completed")
            ))

    # 6. Seed Practice Attempt demonstrating Adaptive Learning
    adaptive_task = PracticeTask(
        id=str(uuid.uuid4()),
        skill_name="SQL",
        task_type="mcq",
        difficulty="Intermediate",
        title="Complex Multi-Table SQL Joins",
        question="Which query correctly retrieves all users with their orders, including users who have never placed an order?",
        correct_answer="SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id",
        explanation="LEFT JOIN preserves all records from the left table regardless of matches in the right table."
    )
    db.add(adaptive_task)
    await db.flush()

    db.add(PracticeAttempt(
        user_id=demo_user.id,
        task_id=adaptive_task.id,
        user_answer="SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id",
        is_correct=False,
        score=0.0,
        time_taken_seconds=65,
        struggle_detected=True,
        feedback="Notice that INNER JOIN drops users without orders. A LEFT JOIN is required to retain all users."
    ))

    # Adaptive log
    db.add(AdaptiveLog(
        user_id=demo_user.id,
        trigger_type="struggle_detected",
        topic="SQL Joins",
        accuracy_score=45.0,
        action_taken="AI detected struggle in SQL Joins (45% accuracy). Added supplementary revision module into Roadmap."
    ))

    # 7. Seed Sample Projects
    db.add(Project(
        user_id=demo_user.id,
        title="End-to-End Real-Time Sentiment Analysis Service",
        problem_statement="Modern customer platforms require low-latency sentiment inference on streaming feedback text.",
        skills_required=["Python", "PyTorch", "FastAPI", "Docker"],
        difficulty="Intermediate",
        estimated_duration="2 weeks",
        tech_stack=["PyTorch", "Hugging Face Transformers", "FastAPI", "Docker", "GitHub Actions"],
        features=[
            "DistilBERT fine-tuning pipeline with validation metrics",
            "Asynchronous REST API endpoint with batching support",
            "Dockerized container ready for deployment"
        ],
        milestones=[
            "1. Dataset preprocessing & tokenization pipeline",
            "2. PyTorch model training & evaluation checkpointing",
            "3. FastAPI inference server with Swagger docs",
            "4. Docker container build & benchmark testing"
        ],
        expected_outcomes="Production-grade portfolio asset proving deep learning deployment capabilities.",
        status="In Progress",
        github_readme="""# Real-Time Sentiment Analysis Service
An asynchronous, containerized microservice for NLP sentiment inference powered by PyTorch and FastAPI.
## Architecture
- **Inference Engine:** Fine-tuned DistilBERT via PyTorch
- **API Server:** FastAPI async endpoints with Pydantic validation
- **Deployment:** Docker & GitHub Actions CI/CD""",
        resume_bullet="Architected and containerized a sub-20ms NLP inference microservice using PyTorch and FastAPI, handling 1,000+ requests/sec with automated Docker deployments."
    ))

    # 8. Seed Achievements
    badges = [
        ("first_steps", "First Steps", "Completed onboarding and configured initial career target.", "Compass"),
        ("streak_3", "3-Day Streak", "Maintained consistent learning activity for 3 consecutive days.", "Zap"),
        ("python_mastery", "Python Pioneer", "Verified advanced proficiency in Python primitives and data structures.", "Code")
    ]
    for key, title, desc, icon in badges:
        db.add(Achievement(
            user_id=demo_user.id,
            badge_key=key,
            title=title,
            description=desc,
            icon=icon
        ))

    # 9. Seed Weekly Report
    db.add(WeeklyReport(
        user_id=demo_user.id,
        report_title="Weekly AI Progress Report: Week 2",
        week_start_date=datetime.now(timezone.utc) - timedelta(days=7),
        skills_acquired=["NumPy Array Manipulation", "Pandas Data Aggregations", "Linear Regression Scratch Implementation"],
        skills_improving=["PyTorch Tensors & Autograd Graph"],
        weak_areas=["Complex SQL Joins"],
        completed_activities_count=8,
        practice_accuracy_percentage=82.5,
        learning_hours_logged=11.5,
        recommended_next_week="Deepen PyTorch training loop mechanics and complete the CNN Image Classifier challenge.",
        ai_summary="Alex made strong headway in foundational mathematics and linear algebra for ML. Problem-solving accuracy improved by 18% this week. An adaptive SQL refresher has been added to address relational joins."
    ))

    await db.commit()
    return demo_user
