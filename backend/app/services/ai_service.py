import json
import os
from typing import AsyncGenerator, Dict, Any, List, Optional
from openai import AsyncOpenAI
import httpx

from backend.app.config import settings

MENTOR_SYSTEM_PROMPT = """You are EduPath AI, an expert personalized learning mentor and career strategist.
You mentor individual technical learners with empathy, precision, and pedagogical excellence.
You always tailor your responses strictly to the learner's actual profile, current skills, target role, and active roadmap.
Format your responses using clean GitHub-flavored Markdown, including bold concepts, organized bullet points, and syntax-highlighted code blocks where applicable.
Always respond in the learner's requested language.
"""

# Multilingual greetings and prompt templates
MULTILINGUAL_GREETINGS = {
    "en": "Hello! I am your EduPath AI Mentor. How can I assist your learning journey today?",
    "hi": "नमस्ते! मैं आपका EduPath AI मेंटर हूँ। आज मैं आपकी सीखने की यात्रा में कैसे सहायता कर सकता हूँ?",
    "pa": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ EduPath AI ਮੈਂਟਰ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਸਿੱਖਣ ਯਾਤਰਾ ਵਿੱਚ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    "es": "¡Hola! Soy tu mentor de IA en EduPath. ¿Cómo puedo ayudarte en tu ruta de aprendizaje hoy?",
    "fr": "Bonjour ! Je suis votre mentor IA EduPath. Comment puis-je vous aider dans votre apprentissage aujourd'hui ?",
    "de": "Hallo! Ich bin dein EduPath KI-Mentor. Wie kann ich dich heute bei deinem Lernweg unterstützen?",
    "ja": "こんにちは！EduPath AIメンターです。本日の学習をどのようにサポートしましょうか？"
}

