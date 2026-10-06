// Comprehensive Mock Data Catalog for EduPath Autonomous AI Agent

export const DEMO_USER = {
  id: "demo-alex-rivera-2026",
  name: "Alex Rivera",
  email: "alex@edupath.ai",
  is_active: true,
  is_demo: true,
  profile: {
    user_id: "demo-alex-rivera-2026",
    current_role: "Junior Data Analyst",
    target_role: "AI/ML Engineer",
    experience_level: "Intermediate",
    education: "B.S. in Computer Science",
    career_goal: "Transition into a high-impact Machine Learning Engineering role building scalable deep learning systems.",
    weekly_hours: 12,
    preferred_learning_style: "Hands-on / Practical",
    preferred_language: "en",
    xp: 480,
    streak_days: 5
  }
};

export const AVAILABLE_ROLES = [
  {
    id: "role_aiml",
    title: "AI/ML Engineer",
    description: "Designs, trains, and deploys scalable artificial intelligence, deep learning, and transformer architectures into production.",
    average_salary: "$145,000 - $190,000 / year",
    demand: "Very High (Top 1% Growth)"
  },
  {
    id: "role_fullstack",
    title: "Full Stack Developer",
    description: "Architects and develops end-to-end modern web applications, cloud-native backend microservices, and interactive client UIs.",
    average_salary: "$115,000 - $160,000 / year",
    demand: "High"
  },
  {
    id: "role_datascientist",
    title: "Data Scientist",
    description: "Extracts predictive business intelligence from complex big data systems using machine learning, causal inference, and statistics.",
    average_salary: "$125,000 - $170,000 / year",
    demand: "High"
  },
  {
    id: "role_cloudarchitect",
    title: "Cloud & DevOps Engineer",
    description: "Engineers automated CI/CD deployment pipelines, container orchestration, Kubernetes clusters, and zero-trust cloud infrastructure.",
    average_salary: "$135,000 - $185,000 / year",
    demand: "Very High"
  }
];

