from fastapi import APIRouter, Depends
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional

from backend.app.database import get_db
from backend.app.models.user import User, Profile
from backend.app.models.skill import UserSkill, SkillGap
from backend.app.models.roadmap import Roadmap, RoadmapItem
from backend.app.models.practice import PracticeAttempt
from backend.app.models.report import WeeklyReport, AdaptiveLog
from backend.app.schemas.report import WeeklyReportResponse, DashboardStatsResponse
from backend.app.services.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports & Analytics"])

@router.get("/weekly", response_model=WeeklyReportResponse)
async def get_latest_weekly_report(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(WeeklyReport)
        .filter(WeeklyReport.user_id == current_user.id)
        .order_by(WeeklyReport.created_at.desc())
    )
    report = result.scalars().first()
    
    if not report:
        # Generate default dynamic report
        report = WeeklyReport(
            user_id=current_user.id,
            report_title="Weekly AI Progress Report: Initial Assessment",
            skills_acquired=["Python Fundamentals", "Git Version Control"],
            skills_improving=["Data Manipulation & Preprocessing"],
            weak_areas=["Complex SQL Joins"],
            completed_activities_count=4,
            practice_accuracy_percentage=78.0,
            learning_hours_logged=6.5,
            recommended_next_week="Deep Learning Fundamentals & Neural Network Autograd",
            ai_summary="Solid initial momentum established. Consistency in daily practice tasks will accelerate your career transition."
        )
        db.add(report)
        await db.commit()
        await db.refresh(report)

    return WeeklyReportResponse(
        id=report.id,
        report_title=report.report_title,
        week_start_date=report.week_start_date,
        skills_acquired=report.skills_acquired or [],
        skills_improving=report.skills_improving or [],
        weak_areas=report.weak_areas or [],
        completed_activities_count=report.completed_activities_count,
        practice_accuracy_percentage=report.practice_accuracy_percentage,
        learning_hours_logged=report.learning_hours_logged,
        recommended_next_week=report.recommended_next_week,
        ai_summary=report.ai_summary
    )

@router.get("/dashboard", response_model=DashboardStatsResponse)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    profile_res = await db.execute(select(Profile).filter(Profile.user_id == current_user.id))
    profile = profile_res.scalars().first()
    
    skills_res = await db.execute(select(UserSkill).filter(UserSkill.user_id == current_user.id))
    skills = skills_res.scalars().all()
    
    gaps_res = await db.execute(select(SkillGap).filter(SkillGap.user_id == current_user.id))
    gaps = gaps_res.scalars().all()
    
    roadmap_res = await db.execute(
        select(Roadmap).filter(Roadmap.user_id == current_user.id, Roadmap.is_active == True)
    )
    roadmap = roadmap_res.scalars().first()
    
    struggles_res = await db.execute(
        select(AdaptiveLog.topic).filter(AdaptiveLog.user_id == current_user.id).limit(3)
    )
    struggle_topics = list({t for t in struggles_res.scalars().all()})
    
    attempts_res = await db.execute(
        select(PracticeAttempt).filter(PracticeAttempt.user_id == current_user.id)
    )
    attempts = attempts_res.scalars().all()
    acc = 82.0
    if attempts:
        correct_count = sum(1 for a in attempts if a.is_correct)
        acc = round((correct_count / len(attempts)) * 100, 1)

    today_goals = [
        {"title": "Review PyTorch Autograd & Computational Graphs", "duration": "35 mins", "done": False},
        {"title": "Complete 3 Diagnostic Coding Exercises", "duration": "20 mins", "done": False},
        {"title": "Log 1 Commit to Portfolio Project", "duration": "45 mins", "done": False}
    ]

    return DashboardStatsResponse(
        overall_progress_percentage=roadmap.progress_percentage if roadmap else 28.5,
        skills_acquired_count=len(skills) if skills else 6,
        skills_in_progress_count=2,
        remaining_gaps_count=len(gaps) if gaps else 5,
        total_learning_hours=14.5,
        practice_accuracy=acc,
        streak_days=profile.streak_days if profile else 5,
        xp=profile.xp if profile else 480,
        today_goals=today_goals,
        struggle_topics=struggle_topics or ["SQL Joins"],
        ai_insights="You've increased problem-solving accuracy by 18% this week. Your Python and Data fundamentals are rock solid.",
        recommended_next_step="Complete Week 2 PyTorch Tensor Operations Lab"
    )