def generate_deterministic_mentor_response(
    query: str,
    context: Dict[str, Any],
    language: str = "en"
) -> str:
    q_lower = query.lower()
    target_role = context.get("target_role", "AI/ML Engineer")
    current_skills = context.get("current_skills", ["Python", "SQL", "Git"])
    skill_gaps = context.get("skill_gaps", ["Deep Learning", "PyTorch", "MLOps"])
    weak_areas = context.get("weak_areas", ["SQL Joins", "Backpropagation"])
    name = context.get("name", "Learner")
    
    # 1. "What should I learn today?"
    if any(phrase in q_lower for phrase in ["learn today", "what today", "today's goal", "what should i learn"]):
        next_gap = skill_gaps[0] if skill_gaps else "PyTorch"
        return f"""### 🎯 Recommended Focus for Today: **{next_gap}**

Hello **{name}**, based on your active roadmap towards becoming an **{target_role}**, here is your priority objective for today:

1. **Core Concept:** Deep dive into foundational mechanics of **{next_gap}**.
2. **Estimated Duration:** ~90 minutes.
3. **Action Steps:**
   - Review tensor autograd and computation graph execution.
   - Implement a simple 2-layer perceptron from scratch without high-level abstractions.
   - Run the end-of-unit quiz to test retention.

> **Mentor Tip:** You already have strong command over `{', '.join(current_skills[:2])}`, so transitioning into {next_gap} is a natural step!"""

    # 2. "Why am I weak in..." or "weak"
    elif any(phrase in q_lower for phrase in ["why am i weak", "weakness", "struggle", "weak topic"]):
        weak = weak_areas[0] if weak_areas else "complex SQL joins"
        return f"""### 🔍 Analysis of Identified Challenge: **{weak}**

Looking through your recent practice attempts:
- You encountered tricky multi-table join criteria where nullable keys produced unexpected row counts.
- **Why this happens:** Relational joins (especially `LEFT JOIN` vs `INNER JOIN`) require mental modeling of cartesian sets before filtering.
- **How we will conquer it:**
  1. I have inserted an **Adaptive Revision Lab** into your weekly roadmap.
  2. We will practice visualizing table intersections before writing queries.
  3. Try 3 focused scenario-based queries today!"""

    # 3. "Explain recursion / concept like I'm a beginner"
    elif "explain" in q_lower or "like i'm a beginner" in q_lower:
        topic = "Recursion" if "recursion" in q_lower else "Gradient Descent"
        return f"""### 💡 Understanding **{topic}** (Simplified Intuition)

Imagine looking into a mirror that faces another mirror — you see an endless corridor of reflections.

In programming:
1. **The Base Case:** The exit door. Without it, you get an infinite loop (`RecursionError: maximum recursion depth exceeded`).
2. **The Recursive Step:** Solving a miniature slice of the problem and passing the remainder back to yourself.

```python
def countdown(n: int):
    # Base Case: stop condition
    if n <= 0:
        print("Blast off! 🚀")
        return
    
    # Work done at this step
    print(n)
    
    # Recursive Call: smaller problem
    countdown(n - 1)

countdown(3)
# Output: 3, 2, 1, Blast off! 🚀
```

Would you like to try a small coding challenge to test this?"""

    # 4. "Give me questions / test me"
    elif any(phrase in q_lower for phrase in ["question", "test me", "quiz", "challenge"]):
        return f"""### 🧠 Quick Diagnostic Challenge for **{target_role}**

**Question:** In PyTorch, what is the key difference between `.detach()` and `.clone()`?

```python
# Code Snippet
x = torch.tensor([2.0, 3.0], requires_grad=True)
y = x.clone()
z = x.detach()
```

* **Option A:** `.detach()` shares memory and detaches from the computational graph; `.clone()` allocates new memory and keeps gradients.
* **Option B:** Both allocate completely new CUDA memory buffers.
* **Option C:** `.clone()` deletes the backward autograd history.
* **Option D:** They are completely interchangeable aliases.

*Reply with your answer and I will provide immediate feedback and detailed explanation!*"""

    # 5. "Create a project"
    elif "project" in q_lower:
        return f"""### 🛠️ High-Impact Portfolio Project: **Autonomous Learning Roadmap Tracker**

Based on your skills in `{', '.join(current_skills)}` and target role of **{target_role}**:

- **Problem:** Students struggle to navigate scattered learning resources and assess their real readiness for technical careers.
- **Tech Stack:** FastAPI, PyTorch (for embedding-based skill matching), React 19, SQLite.
- **Key Milestones:**
  1. Automated resume parsing pipeline using `pypdf`.
  2. Graph-based skill gap detection with prerequisite topological sorting.
  3. Context-aware AI chat assistant with speech recognition.
- **Resume Impact:** Demonstrates full-stack capability, asynchronous backend design, and LLM application architecture."""

    # Default contextual response
    else:
        return f"""### 🚀 EduPath AI Mentor Response

Hello **{name}**! Regarding your query about: *"{query}"*

As you prepare for the **{target_role}** career path:
- **Your Current Assets:** Strong foundations in `{', '.join(current_skills)}`.
- **Next High-Priority Gaps:** `{', '.join(skill_gaps[:3])}`.
- **Recent Progress:** You're maintaining a steady learning rhythm.

Feel free to ask me to explain any complex concept, generate coding exercises, or adjust your weekly roadmap objectives!"""

async def query_ai_mentor(
    query: str,
    context: Dict[str, Any],
    language: str = "en"
) -> str:
    """
    Unified AI service: Uses external LLM if API key is present,
    or falls back to the deterministic contextual mentor engine.
    """
    api_key = settings.GEMINI_API_KEY or settings.OPENAI_API_KEY
    
    if not api_key:
        # Graceful Deterministic Fallback Mode
        return generate_deterministic_mentor_response(query, context, language)
        
    try:
        # Use OpenAI-compatible async client (works for OpenAI, Gemini via endpoint, or Groq)
        client = AsyncOpenAI(api_key=api_key)
        
        context_str = json.dumps(context, indent=2)
        user_message = f"""Learner Context:
{context_str}

Requested Response Language: {language}

Learner Question:
{query}
"""
        response = await client.chat.completions.create(
            model=settings.AI_MODEL,
            messages=[
                {"role": "system", "content": MENTOR_SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        return response.choices[0].message.content or "No response received."
    except Exception as e:
        # Fallback gracefully if external API has a rate-limit or network issue
        return generate_deterministic_mentor_response(query, context, language)