export const ROLE_SKILL_BENCHMARKS = {
  "AI/ML Engineer": [
    { name: "Python", importance: "Must-have", level: "Advanced", hours: 20, difficulty: "Beginner", deps: [] },
    { name: "NumPy & Pandas", importance: "Must-have", level: "Advanced", hours: 15, difficulty: "Beginner", deps: ["Python"] },
    { name: "SQL & Relational DBs", importance: "Important", level: "Intermediate", hours: 15, difficulty: "Beginner", deps: [] },
    { name: "Machine Learning (Scikit-Learn)", importance: "Must-have", level: "Advanced", hours: 30, difficulty: "Intermediate", deps: ["NumPy & Pandas"] },
    { name: "Deep Learning Fundamentals", importance: "Must-have", level: "Advanced", hours: 35, difficulty: "Advanced", deps: ["Machine Learning (Scikit-Learn)"] },
    { name: "PyTorch & Tensor Operations", importance: "Must-have", level: "Advanced", hours: 40, difficulty: "Advanced", deps: ["Deep Learning Fundamentals"] },
    { name: "Transformers & LLM Fine-tuning", importance: "Important", level: "Advanced", hours: 35, difficulty: "Advanced", deps: ["PyTorch & Tensor Operations"] },
    { name: "FastAPI Model Serving", importance: "Important", level: "Intermediate", hours: 15, difficulty: "Intermediate", deps: ["Python"] },
    { name: "Docker Containerization", importance: "Important", level: "Intermediate", hours: 15, difficulty: "Intermediate", deps: [] },
    { name: "MLOps & CI/CD Pipelines", importance: "Important", level: "Advanced", hours: 25, difficulty: "Advanced", deps: ["Docker Containerization", "FastAPI Model Serving"] },
    { name: "Vector Databases & RAG", importance: "Must-have", level: "Advanced", hours: 20, difficulty: "Intermediate", deps: ["Python"] }
  ],
  "Full Stack Developer": [
    { name: "JavaScript / ES6+", importance: "Must-have", level: "Advanced", hours: 25, difficulty: "Beginner", deps: [] },
    { name: "TypeScript", importance: "Must-have", level: "Advanced", hours: 20, difficulty: "Intermediate", deps: ["JavaScript / ES6+"] },
    { name: "React 19 & Component Architecture", importance: "Must-have", level: "Advanced", hours: 30, difficulty: "Intermediate", deps: ["TypeScript"] },
    { name: "Tailwind CSS & Responsive UI", importance: "Important", level: "Advanced", hours: 12, difficulty: "Beginner", deps: [] },
    { name: "Node.js & Express / NestJS", importance: "Must-have", level: "Advanced", hours: 25, difficulty: "Intermediate", deps: ["TypeScript"] },
    { name: "PostgreSQL & Prisma ORM", importance: "Must-have", level: "Advanced", hours: 20, difficulty: "Intermediate", deps: [] },
    { name: "REST & GraphQL API Design", importance: "Important", level: "Intermediate", hours: 15, difficulty: "Intermediate", deps: ["Node.js & Express / NestJS"] },
    { name: "Docker & Container Basics", importance: "Important", level: "Intermediate", hours: 15, difficulty: "Intermediate", deps: [] },
    { name: "Git & Version Control", importance: "Must-have", level: "Advanced", hours: 10, difficulty: "Beginner", deps: [] }
  ],
  "Data Scientist": [
    { name: "Python", importance: "Must-have", level: "Advanced", hours: 20, difficulty: "Beginner", deps: [] },
    { name: "SQL & Query Optimization", importance: "Must-have", level: "Advanced", hours: 20, difficulty: "Beginner", deps: [] },
    { name: "Exploratory Data Analysis (EDA)", importance: "Must-have", level: "Advanced", hours: 25, difficulty: "Intermediate", deps: ["Python"] },
    { name: "Hypothesis Testing & Statistics", importance: "Must-have", level: "Advanced", hours: 30, difficulty: "Intermediate", deps: [] },
    { name: "Machine Learning Modeling", importance: "Must-have", level: "Advanced", hours: 35, difficulty: "Intermediate", deps: ["Exploratory Data Analysis (EDA)"] },
    { name: "Data Visualization (Tableau/Seaborn)", importance: "Important", level: "Intermediate", hours: 15, difficulty: "Beginner", deps: ["Python"] },
    { name: "Big Data (PySpark / Databricks)", importance: "Important", level: "Advanced", hours: 30, difficulty: "Advanced", deps: ["Python", "SQL & Query Optimization"] }
  ],
  "Cloud & DevOps Engineer": [
    { name: "Linux Administration & Bash", importance: "Must-have", level: "Advanced", hours: 20, difficulty: "Beginner", deps: [] },
    { name: "Docker Containerization", importance: "Must-have", level: "Advanced", hours: 25, difficulty: "Intermediate", deps: ["Linux Administration & Bash"] },
    { name: "Kubernetes Orchestration", importance: "Must-have", level: "Advanced", hours: 40, difficulty: "Advanced", deps: ["Docker Containerization"] },
    { name: "Terraform Infrastructure as Code", importance: "Must-have", level: "Advanced", hours: 30, difficulty: "Intermediate", deps: [] },
    { name: "CI/CD (GitHub Actions / GitLab)", importance: "Must-have", level: "Advanced", hours: 25, difficulty: "Intermediate", deps: [] },
    { name: "Cloud Architecture (AWS / GCP)", importance: "Must-have", level: "Advanced", hours: 35, difficulty: "Advanced", deps: [] }
  ]
};

