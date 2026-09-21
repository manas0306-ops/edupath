import uuid
from typing import List, Dict, Optional
from backend.app.schemas.practice import PracticeTaskResponse, PracticeResultResponse

PRACTICE_QUESTION_BANK: Dict[str, List[Dict]] = {
    "PyTorch": [
        {
            "id": "pt-1",
            "task_type": "mcq",
            "difficulty": "Intermediate",
            "title": "PyTorch Gradient Graph Computation",
            "question": "When training a neural network in PyTorch, why is `optimizer.zero_grad()` called before `loss.backward()` in the training loop?",
            "code_snippet": "for data, target in dataloader:\n    optimizer.zero_grad()  # <-- Why here?\n    output = model(data)\n    loss = criterion(output, target)\n    loss.backward()\n    optimizer.step()",
            "options": [
                "To reset model weights back to random initialization",
                "Because gradients accumulate in buffers by default and would otherwise sum across iterations",
                "To clear GPU memory cache and prevent CUDA out-of-memory errors",
                "To zero out the loss scalar before backpropagation"
            ],
            "correct_answer": "Because gradients accumulate in buffers by default and would otherwise sum across iterations",
            "hint": "Think about how RNNs or multi-objective losses might utilize accumulated gradients.",
            "explanation": "In PyTorch, gradients accumulate by default upon calling loss.backward(). If optimizer.zero_grad() is omitted, gradients from the previous batch will add to the current batch, resulting in invalid weight updates."
        },
        {
            "id": "pt-2",
            "task_type": "code_challenge",
            "difficulty": "Intermediate",
            "title": "Moving Tensors to Available Hardware Accelerator",
            "question": "Which code snippet correctly transfers both the neural network `model` and the input `tensor` to CUDA if available, falling back safely to CPU?",
            "code_snippet": None,
            "options": [
                "device = 'cuda' if torch.cuda.is_available() else 'cpu'; model.to(device); tensor = tensor.to(device)",
                "model.cuda(); tensor.cuda()",
                "torch.set_default_device('cuda'); model.compile()",
                "device = torch.gpu(); model = device(model)"
            ],
            "correct_answer": "device = 'cuda' if torch.cuda.is_available() else 'cpu'; model.to(device); tensor = tensor.to(device)",
            "hint": "Check how `torch.cuda.is_available()` is used to dynamically construct a torch.device.",
            "explanation": "`torch.cuda.is_available()` returns a boolean. Explicitly using `.to(device)` transfers weights and input data to the selected accelerator."
        }
    ],
    "SQL": [
        {
            "id": "sql-1",
            "task_type": "mcq",
            "difficulty": "Intermediate",
            "title": "SQL JOIN Behavior on Nullable Keys",
            "question": "You execute a `LEFT JOIN` between `users` (left table) and `orders` (right table) on `users.id = orders.user_id`. What appears in the `orders.order_id` column for users who have never placed an order?",
            "code_snippet": "SELECT users.name, orders.order_id\nFROM users\nLEFT JOIN orders ON users.id = orders.user_id;",
            "options": [
                "0",
                "An empty string ''",
                "NULL",
                "The query throws an IntegrityError"
            ],
            "correct_answer": "NULL",
            "hint": "Consider standard relational algebra for un-matched outer join tuples.",
            "explanation": "In an outer join (LEFT JOIN), unmatched rows from the right table are padded with NULL values for all right-table columns."
        }
    ],
    "Machine Learning": [
        {
            "id": "ml-1",
            "task_type": "mcq",
            "difficulty": "Intermediate",
            "title": "Bias-Variance Tradeoff Diagnosis",
            "question": "A classifier achieves 99.4% training accuracy, but only 64.1% validation accuracy on held-out test data. What is the primary diagnosis and recommended remedy?",
            "code_snippet": None,
            "options": [
                "High Bias (Underfitting); Increase model capacity or add polynomial features",
                "High Variance (Overfitting); Apply regularization (L1/L2, dropout) or gather more training data",
                "Data leakage; Swap the loss function to Mean Squared Error",
                "Label noise; Decrease the learning rate by 10x"
            ],
            "correct_answer": "High Variance (Overfitting); Apply regularization (L1/L2, dropout) or gather more training data",
            "hint": "The large gap between train and test scores indicates the model memorized the training set.",
            "explanation": "A substantial delta between near-perfect training performance and mediocre test performance is the classic hallmark of overfitting (high variance)."
        }
    ],
    "Deep Learning": [
        {
            "id": "dl-1",
            "task_type": "mcq",
            "difficulty": "Advanced",
            "title": "Vanishing Gradient Mitigation in Deep Architectures",
            "question": "Why did the introduction of Residual Connections (Skip Connections) in ResNet allow training of 100+ layer deep networks?",
            "code_snippet": "F(x) + x",
            "options": [
                "They eliminate the need for matrix multiplication in linear layers",
                "They provide a direct gradient highway where gradients can flow backward without repeated decaying multiplications",
                "They force all layer weights to remain orthogonal",
                "They convert non-convex loss surfaces into strictly convex quadratics"
            ],
            "correct_answer": "They provide a direct gradient highway where gradients can flow backward without repeated decaying multiplications",
            "hint": "Derivative of (F(x) + x) with respect to x includes a +1 term.",
            "explanation": "During backpropagation, d/dx (F(x) + x) = dF/dx + 1. The constant +1 ensures gradients can pass directly to earlier layers without vanishing."
        }
    ]
}

