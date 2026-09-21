import io
import re
import xml.etree.ElementTree as ET
import zipfile
from typing import Dict, List, Tuple
import pypdf

from backend.app.schemas.skill import SkillExtracted, ExtractedProfileData

# Curated taxonomy for rapid and accurate skill matching
TECH_SKILLS_TAXONOMY = {
    "Python": ("Language", "Intermediate"),
    "JavaScript": ("Language", "Intermediate"),
    "TypeScript": ("Language", "Intermediate"),
    "Java": ("Language", "Intermediate"),
    "C++": ("Language", "Advanced"),
    "C": ("Language", "Intermediate"),
    "C#": ("Language", "Intermediate"),
    "Go": ("Language", "Intermediate"),
    "Rust": ("Language", "Advanced"),
    "SQL": ("Language", "Intermediate"),
    "HTML": ("Language", "Beginner"),
    "CSS": ("Language", "Beginner"),
    "R": ("Language", "Intermediate"),
    
    # Frameworks & Libraries
    "React": ("Framework", "Intermediate"),
    "Node.js": ("Framework", "Intermediate"),
    "FastAPI": ("Framework", "Intermediate"),
    "Django": ("Framework", "Intermediate"),
    "Flask": ("Framework", "Intermediate"),
    "Express": ("Framework", "Intermediate"),
    "Next.js": ("Framework", "Intermediate"),
    "Vue.js": ("Framework", "Intermediate"),
    "Spring Boot": ("Framework", "Advanced"),
    "Tailwind CSS": ("Framework", "Beginner"),
    
    # AI / ML / Data Science
    "Machine Learning": ("Concept", "Intermediate"),
    "Deep Learning": ("Concept", "Advanced"),
    "PyTorch": ("Library", "Advanced"),
    "TensorFlow": ("Library", "Advanced"),
    "Scikit-learn": ("Library", "Intermediate"),
    "Pandas": ("Library", "Intermediate"),
    "NumPy": ("Library", "Beginner"),
    "NLP": ("Concept", "Advanced"),
    "Computer Vision": ("Concept", "Advanced"),
    "Large Language Models": ("Concept", "Advanced"),
    "MLOps": ("Tool", "Advanced"),
    "Data Analysis": ("Concept", "Intermediate"),
    "Statistics": ("Concept", "Intermediate"),
    "Neural Networks": ("Concept", "Advanced"),
    
    # Databases & Cloud
    "PostgreSQL": ("Tool", "Intermediate"),
    "MySQL": ("Tool", "Intermediate"),
    "MongoDB": ("Tool", "Intermediate"),
    "Redis": ("Tool", "Intermediate"),
    "SQLite": ("Tool", "Beginner"),
    "Docker": ("Tool", "Intermediate"),
    "Kubernetes": ("Tool", "Advanced"),
    "AWS": ("Tool", "Advanced"),
    "Google Cloud": ("Tool", "Advanced"),
    "Azure": ("Tool", "Advanced"),
    "Git": ("Tool", "Beginner"),
    "CI/CD": ("Tool", "Intermediate"),
    "Linux": ("Tool", "Intermediate"),
    "Model Deployment": ("Concept", "Advanced")
}

SOFT_SKILLS_KEYWORDS = [
    "Problem Solving", "Team Leadership", "Communication", "Agile",
    "Scrum", "Critical Thinking", "Collaboration", "Project Management", "Mentorship"
]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        text_parts = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
        return "\n".join(text_parts)
    except Exception as e:
        return f"Error extracting PDF: {str(e)}"

def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
            xml_content = z.read("word/document.xml")
            tree = ET.fromstring(xml_content)
            namespace = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
            texts = [node.text for node in tree.iter(f"{{{namespace['w']}}}t") if node.text]
            return " ".join(texts)
    except Exception as e:
        return f"Error extracting DOCX: {str(e)}"

def parse_document_text(filename: str, content: bytes) -> str:
    lower_name = filename.lower()
    if lower_name.endswith(".pdf"):
        return extract_text_from_pdf(content)
    elif lower_name.endswith(".docx"):
        return extract_text_from_docx(content)
    else:
        # Plain text / markdown
        try:
            return content.decode("utf-8")
        except UnicodeDecodeError:
            return content.decode("latin-1", errors="ignore")

def extract_profile_from_text(raw_text: str) -> ExtractedProfileData:
    cleaned_text = re.sub(r'\s+', ' ', raw_text)
    text_lower = cleaned_text.lower()
    
    extracted_skills: List[SkillExtracted] = []
    seen_skills = set()
    
    for skill_name, (category, default_level) in TECH_SKILLS_TAXONOMY.items():
        pattern = r'\b' + re.escape(skill_name.lower()) + r'\b'
        if re.search(pattern, text_lower):
            if skill_name not in seen_skills:
                seen_skills.add(skill_name)
                # Assign confidence based on frequency
                count = len(re.findall(pattern, text_lower))
                confidence = min(0.95, 0.70 + (count * 0.05))
                extracted_skills.append(SkillExtracted(
                    name=skill_name,
                    category=category,
                    proficiency=default_level,
                    confidence=round(confidence, 2)
                ))
                
    found_soft_skills = [s for s in SOFT_SKILLS_KEYWORDS if re.search(r'\b' + re.escape(s.lower()) + r'\b', text_lower)]
    
    # Project detection
    project_matches = re.findall(r'(?:project|built|developed|created)\s*:\s*([^.\n]+)', cleaned_text, re.IGNORECASE)
    detected_projects = [p.strip() for p in project_matches[:4] if len(p.strip()) > 5]
    if not detected_projects:
        detected_projects = ["Web Application Project", "Data Analysis Dashboard"]
        
    # Education detection
    education = "B.S. in Computer Science / Related Field"
    if "master" in text_lower or "m.s." in text_lower:
        education = "M.S. in Computer Science"
    elif "phd" in text_lower or "doctor" in text_lower:
        education = "Ph.D. in Technical Discipline"
    elif "bachelor" in text_lower or "b.tech" in text_lower or "b.e." in text_lower:
        education = "Bachelor of Technology / Computer Science"
        
    # Experience Level
    years_matches = re.findall(r'(\d+)\+?\s*years?', text_lower)
    experience_level = "Beginner"
    if years_matches:
        max_yrs = max(int(y) for y in years_matches if int(y) < 30)
        if max_yrs >= 5:
            experience_level = "Advanced"
        elif max_yrs >= 2:
            experience_level = "Intermediate"

    return ExtractedProfileData(
        name="Learner",
        education=education,
        experience_level=experience_level,
        technical_skills=extracted_skills,
        soft_skills=found_soft_skills or ["Problem Solving", "Collaboration"],
        projects_detected=detected_projects,
        tools_and_frameworks=[s.name for s in extracted_skills if s.category in ["Tool", "Framework", "Library"]],
        raw_summary=f"Extracted {len(extracted_skills)} technical competencies and {len(found_soft_skills)} professional skills."
    )
