from typing import List, Dict, Tuple, Set
from backend.app.schemas.skill import (
    SkillGapItem, SkillGapAnalysisResponse, SkillGraphNode,
    SkillGraphEdge, SkillGraphData, TargetRoleInfo, RoleComparisonItem
)

# Comprehensive benchmark role definitions
ROLE_DEFINITIONS: Dict[str, Dict] = {
    "AI/ML Engineer": {
        "description": "Designs, builds, trains, and deploys scalable artificial intelligence and deep learning models into production environments.",
        "average_salary": "$145,000 - $190,000 / year",
        "demand": "Very High (Top 1% Growth)",
        "skills": [
            {"name": "Python", "importance": "Must-have", "level": "Intermediate", "hours": 20, "deps": [], "difficulty": "Beginner"},
            {"name": "NumPy", "importance": "Must-have", "level": "Intermediate", "hours": 10, "deps": ["Python"], "difficulty": "Beginner"},
            {"name": "Pandas", "importance": "Must-have", "level": "Intermediate", "hours": 15, "deps": ["Python", "NumPy"], "difficulty": "Beginner"},
            {"name": "Machine Learning", "importance": "Must-have", "level": "Intermediate", "hours": 30, "deps": ["NumPy", "Pandas"], "difficulty": "Intermediate"},
            {"name": "Scikit-learn", "importance": "Must-have", "level": "Intermediate", "hours": 20, "deps": ["Machine Learning"], "difficulty": "Intermediate"},
            {"name": "Deep Learning", "importance": "Must-have", "level": "Advanced", "hours": 35, "deps": ["Machine Learning"], "difficulty": "Advanced"},
            {"name": "PyTorch", "importance": "Must-have", "level": "Advanced", "hours": 40, "deps": ["Deep Learning", "Python"], "difficulty": "Advanced"},
            {"name": "Model Deployment", "importance": "Important", "level": "Intermediate", "hours": 25, "deps": ["PyTorch", "FastAPI"], "difficulty": "Intermediate"},
            {"name": "MLOps", "importance": "Important", "level": "Advanced", "hours": 30, "deps": ["Model Deployment", "Docker"], "difficulty": "Advanced"},
            {"name": "Docker", "importance": "Important", "level": "Intermediate", "hours": 15, "deps": [], "difficulty": "Intermediate"},
            {"name": "FastAPI", "importance": "Important", "level": "Intermediate", "hours": 15, "deps": ["Python"], "difficulty": "Intermediate"},
            {"name": "SQL", "importance": "Important", "level": "Intermediate", "hours": 15, "deps": [], "difficulty": "Beginner"},
            {"name": "Git", "importance": "Must-have", "level": "Beginner", "hours": 8, "deps": [], "difficulty": "Beginner"},
        ]
    },
    "Full Stack Developer": {
        "description": "Architects and develops end-to-end web applications, modern responsive user interfaces, and robust backend APIs.",
        "average_salary": "$115,000 - $160,000 / year",
        "demand": "High",
        "skills": [
            {"name": "JavaScript", "importance": "Must-have", "level": "Intermediate", "hours": 25, "deps": [], "difficulty": "Beginner"},
            {"name": "TypeScript", "importance": "Must-have", "level": "Intermediate", "hours": 20, "deps": ["JavaScript"], "difficulty": "Intermediate"},
            {"name": "React", "importance": "Must-have", "level": "Intermediate", "hours": 30, "deps": ["JavaScript"], "difficulty": "Intermediate"},
            {"name": "Node.js", "importance": "Must-have", "level": "Intermediate", "hours": 25, "deps": ["JavaScript"], "difficulty": "Intermediate"},
            {"name": "HTML", "importance": "Must-have", "level": "Beginner", "hours": 8, "deps": [], "difficulty": "Beginner"},
            {"name": "CSS", "importance": "Must-have", "level": "Beginner", "hours": 12, "deps": [], "difficulty": "Beginner"},
            {"name": "Tailwind CSS", "importance": "Important", "level": "Beginner", "hours": 10, "deps": ["CSS"], "difficulty": "Beginner"},
            {"name": "PostgreSQL", "importance": "Must-have", "level": "Intermediate", "hours": 20, "deps": ["SQL"], "difficulty": "Intermediate"},
            {"name": "SQL", "importance": "Must-have", "level": "Intermediate", "hours": 15, "deps": [], "difficulty": "Beginner"},
            {"name": "Docker", "importance": "Important", "level": "Intermediate", "hours": 15, "deps": [], "difficulty": "Intermediate"},
            {"name": "CI/CD", "importance": "Important", "level": "Intermediate", "hours": 12, "deps": ["Git"], "difficulty": "Intermediate"},
            {"name": "Git", "importance": "Must-have", "level": "Beginner", "hours": 8, "deps": [], "difficulty": "Beginner"},
        ]
    },
    "Data Scientist": {
        "description": "Extracts actionable intelligence from massive datasets, builds predictive models, and translates analytics into strategic business decisions.",
        "average_salary": "$125,000 - $170,000 / year",
        "demand": "High",
        "skills": [
            {"name": "Python", "importance": "Must-have", "level": "Intermediate", "hours": 20, "deps": [], "difficulty": "Beginner"},
            {"name": "SQL", "importance": "Must-have", "level": "Intermediate", "hours": 20, "deps": [], "difficulty": "Beginner"},
            {"name": "Pandas", "importance": "Must-have", "level": "Intermediate", "hours": 15, "deps": ["Python"], "difficulty": "Beginner"},
            {"name": "NumPy", "importance": "Must-have", "level": "Intermediate", "hours": 10, "deps": ["Python"], "difficulty": "Beginner"},
            {"name": "Statistics", "importance": "Must-have", "level": "Intermediate", "hours": 25, "deps": [], "difficulty": "Intermediate"},
            {"name": "Machine Learning", "importance": "Must-have", "level": "Intermediate", "hours": 30, "deps": ["Pandas", "Statistics"], "difficulty": "Intermediate"},
            {"name": "Scikit-learn", "importance": "Must-have", "level": "Intermediate", "hours": 20, "deps": ["Machine Learning"], "difficulty": "Intermediate"},
            {"name": "Data Analysis", "importance": "Must-have", "level": "Intermediate", "hours": 20, "deps": ["Pandas"], "difficulty": "Beginner"},
            {"name": "Deep Learning", "importance": "Important", "level": "Advanced", "hours": 35, "deps": ["Machine Learning"], "difficulty": "Advanced"},
            {"name": "Git", "importance": "Important", "level": "Beginner", "hours": 8, "deps": [], "difficulty": "Beginner"},
        ]
    },
    "DevOps & Cloud Engineer": {
        "description": "Automates cloud infrastructure, manages Kubernetes clusters, optimizes CI/CD delivery pipelines, and ensures high availability.",
        "average_salary": "$135,000 - $180,000 / year",
        "demand": "Very High",
        "skills": [
            {"name": "Linux", "importance": "Must-have", "level": "Intermediate", "hours": 20, "deps": [], "difficulty": "Beginner"},
            {"name": "Git", "importance": "Must-have", "level": "Beginner", "hours": 8, "deps": [], "difficulty": "Beginner"},
            {"name": "Docker", "importance": "Must-have", "level": "Intermediate", "hours": 20, "deps": ["Linux"], "difficulty": "Intermediate"},
            {"name": "Kubernetes", "importance": "Must-have", "level": "Advanced", "hours": 35, "deps": ["Docker"], "difficulty": "Advanced"},
            {"name": "CI/CD", "importance": "Must-have", "level": "Intermediate", "hours": 20, "deps": ["Git"], "difficulty": "Intermediate"},
            {"name": "AWS", "importance": "Must-have", "level": "Advanced", "hours": 35, "deps": ["Linux"], "difficulty": "Advanced"},
            {"name": "Python", "importance": "Important", "level": "Intermediate", "hours": 15, "deps": [], "difficulty": "Beginner"},
            {"name": "Go", "importance": "Nice-to-have", "level": "Intermediate", "hours": 20, "deps": [], "difficulty": "Intermediate"},
        ]
    }
}