def get_practice_for_skill(skill_name: str) -> List[PracticeTaskResponse]:
    questions = PRACTICE_QUESTION_BANK.get(skill_name)
    if not questions:
        # Generate dynamic template question
        questions = [
            {
                "id": f"{skill_name.lower()}-gen-1",
                "task_type": "mcq",
                "difficulty": "Intermediate",
                "title": f"Core Competency Assessment: {skill_name}",
                "question": f"When architecting production solutions with {skill_name}, which practice is considered industry standard?",
                "code_snippet": None,
                "options": [
                    f"Employ modular separation of concerns and robust error handling for {skill_name}",
                    f"Disable validation checks to maximize raw execution speed",
                    f"Hardcode external endpoints directly inside application source code",
                    f"Avoid automated unit testing and rely solely on manual inspection"
                ],
                "correct_answer": f"Employ modular separation of concerns and robust error handling for {skill_name}",
                "hint": f"Think about maintainability, observability, and scalability.",
                "explanation": f"Professional production engineering mandates structured abstraction, defensive validation, and clear error boundaries for {skill_name}."
            }
        ]
        
    return [
        PracticeTaskResponse(
            id=q["id"],
            skill_name=skill_name,
            task_type=q["task_type"],
            difficulty=q["difficulty"],
            title=q["title"],
            question=q["question"],
            code_snippet=q.get("code_snippet"),
            options=q["options"],
            hint=q.get("hint")
        )
        for q in questions
    ]

def evaluate_practice_attempt(task_id: str, user_answer: str, time_taken_seconds: int = 30) -> PracticeResultResponse:
    # Find matching task in bank
    target_task = None
    for skill, tasks in PRACTICE_QUESTION_BANK.items():
        for t in tasks:
            if t["id"] == task_id:
                target_task = t
                break
        if target_task:
            break
            
    if not target_task:
        # Fallback evaluation
        is_correct = "modular" in user_answer.lower() or "best practice" in user_answer.lower()
        return PracticeResultResponse(
            is_correct=is_correct,
            score=100.0 if is_correct else 0.0,
            correct_answer="Standard Best Practice Implementation",
            explanation="Industry standard patterns emphasize robustness and maintainability.",
            feedback="Great understanding of fundamental design principles!" if is_correct else "Review the core concepts before proceeding.",
            struggle_detected=not is_correct,
            xp_earned=50 if is_correct else 10,
            adaptive_action="Added revision module to your weekly schedule." if not is_correct else None
        )
        
    is_correct = (user_answer.strip().lower() == target_task["correct_answer"].strip().lower())
    struggle = not is_correct or time_taken_seconds > 180
    
    adaptive_action = None
    if struggle:
        adaptive_action = f"AI detected conceptual challenge in {target_task['title']}. Inserting targeted refresher module into your active roadmap."

    return PracticeResultResponse(
        is_correct=is_correct,
        score=100.0 if is_correct else 0.0,
        correct_answer=target_task["correct_answer"],
        explanation=target_task["explanation"],
        feedback="Outstanding! You've demonstrated firm command of this concept." if is_correct else "Notice where your intuition diverged — check the explanation above.",
        struggle_detected=struggle,
        xp_earned=50 if is_correct else 10,
        adaptive_action=adaptive_action
    )