export const INITIAL_ROADMAP = {
  id: "roadmap-seed-ml-2026",
  target_role: "AI/ML Engineer",
  title: "AI/ML Engineering Career Roadmap",
  total_weeks: 4,
  progress_percentage: 35.0,
  is_active: true,
  weekly_hours: 12,
  milestones: [
    {
      id: "week-1",
      week_number: 1,
      title: "Foundations: Advanced Python, Linear Algebra & Autograd",
      description: "Master computational graphs, vector manipulation in NumPy, and the mathematical mechanics of backpropagation.",
      status: "completed",
      items: [
        { id: "item-101", title: "Review Matrix Transformations & Eigendecomposition in NumPy", duration: "2.5h", done: true, type: "concept", resource_url: "https://numpy.org/doc/stable/" },
        { id: "item-102", title: "Build a Micrograd Scalar Autograd Engine from Scratch", duration: "4.0h", done: true, type: "coding", resource_url: "https://github.com/karpathy/micrograd" },
        { id: "item-103", title: "Implement Gradient Descent & Loss Functions in Pure Python", duration: "3.0h", done: true, type: "lab", resource_url: "https://pytorch.org/tutorials/" }
      ]
    },
    {
      id: "week-2",
      week_number: 2,
      title: "Deep Learning Core: PyTorch Tensor Engineering & CNNs",
      description: "Construct multi-layer neural networks, implement custom PyTorch Dataset/DataLoader pipelines, and handle GPU tensors.",
      status: "in_progress",
      items: [
        { id: "item-201", title: "PyTorch Tensor Manipulation & Computational Graph Optimization", duration: "3.5h", done: true, type: "concept", resource_url: "https://pytorch.org/docs/stable/tensors.html" },
        { id: "item-202", title: "Build Modular CNNs with Residual Blocks for Image Recognition", duration: "4.0h", done: false, type: "coding", resource_url: "https://pytorch.org/vision/stable/models.html" },
        { id: "item-203", title: "Diagnostic Assessment: PyTorch Autograd & Optimization Quirks", duration: "1.5h", done: false, type: "quiz", resource_url: "#" }
      ]
    },
    {
      id: "week-3",
      week_number: 3,
      title: "Sequence Modeling & Transformers: Attention & LLMs",
      description: "Deconstruct multi-head self-attention mechanisms, tokenization pipelines, and PEFT fine-tuning with Hugging Face.",
      status: "upcoming",
      items: [
        { id: "item-301", title: "Attention Is All You Need: Vectorized Multi-Head Self-Attention", duration: "3.0h", done: false, type: "concept", resource_url: "https://arxiv.org/abs/1706.03762" },
        { id: "item-302", title: "Fine-tune an Open LLM with LoRA on Domain Specific Instructions", duration: "5.0h", done: false, type: "coding", resource_url: "https://huggingface.co/docs/peft" },
        { id: "item-303", title: "Vector Embeddings & Semantic Search Retrieval with ChromaDB", duration: "3.5h", done: false, type: "lab", resource_url: "https://docs.trychroma.com/" }
      ]
    },
    {
      id: "week-4",
      week_number: 4,
      title: "Production Engineering: FastAPI Serving, Docker & MLOps",
      description: "Package models into high-throughput asynchronous API microservices, write container specs, and log inference latency.",
      status: "upcoming",
      items: [
        { id: "item-401", title: "High-Throughput Async Inference API with FastAPI & Pydantic v2", duration: "3.0h", done: false, type: "coding", resource_url: "https://fastapi.tiangolo.com/" },
        { id: "item-402", title: "Multi-Stage Dockerfile Containerization for PyTorch Workloads", duration: "2.5h", done: false, type: "lab", resource_url: "https://docs.docker.com/" },
        { id: "item-403", title: "Cap-Stone Portfolio Release: Production ML Service on GitHub", duration: "6.0h", done: false, type: "project", resource_url: "#" }
      ]
    }
  ]
};

export const INITIAL_FLASHCARDS = [
  {
    id: "fc-1",
    category: "PyTorch",
    question: "Why must you call `optimizer.zero_grad()` before `loss.backward()` in PyTorch training loops?",
    answer: "By default, PyTorch accumulates gradients in `.grad` buffers on every `.backward()` call. Failing to zero gradients causes them to sum up across batches, resulting in incorrect parameter updates.",
    code_snippet: "optimizer.zero_grad()  # Reset gradients\noutput = model(inputs)\nloss = criterion(output, targets)\nloss.backward()         # Calculate gradients\noptimizer.step()        # Update weights",
    difficulty: "Intermediate",
    mastered: false
  },
  {
    id: "fc-2",
    category: "Deep Learning",
    question: "What is the difference between Batch Normalization and Layer Normalization?",
    answer: "Batch Normalization computes mean and variance across the batch dimension for each channel (often used in CNNs). Layer Normalization computes statistics across all channels/hidden features for each individual sample (essential for Transformers & RNNs where batch sizes vary).",
    code_snippet: "torch.nn.BatchNorm2d(num_features)\ntorch.nn.LayerNorm(normalized_shape)",
    difficulty: "Advanced",
    mastered: true
  },
  {
    id: "fc-3",
    category: "Transformers",
    question: "What is the computational complexity of standard Scaled Dot-Product Attention relative to sequence length N?",
    answer: "O(N²) quadratic complexity in both computation and memory, because each token computes a dot product attention score with every other token in the sequence.",
    code_snippet: "Attention(Q, K, V) = softmax((Q @ K.T) / sqrt(d_k)) @ V",
    difficulty: "Advanced",
    mastered: false
  },
  {
    id: "fc-4",
    category: "MLOps",
    question: "What is Quantization (e.g. INT8/FP4) in LLM Deployment?",
    answer: "Reducing the numerical precision of model weights from 16-bit or 32-bit floating point down to 8-bit or 4-bit integers. It drastically decreases VRAM usage (up to 75%) and boosts inference throughput with negligible perplexity loss.",
    code_snippet: "# bitsandbytes 4-bit quantization\nfrom transformers import BitsAndBytesConfig\nquant_config = BitsAndBytesConfig(load_in_4bit=True)",
    difficulty: "Intermediate",
    mastered: false
  }
];