def get_available_roles() -> List[TargetRoleInfo]:
    roles = []
    for title, data in ROLE_DEFINITIONS.items():
        roles.append(TargetRoleInfo(
            id=title.lower().replace(" ", "-").replace("&", "and"),
            title=title,
            description=data["description"],
            average_salary=data["average_salary"],
            demand=data["demand"],
            key_skills=[s["name"] for s in data["skills"][:6]]
        ))
    return roles

def compute_skill_gaps(current_skills: List[str], target_role: str) -> SkillGapAnalysisResponse:
    role_data = ROLE_DEFINITIONS.get(target_role, ROLE_DEFINITIONS["AI/ML Engineer"])
    required_skills = role_data["skills"]
    
    current_set = {s.strip().lower() for s in current_skills}
    
    mastered: List[str] = []
    partial_gaps: List[SkillGapItem] = []
    missing_gaps: List[SkillGapItem] = []
    
    total_hours = 0
    
    for req in required_skills:
        name = req["name"]
        name_lower = name.lower()
        deps = req.get("deps", [])
        
        # Check if user has this skill
        if name_lower in current_set:
            mastered.append(name)
        else:
            # Determine gap category
            # If user has some prerequisite dependencies, it's an Intermediate Gap; else Beginner or Advanced
            has_deps = any(d.lower() in current_set for d in deps) if deps else False
            
            if req["difficulty"] == "Advanced":
                gap_type = "Advanced Gap (Missing Requirement)"
                priority = "High" if req["importance"] == "Must-have" else "Medium"
            elif has_deps or req["level"] == "Intermediate":
                gap_type = "Intermediate Gap (Partial Knowledge)"
                priority = "High" if req["importance"] == "Must-have" else "Medium"
            else:
                gap_type = "Beginner Gap (Unlearned Concept)"
                priority = "Medium" if req["importance"] == "Important" else "High"
                
            gap_item = SkillGapItem(
                skill_name=name,
                gap_type=gap_type,
                priority=priority,
                difficulty=req["difficulty"],
                estimated_hours=req["hours"],
                dependencies=deps,
                importance_for_role=req["importance"],
                status="Not Started"
            )
            
            total_hours += req["hours"]
            if "Partial" in gap_type:
                partial_gaps.append(gap_item)
            else:
                missing_gaps.append(gap_item)
                
    total_req_count = len(required_skills)
    readiness = round((len(mastered) / total_req_count) * 100, 1) if total_req_count > 0 else 0.0

    return SkillGapAnalysisResponse(
        target_role=target_role,
        current_skills=mastered,
        missing_skills=missing_gaps,
        partial_skills=partial_gaps,
        mastered_skills=mastered,
        readiness_percentage=readiness,
        total_estimated_hours=total_hours
    )