# Chapter Progress Analytics Data Store
CHAPTER_DATA_STORE = {
    "ml": {
        "id": "ml",
        "name": "Machine Learning & Neural Networks",
        "icon": "🧠",
        "study_hours": 18.5,
        "velocity_trend": [
            {"day": "Mon", "read": 1, "score": 88},
            {"day": "Tue", "read": 2, "score": 90},
            {"day": "Wed", "read": 3, "score": 85},
            {"day": "Thu", "read": 4, "score": 92},
            {"day": "Fri", "read": 5, "score": 87},
            {"day": "Sat", "read": 6, "score": 82},
            {"day": "Sun", "read": 7, "score": 86}
        ],
        "chapters": [
            {"id": 1, "title": "Chapter 1: Tensor Math & GPU Acceleration", "module": "Foundations", "status": "completed", "duration": "40 mins", "score": 94, "key_concept": "PyTorch Tensor Operations & Device Offloading", "order": 1},
            {"id": 2, "title": "Chapter 2: Automatic Differentiation & Gradients", "module": "Foundations", "status": "completed", "duration": "35 mins", "score": 88, "key_concept": "Autograd, Computational Graphs & Backward Pass", "order": 2},
            {"id": 3, "title": "Chapter 3: Linear Regression & Loss Surfaces", "module": "Supervised ML", "status": "completed", "duration": "30 mins", "score": 90, "key_concept": "Mean Squared Error & Gradient Descent Optimization", "order": 3},
            {"id": 4, "title": "Chapter 4: Logistic Regression & Classification", "module": "Supervised ML", "status": "completed", "duration": "45 mins", "score": 85, "key_concept": "Cross-Entropy, Precision-Recall & ROC-AUC", "order": 4},
            {"id": 5, "title": "Chapter 5: Multi-Layer Perceptrons & Activations", "module": "Deep Networks", "status": "completed", "duration": "50 mins", "score": 92, "key_concept": "Non-linear Activation Functions & Weight Initialization", "order": 5},
            {"id": 6, "title": "Chapter 6: Convolutional Neural Networks & Vision", "module": "Deep Networks", "status": "completed", "duration": "60 mins", "score": 80, "key_concept": "Feature Extraction, Stride, Pooling & Kernels", "order": 6},
            {"id": 7, "title": "Chapter 7: Sequence Models & Recurrent Networks", "module": "Sequential Models", "status": "completed", "duration": "45 mins", "score": 78, "key_concept": "LSTM, GRU & Vanishing Gradient Handling", "order": 7},
            {"id": 8, "title": "Chapter 8: Self-Attention & Transformer Architecture", "module": "Sequential Models", "status": "in_progress", "duration": "55 mins", "score": 70, "key_concept": "Scaled Dot-Product Attention & Multi-Head Encoding", "order": 8},
            {"id": 9, "title": "Chapter 9: Fine-Tuning Pre-trained LLMs & PEFT", "module": "Advanced AI", "status": "left", "duration": "60 mins", "score": 0, "key_concept": "LoRA, QLoRA & Hugging Face Pipeline Adaptation", "order": 9},
            {"id": 10, "title": "Chapter 10: Model Evaluation, Quantization & ONNX", "module": "Advanced AI", "status": "left", "duration": "50 mins", "score": 0, "key_concept": "Low-Precision Inference & Latency Optimization", "order": 10}
        ]
    },
    "python": {
        "id": "python",
        "name": "Python & Data Structures",
        "icon": "🐍",
        "study_hours": 22.0,
        "velocity_trend": [
            {"day": "Mon", "read": 2, "score": 95},
            {"day": "Tue", "read": 4, "score": 94},
            {"day": "Wed", "read": 5, "score": 90},
            {"day": "Thu", "read": 6, "score": 92},
            {"day": "Fri", "read": 7, "score": 89},
            {"day": "Sat", "read": 8, "score": 91},
            {"day": "Sun", "read": 9, "score": 93}
        ],
        "chapters": [
            {"id": 1, "title": "Chapter 1: Memory Architecture & Mutability", "module": "Core Foundations", "status": "completed", "duration": "30 mins", "score": 98, "key_concept": "Reference Counting, Garbage Collection & Id", "order": 1},
            {"id": 2, "title": "Chapter 2: Generators, Iterators & Yield Expressions", "module": "Core Foundations", "status": "completed", "duration": "35 mins", "score": 95, "key_concept": "Lazy Evaluation & Memory-Efficient Pipelines", "order": 2},
            {"id": 3, "title": "Chapter 3: Object-Oriented Design & Dunder Methods", "module": "OOP & Patterns", "status": "completed", "duration": "45 mins", "score": 90, "key_concept": "Magic Methods, Encapsulation & Inheritance", "order": 3},
            {"id": 4, "title": "Chapter 4: Functional Programming & Decorators", "module": "OOP & Patterns", "status": "completed", "duration": "40 mins", "score": 92, "key_concept": "Higher-Order Functions & Parameterized Decorators", "order": 4},
            {"id": 5, "title": "Chapter 5: Concurrency with Asyncio & Event Loops", "module": "Concurrency", "status": "completed", "duration": "50 mins", "score": 86, "key_concept": "Coroutines, Tasks & Non-blocking I/O Operations", "order": 5},
            {"id": 6, "title": "Chapter 6: Hash Tables, Heaps & Priority Queues", "module": "Data Structures", "status": "completed", "duration": "45 mins", "score": 88, "key_concept": "Collision Resolution & Heapify Algorithms", "order": 6},
            {"id": 7, "title": "Chapter 7: Big-O Complexity & Sorting Algorithms", "module": "Data Structures", "status": "completed", "duration": "40 mins", "score": 84, "key_concept": "Time/Space Trade-offs & Quicksort/Mergesort", "order": 7},
            {"id": 8, "title": "Chapter 8: NumPy Array Broadcasting & Vectorization", "module": "Data Libraries", "status": "completed", "duration": "50 mins", "score": 91, "key_concept": "Strides, Slicing & C-Contiguous Array Ops", "order": 8},
            {"id": 9, "title": "Chapter 9: Pandas DataFrames & GroupBy Analytics", "module": "Data Libraries", "status": "completed", "duration": "55 mins", "score": 87, "key_concept": "Multi-Index Slicing & Vectorized Operations", "order": 9},
            {"id": 10, "title": "Chapter 10: Graph Traversals: BFS, DFS & Dijkstra", "module": "Algorithms", "status": "in_progress", "duration": "60 mins", "score": 75, "key_concept": "Adjacency Lists & Shortest Path Finding", "order": 10},
            {"id": 11, "title": "Chapter 11: Production Testing with PyTest & Fixtures", "module": "Engineering", "status": "left", "duration": "45 mins", "score": 0, "key_concept": "Test Parametrization, Mocking & Coverage", "order": 11},
            {"id": 12, "title": "Chapter 12: Package Packaging, PyPI & Wheel Builds", "module": "Engineering", "status": "left", "duration": "40 mins", "score": 0, "key_concept": "pyproject.toml, Build Systems & CI Publishing", "order": 12}
        ]
    },
    "sql": {
        "id": "sql",
        "name": "SQL & Database Engineering",
        "icon": "💾",
        "study_hours": 15.0,
        "velocity_trend": [
            {"day": "Mon", "read": 1, "score": 92},
            {"day": "Tue", "read": 2, "score": 89},
            {"day": "Wed", "read": 2, "score": 87},
            {"day": "Thu", "read": 3, "score": 82},
            {"day": "Fri", "read": 4, "score": 76},
            {"day": "Sat", "read": 5, "score": 79},
            {"day": "Sun", "read": 5, "score": 81}
        ],
        "chapters": [
            {"id": 1, "title": "Chapter 1: Relational Schema & Normal Forms", "module": "Modeling", "status": "completed", "duration": "35 mins", "score": 95, "key_concept": "1NF, 2NF, 3NF & Primary/Foreign Keys", "order": 1},
            {"id": 2, "title": "Chapter 2: Data Aggregations & Grouping Sets", "module": "Modeling", "status": "completed", "duration": "30 mins", "score": 90, "key_concept": "HAVING Clauses, Rollup & Cube Expressions", "order": 2},
            {"id": 3, "title": "Chapter 3: Relational Joins & Execution Logic", "module": "Query Engineering", "status": "completed", "duration": "45 mins", "score": 85, "key_concept": "Inner, Left, Right & Full Outer Joins", "order": 3},
            {"id": 4, "title": "Chapter 4: CTEs, Subqueries & Recursive Queries", "module": "Query Engineering", "status": "completed", "duration": "50 mins", "score": 76, "key_concept": "WITH RECURSIVE & Hierarchical Tree Queries", "order": 4},
            {"id": 5, "title": "Chapter 5: Advanced Window Functions", "module": "Analytical SQL", "status": "completed", "duration": "55 mins", "score": 72, "key_concept": "ROW_NUMBER, RANK, DENSE_RANK & Moving Averages", "order": 5},
            {"id": 6, "title": "Chapter 6: B-Tree Indexing & Query Explain Plans", "module": "Performance", "status": "in_progress", "duration": "60 mins", "score": 68, "key_concept": "EXPLAIN ANALYZE, Index Scans & Cost Estimation", "order": 6},
            {"id": 7, "title": "Chapter 7: ACID Transactions, Concurrency & Locks", "module": "Performance", "status": "left", "duration": "50 mins", "score": 0, "key_concept": "Read Committed, Serializable & Deadlock Detection", "order": 7},
            {"id": 8, "title": "Chapter 8: Table Partitioning & Columnar Engines", "module": "Performance", "status": "left", "duration": "50 mins", "score": 0, "key_concept": "Range/List Sharding & OLAP Data Warehousing", "order": 8}
        ]
    },
    "fastapi": {
        "id": "fastapi",
        "name": "FastAPI & Microservices",
        "icon": "⚡",
        "study_hours": 12.5,
        "velocity_trend": [
            {"day": "Mon", "read": 1, "score": 94},
            {"day": "Tue", "read": 2, "score": 91},
            {"day": "Wed", "read": 2, "score": 89},
            {"day": "Thu", "read": 3, "score": 86},
            {"day": "Fri", "read": 3, "score": 88},
            {"day": "Sat", "read": 4, "score": 85},
            {"day": "Sun", "read": 4, "score": 87}
        ],
        "chapters": [
            {"id": 1, "title": "Chapter 1: HTTP Standards & Pydantic Data Models", "module": "API Architecture", "status": "completed", "duration": "30 mins", "score": 96, "key_concept": "Request/Response Typing & Schema Serialization", "order": 1},
            {"id": 2, "title": "Chapter 2: Routing, Dependency Injection & Context", "module": "API Architecture", "status": "completed", "duration": "40 mins", "score": 94, "key_concept": "FastAPI Depends & Reusable Service Providers", "order": 2},
            {"id": 3, "title": "Chapter 3: Asynchronous Database Sessions", "module": "Database Integration", "status": "completed", "duration": "45 mins", "score": 89, "key_concept": "SQLAlchemy 2.0 AsyncEngine & aiosqlite", "order": 3},
            {"id": 4, "title": "Chapter 4: Security, Password Hashing & JWT Auth", "module": "Security", "status": "completed", "duration": "50 mins", "score": 85, "key_concept": "OAuth2 Bearer Tokens & Argon2id/Bcrypt", "order": 4},
            {"id": 5, "title": "Chapter 5: Background Tasks & Celery Job Queues", "module": "Scalability", "status": "in_progress", "duration": "55 mins", "score": 78, "key_concept": "Async Workflows & Distributed Task Execution", "order": 5},
            {"id": 6, "title": "Chapter 6: Real-Time WebSockets & Streaming", "module": "Scalability", "status": "left", "duration": "45 mins", "score": 0, "key_concept": "Bidirectional Channel Communication & Pub/Sub", "order": 6},
            {"id": 7, "title": "Chapter 7: Containerization & Cloud Deployment", "module": "Scalability", "status": "left", "duration": "50 mins", "score": 0, "key_concept": "Multi-Worker Uvicorn, Gunicorn & Docker Compose", "order": 7}
        ]
    },
    "cloud": {
        "id": "cloud",
        "name": "Cloud & Docker Deployment",
        "icon": "🐳",
        "study_hours": 10.0,
        "velocity_trend": [
            {"day": "Mon", "read": 1, "score": 90},
            {"day": "Tue", "read": 1, "score": 92},
            {"day": "Wed", "read": 2, "score": 88},
            {"day": "Thu", "read": 2, "score": 85},
            {"day": "Fri", "read": 3, "score": 84},
            {"day": "Sat", "read": 3, "score": 86},
            {"day": "Sun", "read": 3, "score": 87}
        ],
        "chapters": [
            {"id": 1, "title": "Chapter 1: Linux CLI & Environment Configuration", "module": "DevOps Foundations", "status": "completed", "duration": "35 mins", "score": 92, "key_concept": "Bash Scripting, Permissions & Process Monitoring", "order": 1},
            {"id": 2, "title": "Chapter 2: Dockerfiles & Multi-Stage Layering", "module": "DevOps Foundations", "status": "completed", "duration": "40 mins", "score": 88, "key_concept": "Image Size Minimization & Cache Optimization", "order": 2},
            {"id": 3, "title": "Chapter 3: Multi-Container Docker Compose Stacks", "module": "Orchestration", "status": "completed", "duration": "45 mins", "score": 85, "key_concept": "Bridge Networks, Named Volumes & Healthchecks", "order": 3},
            {"id": 4, "title": "Chapter 4: Automated CI/CD Pipelines with GitHub", "module": "Orchestration", "status": "in_progress", "duration": "50 mins", "score": 70, "key_concept": "GitHub Actions Workflows, Secrets & Auto-Deploy", "order": 4},
            {"id": 5, "title": "Chapter 5: Kubernetes Pods, Deployments & Services", "module": "Cloud Native", "status": "left", "duration": "60 mins", "score": 0, "key_concept": "K8s Manifests, Cluster IP & ReplicaSets", "order": 5},
            {"id": 6, "title": "Chapter 6: Observability, Metrics & Health Checks", "module": "Cloud Native", "status": "left", "duration": "45 mins", "score": 0, "key_concept": "Prometheus Metrics, Grafana & Log Aggregation", "order": 6}
        ]
    }
}