export const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    title: "Autonomous Multimodal RAG Agent with Citation Grounding",
    tagline: "Production-grade retrieval augmented generation pipeline with vector search and reranking.",
    difficulty: "Advanced",
    estimated_hours: 18,
    tech_stack: ["Python", "FastAPI", "PyTorch", "ChromaDB", "LangChain", "Docker"],
    key_features: [
      "Hybrid dense-sparse retrieval using BM25 and ColBERT embeddings",
      "Hallucination mitigation with confidence threshold scoring",
      "Asynchronous streaming SSE responses over FastAPI",
      "Complete automated GitHub Actions CI/CD test suite"
    ],
    github_readme_snippet: "# Autonomous Multimodal RAG Agent\n\n> High-throughput retrieval augmented generation microservice with citation provenance.\n\n### Architecture\n- **Embeddings:** HuggingFace BAAI/bge-large-en-v1.5\n- **Vector Store:** ChromaDB\n- **Inference Engine:** FastAPI + vLLM",
    resume_bullet: "Architected an asynchronous Multimodal RAG microservice handling 450+ RPM with sub-180ms retrieval latency using ChromaDB vector indexing and FastAPI."
  },
  {
    id: "proj-2",
    title: "Real-Time Stock Portfolio Risk & Sentiment Intelligence Hub",
    tagline: "Event-driven financial forecasting engine analyzing time-series market signals and news sentiment.",
    difficulty: "Intermediate",
    estimated_hours: 14,
    tech_stack: ["Python", "Pandas", "Scikit-Learn", "XGBoost", "React", "Tailwind CSS"],
    key_features: [
      "Real-time technical indicator calculation (RSI, MACD, Bollinger Bands)",
      "Financial news sentiment classification with FinBERT",
      "Interactive risk vs expected return frontier visualization",
      "Automated portfolio rebalancing simulations"
    ],
    github_readme_snippet: "# MarketSense Intelligence Hub\n\nPredictive financial modeling command center powered by XGBoost and FinBERT NLP sentiment.",
    resume_bullet: "Engineered a predictive risk modeling dashboard in React and Python that decreased portfolio drawdown variance by 24% using XGBoost regressors."
  }
];

export const PRACTICE_DIAGNOSTICS = {
  "PyTorch": {
    id: "quiz-pytorch-01",
    skill: "PyTorch",
    title: "PyTorch Autograd & Computational Graph Diagnostic",
    description: "Verify your understanding of backpropagation, tensor broadcasting, and GPU memory mechanics.",
    xp_reward: 75,
    questions: [
      {
        id: "q1",
        question: "Consider two tensors: `a = torch.tensor([1., 2.], requires_grad=True)` and `b = a ** 2`. What is the gradient `a.grad` after calling `b.sum().backward()`?",
        options: [
          "[1.0, 2.0]",
          "[2.0, 4.0]",
          "[1.0, 4.0]",
          "None (requires calling torch.no_grad())"
        ],
        correct_index: 1,
        explanation: "Since b = a², the derivative db/da = 2a. For a = [1, 2], db/da is [2*(1), 2*(2)] = [2.0, 4.0]."
      },
      {
        id: "q2",
        question: "Which function should be used to detach a tensor from the computational graph without breaking the underlying storage?",
        options: [
          "tensor.detach()",
          "tensor.clone()",
          "tensor.numpy()",
          "tensor.zero_grad()"
        ],
        correct_index: 0,
        explanation: "`.detach()` returns a new tensor that shares the same data storage but requires no gradients and is detached from the graph history."
      },
      {
        id: "q3",
        question: "Why should you wrap validation/evaluation code in `with torch.no_grad():` block?",
        options: [
          "It forces the model to run on CPU",
          "It deactivates dropout and batch normalization",
          "It disables autograd tracking, reducing GPU memory consumption and speeding up inference",
          "It automatically saves model checkpoints"
        ],
        correct_index: 2,
        explanation: "`torch.no_grad()` prevents PyTorch from building the computational graph during forward passes, saving significant VRAM and compute during evaluation."
      }
    ]
  }
};
