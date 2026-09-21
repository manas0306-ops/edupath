import uuid
from typing import List, Dict
from backend.app.schemas.roadmap import RoadmapResponse, RoadmapItemResponse, ResourceResponse
from backend.app.schemas.skill import SkillGapItem
from backend.app.services.skill_gap import compute_skill_gaps

RESOURCE_CATALOG: Dict[str, List[Dict]] = {
    "Deep Learning": [
        {
            "title": "Deep Learning Specialization — DeepLearning.AI",
            "type": "Course",
            "provider": "Coursera",
            "url": "https://www.coursera.org/specializations/deep-learning",
            "difficulty": "Intermediate",
            "minutes": 180,
            "reason": "Gold-standard foundational curriculum on neural networks and backpropagation."
        },
        {
            "title": "MIT 6.S191: Introduction to Deep Learning",
            "type": "Video",
            "provider": "MIT OpenCourseWare",
            "url": "http://introtodeeplearning.com/",
            "difficulty": "Advanced",
            "minutes": 75,
            "reason": "Top-tier academic lectures covering transformer architectures and generative models."
        }
    ],
    "PyTorch": [
        {
            "title": "PyTorch Official Documentation & Tutorials",
            "type": "Documentation",
            "provider": "PyTorch.org",
            "url": "https://pytorch.org/tutorials/",
            "difficulty": "Intermediate",
            "minutes": 90,
            "reason": "Official, battle-tested tensor manipulation and autograd recipes."
        },
        {
            "title": "Deep Learning with PyTorch: Zero to GANs",
            "type": "Tutorial",
            "provider": "FreeCodeCamp",
            "url": "https://www.youtube.com/watch?v=GIsg-ZUy0MY",
            "difficulty": "Intermediate",
            "minutes": 120,
            "reason": "Hands-on project-centric video series teaching neural network training."
        }
    ],
    "Model Deployment": [
        {
            "title": "Building Production Machine Learning APIs with FastAPI",
            "type": "Tutorial",
            "provider": "FastAPI Guides",
            "url": "https://fastapi.tiangolo.com/tutorial/",
            "difficulty": "Intermediate",
            "minutes": 60,
            "reason": "Learn how to wrap PyTorch models in high-performance asynchronous endpoints."
        },
        {
            "title": "Serving PyTorch Models with TorchServe & Docker",
            "type": "Repository",
            "provider": "GitHub",
            "url": "https://github.com/pytorch/serve",
            "difficulty": "Advanced",
            "minutes": 90,
            "reason": "Industry standard microservice architecture for low-latency inference."
        }
    ],
    "MLOps": [
        {
            "title": "MLOps Specialization & CI/CD Pipelines",
            "type": "Course",
            "provider": "DeepLearning.AI",
            "url": "https://www.deeplearning.ai/courses/machine-learning-engineering-for-production-mlops/",
            "difficulty": "Advanced",
            "minutes": 150,
            "reason": "Covers data versioning, model drift monitoring, and automated retraining."
        },
        {
            "title": "Made With ML: Production MLOps Course",
            "type": "Documentation",
            "provider": "Goku Mohandas",
            "url": "https://madewithml.com/",
            "difficulty": "Advanced",
            "minutes": 100,
            "reason": "Complete, production-tested open source blueprint for machine learning workflows."
        }
    ],
    "Scikit-learn": [
        {
            "title": "Scikit-Learn User Guide & Practical Examples",
            "type": "Documentation",
            "provider": "Scikit-learn.org",
            "url": "https://scikit-learn.org/stable/user_guide.html",
            "difficulty": "Intermediate",
            "minutes": 80,
            "reason": "Comprehensive guide on cross-validation, hyperparameter tuning, and pipeline construction."
        }
    ],
    "Docker": [
        {
            "title": "Docker for Data Science & Developers Crash Course",
            "type": "Video",
            "provider": "FreeCodeCamp",
            "url": "https://www.youtube.com/watch?v=fqMOX6JJhGo",
            "difficulty": "Beginner",
            "minutes": 90,
            "reason": "Essential containerization fundamentals for reproducible machine learning artifacts."
        }
    ],
    "SQL": [
        {
            "title": "Advanced SQL for Data Engineers: Window Functions & Joins",
            "type": "Tutorial",
            "provider": "Mode Analytics",
            "url": "https://mode.com/sql-tutorial/",
            "difficulty": "Intermediate",
            "minutes": 60,
            "reason": "Interactive query practice covering complex joins, aggregations, and subqueries."
        }
    ]
}

def generate_dynamic_roadmap(current_skills: List[str], target_role: str, weekly_hours: int = 10) -> RoadmapResponse:
    gap_analysis = compute_skill_gaps(current_skills, target_role)
    all_gaps: List[SkillGapItem] = gap_analysis.partial_skills + gap_analysis.missing_skills
    
    # Sort by priority and prerequisite order
    priority_weights = {"High": 0, "Medium": 1, "Low": 2}
    all_gaps.sort(key=lambda g: (len(g.dependencies), priority_weights.get(g.priority, 3)))
    
    weekly_items: List[RoadmapItemResponse] = []
    week = 1
    
    for gap in all_gaps:
        raw_resources = RESOURCE_CATALOG.get(gap.skill_name, [
            {
                "title": f"Mastering {gap.skill_name}: Complete Guide",
                "type": "Documentation",
                "provider": "Official Docs",
                "url": f"https://devdocs.io/",
                "difficulty": gap.difficulty,
                "minutes": 60,
                "reason": f"Structured guide covering core mechanics and industry best practices for {gap.skill_name}."
            },
            {
                "title": f"{gap.skill_name} in Practice: Hands-on Mini Lab",
                "type": "Tutorial",
                "provider": "EduPath Labs",
                "url": "#",
                "difficulty": gap.difficulty,
                "minutes": 90,
                "reason": f"Reinforces theoretical knowledge with real-world coding problems."
            }
        ])
        
        resources_formatted = [
            ResourceResponse(
                id=str(uuid.uuid4()),
                title=r["title"],
                resource_type=r["type"],
                provider=r["provider"],
                url=r["url"],
                difficulty=r["difficulty"],
                estimated_minutes=r["minutes"],
                skill_covered=gap.skill_name,
                recommendation_reason=r["reason"],
                is_completed=False
            )
            for r in raw_resources
        ]
        
        objectives = [
            f"Understand core syntax, primitives, and design patterns in {gap.skill_name}.",
            f"Build a standalone implementation demonstrating {gap.skill_name} capabilities.",
            f"Pass the end-of-week {gap.skill_name} diagnostic challenge with >=80% accuracy."
        ]
        
        status = "in_progress" if week == 1 else "pending"
        
        weekly_items.append(RoadmapItemResponse(
            id=str(uuid.uuid4()),
            week_number=week,
            title=f"Week {week}: {gap.skill_name} Mastery",
            topic=gap.skill_name,
            description=f"Deep dive into {gap.skill_name} targeting {target_role} expectations. Estimated {gap.estimated_hours} study hours.",
            estimated_hours=gap.estimated_hours,
            skill_covered=gap.skill_name,
            learning_objectives=objectives,
            status=status,
            is_adaptive_addition=False,
            resources=resources_formatted
        ))
        week += 1

    return RoadmapResponse(
        id=str(uuid.uuid4()),
        title=f"Personalized {target_role} Acceleration Roadmap",
        target_role=target_role,
        total_weeks=len(weekly_items),
        progress_percentage=12.5 if weekly_items else 0.0,
        is_active=True,
        items=weekly_items
    )