def build_subject_response(sub_key: str, sub_dict: dict) -> dict:
    chapters = sub_dict["chapters"]
    total = len(chapters)
    read_count = sum(1 for c in chapters if c["status"] == "completed")
    left_count = total - read_count
    completion_rate = round((read_count / total) * 100, 1) if total else 0.0

    scores = [c["score"] for c in chapters if c["score"] > 0]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 85.0

    # Group modules for Bar Charts
    module_groups = {}
    for c in chapters:
        mod = c["module"]
        if mod not in module_groups:
            module_groups[mod] = {"name": mod, "chapters_read": 0, "chapters_left": 0, "total": 0}
        module_groups[mod]["total"] += 1
        if c["status"] == "completed":
            module_groups[mod]["chapters_read"] += 1
        else:
            module_groups[mod]["chapters_left"] += 1

    return {
        "id": sub_dict["id"],
        "name": sub_dict["name"],
        "icon": sub_dict["icon"],
        "total_chapters": total,
        "chapters_read": read_count,
        "chapters_left": left_count,
        "completion_rate": completion_rate,
        "avg_quiz_score": avg_score,
        "study_hours": sub_dict.get("study_hours", 12.0),
        "modules": list(module_groups.values()),
        "velocity_trend": sub_dict.get("velocity_trend", []),
        "chapters": chapters
    }