def build_skill_graph(current_skills: List[str], target_role: str) -> SkillGraphData:
    role_data = ROLE_DEFINITIONS.get(target_role, ROLE_DEFINITIONS["AI/ML Engineer"])
    current_set = {s.strip().lower() for s in current_skills}
    
    nodes: List[SkillGraphNode] = []
    edges: List[SkillGraphEdge] = []
    
    for req in role_data["skills"]:
        name = req["name"]
        name_lower = name.lower()
        deps = req.get("deps", [])
        
        if name_lower in current_set:
            status = "mastered"
        else:
            # Check if all prerequisites are mastered
            all_deps_mastered = all(d.lower() in current_set for d in deps) if deps else True
            if all_deps_mastered:
                status = "gap"  # ready to learn next
            else:
                status = "locked"  # blocked by missing prerequisites
                
        nodes.append(SkillGraphNode(
            id=name,
            label=name,
            category=req["difficulty"],
            status=status,
            difficulty=req["difficulty"],
            priority="High" if req["importance"] == "Must-have" else "Medium"
        ))
        
        for dep in deps:
            edges.append(SkillGraphEdge(
                id=f"{dep}->{name}",
                source=dep,
                target=name,
                label="prerequisite"
            ))
            
    return SkillGraphData(
        nodes=nodes,
        edges=edges,
        target_role=target_role
    )

def compare_all_roles(current_skills: List[str]) -> List[RoleComparisonItem]:
    current_set = {s.lower().strip() for s in current_skills}
    comparisons = []
    
    for role_title, role_data in ROLE_DEFINITIONS.items():
        role_skills = role_data["skills"]
        total_count = len(role_skills)
        matched = []
        missing = []
        missing_hours = 0
        
        for req in role_skills:
            if req["name"].lower().strip() in current_set:
                matched.append(req["name"])
            else:
                missing.append(req["name"])
                missing_hours += req["hours"]
                
        readiness = round((len(matched) / total_count) * 100, 1) if total_count > 0 else 0.0
        est_weeks = max(1, round(missing_hours / 10))
        
        diff = "Moderate"
        if readiness >= 70:
            diff = "Low (Fast Transition)"
        elif readiness < 35:
            diff = "High (Substantial Reskilling)"
            
        comparisons.append(RoleComparisonItem(
            role_id=role_title.lower().replace(" ", "-").replace("/", "-"),
            role_title=role_title,
            description=role_data["description"],
            average_salary=role_data["average_salary"],
            demand=role_data["demand"],
            total_required_skills=total_count,
            matched_skills_count=len(matched),
            missing_skills_count=len(missing),
            readiness_percentage=readiness,
            matched_skills=matched,
            missing_skills=missing,
            estimated_weeks_to_ready=est_weeks,
            difficulty_curve=diff
        ))
        
    comparisons.sort(key=lambda x: x.readiness_percentage, reverse=True)
    return comparisons

