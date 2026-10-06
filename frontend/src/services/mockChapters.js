// Extracted Chapter Analytics Data Store for EduPath
export const CHAPTER_DATA_STORE = {
    "ml": {
        "id": "ml",
        "name": "Machine Learning & Neural Networks",
        "icon": "ðŸ§ ",
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
        "icon": "ðŸ",
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
        "icon": "ðŸ’¾",
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
        "icon": "âš¡",
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
        "icon": "ðŸ³",
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
};

export function buildSubjectResponse(subKey, subDict) {
  const chapters = subDict.chapters;
  const total = chapters.length;
  const readCount = chapters.filter(c => c.status === "completed").length;
  const leftCount = total - readCount;
  const completionRate = total ? Math.round((readCount / total) * 1000) / 10 : 0.0;
  const scores = chapters.filter(c => c.score > 0).map(c => c.score);
  const avgScore = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 85.0;

  const moduleGroups = {};
  chapters.forEach(c => {
    const mod = c.module;
    if (!moduleGroups[mod]) {
      moduleGroups[mod] = { name: mod, chapters_read: 0, chapters_left: 0, total: 0 };
    }
    moduleGroups[mod].total += 1;
    if (c.status === "completed") {
      moduleGroups[mod].chapters_read += 1;
    } else {
      moduleGroups[mod].chapters_left += 1;
    }
  });

  return {
    id: subDict.id,
    name: subDict.name,
    icon: subDict.icon,
    total_chapters: total,
    chapters_read: readCount,
    chapters_left: leftCount,
    completion_rate: completionRate,
    avg_quiz_score: avgScore,
    study_hours: subDict.study_hours || 12.0,
    modules: Object.values(moduleGroups),
    velocity_trend: subDict.velocity_trend || [],
    chapters: chapters
  };
}

export function buildAllSubjectsResponse() {
  const allChapters = [];
  const allModules = [];
  let totalHours = 0.0;

  Object.entries(CHAPTER_DATA_STORE).forEach(([sKey, sVal]) => {
    const res = buildSubjectResponse(sKey, sVal);
    totalHours += res.study_hours;
    res.chapters.forEach(c => {
      allChapters.push({ ...c, subject: sVal.name, subject_id: sKey });
    });
    allModules.push({
      name: sVal.name.split('&')[0].trim(),
      chapters_read: res.chapters_read,
      chapters_left: res.chapters_left,
      total: res.total_chapters
    });
  });

  const total = allChapters.length;
  const readCount = allChapters.filter(c => c.status === "completed").length;
  const leftCount = total - readCount;
  const completionRate = total ? Math.round((readCount / total) * 1000) / 10 : 0.0;
  const scores = allChapters.filter(c => c.score > 0).map(c => c.score);
  const avgScore = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 84.5;

  const trend = [
    { day: "Mon", read: 5, score: 91 },
    { day: "Tue", read: 9, score: 90 },
    { day: "Wed", read: 14, score: 88 },
    { day: "Thu", read: 18, score: 87 },
    { day: "Fri", read: 22, score: 85 },
    { day: "Sat", read: 25, score: 84 },
    { day: "Sun", read: readCount, score: avgScore }
  ];

  return {
    id: "all",
    name: "All Subjects",
    icon: "🌐",
    total_chapters: total,
    chapters_read: readCount,
    chapters_left: leftCount,
    completion_rate: completionRate,
    avg_quiz_score: avgScore,
    study_hours: Math.round(totalHours * 10) / 10,
    modules: allModules,
    velocity_trend: trend,
    chapters: allChapters
  };
}