def build_all_subjects_response() -> dict:
    all_chapters = []
    all_modules = []
    total_hours = 0.0

    for s_key, s_val in CHAPTER_DATA_STORE.items():
        res = build_subject_response(s_key, s_val)
        total_hours += res["study_hours"]
        for c in res["chapters"]:
            all_chapters.append({**c, "subject": s_val["name"], "subject_id": s_key})
        all_modules.append({
            "name": s_val["name"].split("&")[0].strip(),
            "chapters_read": res["chapters_read"],
            "chapters_left": res["chapters_left"],
            "total": res["total_chapters"]
        })

    total = len(all_chapters)
    read_count = sum(1 for c in all_chapters if c["status"] == "completed")
    left_count = total - read_count
    completion_rate = round((read_count / total) * 100, 1) if total else 0.0

    scores = [c["score"] for c in all_chapters if c["score"] > 0]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 84.5

    trend = [
        {"day": "Mon", "read": 5, "score": 91},
        {"day": "Tue", "read": 9, "score": 90},
        {"day": "Wed", "read": 14, "score": 88},
        {"day": "Thu", "read": 18, "score": 87},
        {"day": "Fri", "read": 22, "score": 85},
        {"day": "Sat", "read": 25, "score": 84},
        {"day": "Sun", "read": read_count, "score": avg_score}
    ]

    return {
        "id": "all",
        "name": "All Subjects",
        "icon": "🌐",
        "total_chapters": total,
        "chapters_read": read_count,
        "chapters_left": left_count,
        "completion_rate": completion_rate,
        "avg_quiz_score": avg_score,
        "study_hours": round(total_hours, 1),
        "modules": all_modules,
        "velocity_trend": trend,
        "chapters": all_chapters
    }

@router.get("/chapters")
async def get_chapter_analytics():
    subjects_list = []
    all_summary = build_all_subjects_response()
    subjects_list.append(all_summary)

    for s_key, s_val in CHAPTER_DATA_STORE.items():
        subjects_list.append(build_subject_response(s_key, s_val))

    return {
        "subjects": subjects_list,
        "selected_default": "all"
    }

@router.post("/chapters/{subject_id}/{chapter_id}/toggle")
async def toggle_chapter_status(subject_id: str, chapter_id: int):
    if subject_id in CHAPTER_DATA_STORE:
        for c in CHAPTER_DATA_STORE[subject_id]["chapters"]:
            if c["id"] == chapter_id:
                if c["status"] == "completed":
                    c["status"] = "left"
                else:
                    c["status"] = "completed"
                    if c["score"] == 0:
                        c["score"] = 85
                return {"success": True, "chapter": c}
    return {"success": False, "error": "Chapter not found"}

