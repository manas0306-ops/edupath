// Extracted Multilingual Flashcards and Quiz Bank for EduPath
export const AVAILABLE_TOPICS = [
    {"id": "all", "name": "All Programming Topics", "icon": "ðŸŒ"},
    {"id": "python", "name": "Python & Data Structures", "icon": "ðŸ"},
    {"id": "sql", "name": "SQL & Database Engineering", "icon": "ðŸ’¾"},
    {"id": "pytorch", "name": "PyTorch & Deep Learning", "icon": "ðŸ”¥"},
    {"id": "ml", "name": "Machine Learning Algorithms", "icon": "ðŸ¤–"},
    {"id": "fastapi", "name": "FastAPI & Microservices", "icon": "âš¡"},
    {"id": "docker", "name": "Docker & Cloud DevOps", "icon": "ðŸ³"},
];

export const PROGRAMMING_FLASHCARDS = [
    # --- PYTHON & DATA STRUCTURES ---
    {
        "id": "fc-py-1",
        "topic": "python",
        "subtopic": "Memory & Performance",
        "difficulty": "Intermediate",
        "front_prompt": "What is Python's Global Interpreter Lock (GIL), and why does it affect multi-threading?",
        "code_snippet": "import threading\n# Both threads compete for GIL in CPython\nt1 = threading.Thread(target=cpu_heavy_task)\nt2 = threading.Thread(target=cpu_heavy_task)",
        "back_answer": "A mutex that allows only one native thread to execute Python bytecode at a time in CPython.",
        "key_takeaway": "Use `multiprocessing` for CPU-bound tasks, and `threading` or `asyncio` for I/O-bound tasks.",
        "explanations": {
            "en": "The GIL ensures thread-safety in CPython's reference-counting memory model. Because only one thread runs bytecode simultaneously, CPU-intensive multi-threading doesn't scale across multiple CPU cores; multi-processing is needed instead.",
            "hi": "GIL CPython à¤®à¥‡à¤‚ à¤à¤• à¤¸à¥à¤°à¤•à¥à¤·à¤¾à¤¤à¥à¤®à¤• à¤®à¥à¤¯à¥‚à¤Ÿà¤¿à¤•à¥à¤¸ à¤¹à¥ˆ à¤œà¥‹ à¤à¤• à¤¸à¤®à¤¯ à¤®à¥‡à¤‚ à¤•à¥‡à¤µà¤² à¤à¤• à¤¥à¥à¤°à¥‡à¤¡ à¤•à¥‹ à¤¬à¤¾à¤‡à¤Ÿà¤•à¥‹à¤¡ à¤¨à¤¿à¤·à¥à¤ªà¤¾à¤¦à¤¿à¤¤ à¤•à¤°à¤¨à¥‡ à¤•à¥€ à¤…à¤¨à¥à¤®à¤¤à¤¿ à¤¦à¥‡à¤¤à¤¾ à¤¹à¥ˆà¥¤ à¤‡à¤¸à¤²à¤¿à¤ à¤¸à¥€à¤ªà¥€à¤¯à¥‚-à¤—à¤¹à¤¨ à¤•à¤¾à¤°à¥à¤¯à¥‹à¤‚ à¤•à¥‡ à¤²à¤¿à¤ à¤®à¤²à¥à¤Ÿà¥€à¤¥à¥à¤°à¥‡à¤¡à¤¿à¤‚à¤— à¤•à¥‡ à¤¬à¤œà¤¾à¤¯ à¤®à¤²à¥à¤Ÿà¥€à¤ªà¥à¤°à¥‹à¤¸à¥‡à¤¸à¤¿à¤‚à¤— à¤•à¤¾ à¤‰à¤ªà¤¯à¥‹à¤— à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆà¥¤",
            "pa": "GIL CPython à¨µà¨¿à©±à¨š à¨‡à©±à¨• à¨®à¨¿à¨Šà¨Ÿà©ˆà¨•à¨¸ à¨¹à©ˆ à¨œà©‹ à¨‡à©±à¨• à¨¸à¨®à©‡à¨‚ à¨¸à¨¿à¨°à¨«à¨¼ à¨‡à©±à¨• à¨¥à©à¨°à©ˆà©±à¨¡ à¨¨à©‚à©° à¨¬à¨¾à¨ˆà¨Ÿà¨•à©‹à¨¡ à¨šà¨²à¨¾à¨‰à¨£ à¨¦à¨¿à©°à¨¦à¨¾ à¨¹à©ˆà¥¤ à¨‡à¨¸ à¨•à¨°à¨•à©‡ CPU-à¨—à©°à¨­à©€à¨° à¨•à©°à¨®à¨¾à¨‚ à¨²à¨ˆ à¨®à¨²à¨Ÿà©€à¨ªà©à¨°à©‹à¨¸à©ˆà¨¸à¨¿à©°à¨— à¨µà¨°à¨¤à¨£à©€ à¨šà¨¾à¨¹à©€à¨¦à©€ à¨¹à©ˆà¥¤",
            "es": "El GIL es un mutex en CPython que permite que solo un subproceso ejecute cÃ³digo de bytes a la vez. Para tareas que consumen mucha CPU, se debe usar multiprocesamiento en lugar de subprocesos mÃºltiples.",
            "fr": "Le GIL est un mutex dans CPython permettant Ã  un seul thread d'exÃ©cuter le bytecode Ã  la fois. Pour les calculs intensifs sur processeur, il faut utiliser le multiprocessing plutÃ´t que le multi-threading.",
            "de": "Das GIL ist ein Mutex in CPython, der sicherstellt, dass jeweils nur ein Thread Python-Bytecode ausfÃ¼hrt. Bei CPU-intensiven Aufgaben sollte Multiprocessing statt Multithreading genutzt werden.",
            "ja": "GILã¯CPythonã«ãŠã„ã¦ä¸€åº¦ã«1ã¤ã®ã‚¹ãƒ¬ãƒƒãƒ‰ã®ã¿ãŒãƒã‚¤ãƒˆã‚³ãƒ¼ãƒ‰ã‚’å®Ÿè¡Œã§ãã‚‹ã‚ˆã†ã«ã™ã‚‹ãƒŸãƒ¥ãƒ¼ãƒ†ãƒƒã‚¯ã‚¹ã§ã™ã€‚CPUè² è·ã®é«˜ã„ã‚¿ã‚¹ã‚¯ã«ã¯ãƒžãƒ«ãƒã‚¹ãƒ¬ãƒƒãƒ‰ã§ã¯ãªããƒžãƒ«ãƒãƒ—ãƒ­ã‚»ãƒƒã‚·ãƒ³ã‚°ã‚’ä½¿ç”¨ã—ã¾ã™ã€‚"
        },
        "tags": ["Python", "Concurrency", "GIL", "Memory"]
    },
    {
        "id": "fc-py-2",
        "topic": "python",
        "subtopic": "Data Structures",
        "difficulty": "Beginner",
        "front_prompt": "What is the average time complexity of key lookup and insertion in a Python dictionary?",
        "code_snippet": "user_map = {'alice': 101, 'bob': 102}\nval = user_map['alice']  # Time complexity?",
        "back_answer": "Average: O(1) constant time. Worst case: O(n) during severe hash collisions.",
        "key_takeaway": "Python dicts use open-addressing hash tables with perturbation-based probing to maintain near-instant O(1) performance.",
        "explanations": {
            "en": "Python dictionaries are implemented as dynamic hash tables. When key hashes are uniformly distributed, hash indexing takes O(1) time. In the rare worst case with high collisions, it degrades to O(n).",
            "hi": "à¤ªà¤¾à¤¯à¤¥à¤¨ à¤¡à¤¿à¤•à¥à¤¶à¤¨à¤°à¥€ à¤¡à¤¾à¤¯à¤¨à¥‡à¤®à¤¿à¤• à¤¹à¥ˆà¤¶ à¤Ÿà¥‡à¤¬à¤² à¤•à¤¾ à¤‰à¤ªà¤¯à¥‹à¤— à¤•à¤°à¤¤à¥€ à¤¹à¥ˆà¤‚à¥¤ à¤¸à¤¾à¤®à¤¾à¤¨à¥à¤¯ à¤ªà¤°à¤¿à¤¸à¥à¤¥à¤¿à¤¤à¤¿à¤¯à¥‹à¤‚ à¤®à¥‡à¤‚ à¤¹à¥ˆà¤¶ à¤‡à¤‚à¤¡à¥‡à¤•à¥à¤¸à¤¿à¤‚à¤— O(1) à¤¸à¥à¤¥à¤¿à¤° à¤¸à¤®à¤¯ à¤²à¥‡à¤¤à¥€ à¤¹à¥ˆà¥¤ à¤¦à¥à¤°à¥à¤²à¤­ à¤—à¤‚à¤­à¥€à¤° à¤¹à¥ˆà¤¶ à¤Ÿà¤•à¤°à¤¾à¤µ à¤®à¥‡à¤‚ à¤¯à¤¹ O(n) à¤¹à¥‹ à¤¸à¤•à¤¤à¤¾ à¤¹à¥ˆà¥¤",
            "pa": "à¨ªà¨¾à¨ˆà¨¥à¨¨ à¨¡à¨¿à¨•à¨¸à¨¼à¨¨à¨°à©€à¨†à¨‚ à¨¹à©ˆà¨¸à¨¼ à¨Ÿà©‡à¨¬à¨² à¨¦à©€ à¨µà¨°à¨¤à©‹à¨‚ à¨•à¨°à¨¦à©€à¨†à¨‚ à¨¹à¨¨à¥¤ à¨†à¨® à¨¤à©Œà¨° 'à¨¤à©‡ à¨•à©à©°à¨œà©€ à¨²à©±à¨­à¨£ à¨¦à¨¾ à¨¸à¨®à¨¾à¨‚ O(1) à¨¹à©à©°à¨¦à¨¾ à¨¹à©ˆ, à¨ªà¨° à¨—à©°à¨­à©€à¨° à¨Ÿà¨•à¨°à¨¾à¨… à¨µà¨¿à©±à¨š à¨‡à¨¹ O(n) à¨¹à©‹ à¨¸à¨•à¨¦à¨¾ à¨¹à©ˆà¥¤",
            "es": "Los diccionarios de Python son tablas hash dinÃ¡micas. Con claves bien distribuidas, la bÃºsqueda toma tiempo constante O(1). En el peor caso con colisiones extremas se degrada a O(n).",
            "fr": "Les dictionnaires Python reposent sur des tables de hachage dynamiques. La recherche s'effectue en temps constant moyen O(1), et peut se dÃ©grader en O(n) en cas de collisions extrÃªmes.",
            "de": "Python-Dictionaries sind dynamische Hashtabellen. Bei gleichmÃ¤ÃŸiger Verteilung betrÃ¤gt der Zugriff durchschnittlich O(1). Im schlechtesten Fall bei extremen Kollisionen O(n).",
            "ja": "Pythonã®è¾žæ›¸ã¯å‹•çš„ãƒãƒƒã‚·ãƒ¥ãƒ†ãƒ¼ãƒ–ãƒ«ã¨ã—ã¦å®Ÿè£…ã•ã‚Œã¦ã„ã¾ã™ã€‚ã‚­ãƒ¼ãŒå‡ä¸€ã«åˆ†æ•£ã•ã‚Œã¦ã„ã‚‹å ´åˆã€å¹³å‡ã‚¢ã‚¯ã‚»ã‚¹æ™‚é–“ã¯O(1)ã§ã™ã€‚æ¥µç«¯ãªè¡çªæ™‚ã®æœ€æ‚ªè¨ˆç®—é‡ã¯O(n)ã«ãªã‚Šã¾ã™ã€‚"
        },
        "tags": ["Python", "Dictionary", "Big-O", "Hash Table"]
    },
    {
        "id": "fc-py-3",
        "topic": "python",
        "subtopic": "Iterators & Generators",
        "difficulty": "Intermediate",
        "front_prompt": "How does a Generator (`yield`) differ from a standard function returning a list (`return`) in memory efficiency?",
        "code_snippet": "def stream_logs(filepath):\n    with open(filepath) as f:\n        for line in f:\n            yield line.strip()",
        "back_answer": "Generators produce items lazily one at a time (O(1) memory), whereas returning a list allocates memory for all elements upfront (O(N) memory).",
        "key_takeaway": "Always prefer generators for processing large datasets, streams, or infinite sequences to avoid Out-Of-Memory (OOM) errors.",
        "explanations": {
            "en": "The `yield` statement suspends execution and maintains local state, streaming values on demand. This enables processing multi-gigabyte log files without exhausting system RAM.",
            "hi": "`yield` à¤¨à¤¿à¤·à¥à¤ªà¤¾à¤¦à¤¨ à¤•à¥‹ à¤°à¥‹à¤•à¤•à¤° à¤¸à¥à¤¥à¤¿à¤¤à¤¿ à¤¬à¤¨à¤¾à¤ à¤°à¤–à¤¤à¤¾ à¤¹à¥ˆ à¤”à¤° à¤†à¤µà¤¶à¥à¤¯à¤•à¤¤à¤¾à¤¨à¥à¤¸à¤¾à¤° à¤®à¤¾à¤¨ à¤¸à¥à¤Ÿà¥à¤°à¥€à¤® à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆà¥¤ à¤‡à¤¸à¤¸à¥‡ à¤¬à¤¿à¤¨à¤¾ à¤°à¥ˆà¤® à¤­à¤°à¥‡ à¤¬à¤¡à¤¼à¥‡ à¤²à¥‰à¤— à¤¡à¥‡à¤Ÿà¤¾ à¤•à¥‹ à¤ªà¥à¤°à¥‹à¤¸à¥‡à¤¸ à¤•à¤¿à¤¯à¤¾ à¤œà¤¾ à¤¸à¤•à¤¤à¤¾ à¤¹à¥ˆà¥¤",
            "pa": "`yield` à¨•à©‹à¨¡ à¨¨à©‚à©° à¨°à©‹à¨• à¨•à©‡ à¨¸à¨¥à¨¿à¨¤à©€ à¨¯à¨¾à¨¦ à¨°à©±à¨–à¨¦à¨¾ à¨¹à©ˆ à¨…à¨¤à©‡ à¨®à©°à¨— à¨…à¨¨à©à¨¸à¨¾à¨° à¨¡à©‡à¨Ÿà¨¾ à¨­à©‡à¨œà¨¦à¨¾ à¨¹à©ˆà¥¤ à¨‡à¨¸ à¨¨à¨¾à¨² à¨°à©ˆà¨® à¨­à¨°à©‡ à¨¬à¨¿à¨¨à¨¾à¨‚ à¨µà©±à¨¡à©€à¨†à¨‚ à¨«à¨¾à¨ˆà¨²à¨¾à¨‚ à¨ªà©à¨°à©‹à¨¸à©ˆà¨¸ à¨•à©€à¨¤à©€à¨†à¨‚ à¨œà¨¾ à¨¸à¨•à¨¦à©€à¨†à¨‚ à¨¹à¨¨à¥¤",
            "es": "`yield` pausa la ejecuciÃ³n conservando el estado local y emite valores bajo demanda. Permite procesar archivos de muchos gigabytes sin agotar la memoria RAM.",
            "fr": "`yield` suspend l'exÃ©cution tout en conservant l'Ã©tat local, produisant les valeurs Ã  la demande. Cela permet de traiter d'Ã©normes fichiers sans saturer la RAM.",
            "de": "`yield` unterbricht die AusfÃ¼hrung unter Beibehaltung des Zustands und liefert Werte bedarfsgesteuert. So kÃ¶nnen riesige Datenmengen ohne RAM-Ãœberlauf verarbeitet werden.",
            "ja": "`yield`ã¯ãƒ­ãƒ¼ã‚«ãƒ«çŠ¶æ…‹ã‚’ä¿æŒã—ãŸã¾ã¾å®Ÿè¡Œã‚’ä¸€æ™‚ä¸­æ–­ã—ã€ã‚ªãƒ³ãƒ‡ãƒžãƒ³ãƒ‰ã§å€¤ã‚’ç”Ÿæˆã—ã¾ã™ã€‚ã“ã‚Œã«ã‚ˆã‚Šå¤§å®¹é‡ãƒ­ã‚°ã‚‚ãƒ¡ãƒ¢ãƒªä¸è¶³ã‚’èµ·ã“ã•ãšå‡¦ç†ã§ãã¾ã™ã€‚"
        },
        "tags": ["Python", "Generators", "Memory Optimization"]
    },

    # --- SQL & DATABASE ENGINEERING ---
    {
        "id": "fc-sql-1",
        "topic": "sql",
        "subtopic": "Transaction Safety",
        "difficulty": "Intermediate",
        "front_prompt": "What do the four properties of ACID transactions guarantee in relational database systems?",
        "code_snippet": "BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",
        "back_answer": "Atomicity (all or nothing), Consistency (valid state rules), Isolation (concurrent safety), Durability (survives crashes).",
        "key_takeaway": "ACID guarantees that financial transfers and mission-critical writes remain sound even during sudden hardware power outages.",
        "explanations": {
            "en": "Atomicity ensures operations succeed completely or rollback entirely. Consistency enforces schemas and constraints. Isolation prevents dirty/unrepeatable reads across concurrent queries. Durability writes logs to persistent disk storage (WAL).",
            "hi": "ACID à¤®à¥‡à¤‚ Atomicity (à¤¸à¤¬ à¤•à¥à¤› à¤¯à¤¾ à¤•à¥à¤› à¤¨à¤¹à¥€à¤‚), Consistency (à¤¨à¤¿à¤¯à¤®à¥‹à¤‚ à¤•à¤¾ à¤ªà¤¾à¤²à¤¨), Isolation (à¤¸à¤®à¤µà¤°à¥à¤¤à¥€ à¤¸à¥à¤°à¤•à¥à¤·à¤¾), à¤”à¤° Durability (à¤•à¥à¤°à¥ˆà¤¶ à¤•à¥‡ à¤¬à¤¾à¤¦ à¤­à¥€ à¤¡à¥‡à¤Ÿà¤¾ à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤) à¤¸à¥à¤¨à¤¿à¤¶à¥à¤šà¤¿à¤¤ à¤•à¤°à¤¤à¥€ à¤¹à¥ˆà¥¤",
            "pa": "ACID à¨²à©ˆà¨£-à¨¦à©‡à¨£ à¨¦à©€ à¨¸à¨¼à©à©±à¨§à¨¤à¨¾ à¨¬à¨£à¨¾à¨ˆ à¨°à©±à¨–à¨¦à¨¾ à¨¹à©ˆ: à¨¸à¨¾à¨°à©‡ à¨•à¨¦à¨® à¨ªà©‚à¨°à©‡ à¨¹à©‹à¨£ à¨œà¨¾à¨‚ à¨µà¨¾à¨ªà¨¸ à¨®à©à©œà¨¨, à¨‡à¨•à¨¸à¨¾à¨°à¨¤à¨¾, à¨µà©±à¨–à¨°à©‡à¨µà©‡à¨‚ à¨…à¨¤à©‡ à¨¹à¨¾à¨°à¨¡à¨µà©‡à¨…à¨° à¨•à¨°à©ˆà¨¸à¨¼ à¨¤à©‹à¨‚ à¨¬à¨¾à¨…à¨¦ à¨µà©€ à¨¡à¨¾à¨Ÿà¨¾ à¨¸à©à¨°à©±à¨–à¨¿à¨†à¥¤",
            "es": "ACID garantiza que las transacciones sean AtÃ³micas (todo o nada), Consistentes (reglas vÃ¡lidas), Aisladas (concurrencia segura) y Duraderas (permanentes en disco tras fallos).",
            "fr": "ACID garantit qu'une transaction est Atomique (tout ou rien), CohÃ©rente (rÃ¨gles respectÃ©es), IsolÃ©e (sÃ©curitÃ© concurrente) et Durable (persistance aprÃ¨s panne).",
            "de": "ACID garantiert AtomaritÃ¤t (alles oder nichts), Konsistenz (RegelkonformitÃ¤t), Isolation (nebenlÃ¤ufige Sicherheit) und Dauerhaftigkeit (Ã¼bersteht SystemabstÃ¼rze).",
            "ja": "ACIDã¯ãƒˆãƒ©ãƒ³ã‚¶ã‚¯ã‚·ãƒ§ãƒ³ã®åŽŸå­æ€§ï¼ˆå…¨ã¦å®Ÿè¡Œã‹å…¨å–æ¶ˆï¼‰ã€ä¸€è²«æ€§ï¼ˆæ•´åˆæ€§è¦å‰‡ï¼‰ã€ç‹¬ç«‹æ€§ï¼ˆä¸¦è¡Œå‡¦ç†ã®å®‰å…¨æ€§ï¼‰ã€æ°¸ç¶šæ€§ï¼ˆã‚¯ãƒ©ãƒƒã‚·ãƒ¥æ™‚ã®å¾©å…ƒï¼‰ã‚’ä¿è¨¼ã—ã¾ã™ã€‚"
        },
        "tags": ["SQL", "ACID", "Transactions", "Architecture"]
    },
    {
        "id": "fc-sql-2",
        "topic": "sql",
        "subtopic": "Query Optimization",
        "difficulty": "Advanced",
        "front_prompt": "Why are B-Tree indexes preferred over Hash indexes for general-purpose relational columns?",
        "code_snippet": "CREATE INDEX idx_orders_created ON orders (created_at);\n-- Why does B-Tree excel for: WHERE created_at BETWEEN '2026-01-01' AND '2026-03-01'?",
        "back_answer": "B-Trees keep data sorted, allowing efficient range queries (<, >, BETWEEN), ordering (ORDER BY), and equality (=) in O(log N) time.",
        "key_takeaway": "Hash indexes only support exact equality (=); B-Trees support ranges, prefixes, and sorting efficiently.",
        "explanations": {
            "en": "B-Trees store keys in self-balancing sorted pages with linked leaf nodes. This structure enables binary search for ranges and ordered scans, while hash indexes can only resolve hash equality checks.",
            "hi": "B-Tree à¤‡à¤‚à¤¡à¥‡à¤•à¥à¤¸ à¤¡à¥‡à¤Ÿà¤¾ à¤•à¥‹ à¤¸à¥‰à¤°à¥à¤Ÿ à¤•à¤°à¤•à¥‡ à¤°à¤–à¤¤à¥‡ à¤¹à¥ˆà¤‚, à¤œà¤¿à¤¸à¤¸à¥‡ à¤°à¥‡à¤‚à¤œ à¤•à¥à¤µà¥‡à¤°à¥€ (BETWEEN, <, >) à¤”à¤° à¤¸à¥‰à¤°à¥à¤Ÿà¤¿à¤‚à¤— O(log N) à¤¸à¤®à¤¯ à¤®à¥‡à¤‚ à¤•à¥à¤¶à¤² à¤¹à¥‹ à¤œà¤¾à¤¤à¥€ à¤¹à¥ˆà¥¤ à¤¹à¥ˆà¤¶ à¤‡à¤‚à¤¡à¥‡à¤•à¥à¤¸ à¤•à¥‡à¤µà¤² à¤¸à¤Ÿà¥€à¤• à¤¸à¤®à¤¾à¤¨à¤¤à¤¾ (=) à¤•à¤¾ à¤¸à¤®à¤°à¥à¤¥à¤¨ à¤•à¤°à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤",
            "pa": "B-Tree à¨‡à©°à¨¡à©ˆà¨•à¨¸ à¨¡à¨¾à¨Ÿà¨¾ à¨¨à©‚à©° à¨•à©à¨°à¨®à¨¬à©±à¨§ à¨°à©±à¨–à¨¦à©‡ à¨¹à¨¨, à¨œà¨¿à¨¸ à¨¨à¨¾à¨² à¨°à©‡à¨‚à¨œ à¨–à©‹à¨œà¨¾à¨‚ à¨…à¨¤à©‡ à¨›à¨¾à¨‚à¨Ÿà©€ à¨†à¨¸à¨¾à¨¨ à¨¹à©à©°à¨¦à©€ à¨¹à©ˆà¥¤ à¨¹à©ˆà¨¸à¨¼ à¨‡à©°à¨¡à©ˆà¨•à¨¸ à¨¸à¨¿à¨°à¨«à¨¼ à¨¬à¨°à¨¾à¨¬à¨°à¨¤à¨¾ (=) à¨¦à¨¾ à¨¸à¨®à¨°à¨¥à¨¨ à¨•à¨°à¨¦à©‡ à¨¹à¨¨à¥¤",
            "es": "Los Ã­ndices B-Tree mantienen los datos ordenados, lo que permite consultas por rango (BETWEEN, >, <) y ordenaciÃ³n eficiente en tiempo O(log N). Los Ã­ndices Hash solo admiten igualdad exacta.",
            "fr": "Les index B-Tree conservent les donnÃ©es triÃ©es, ce qui permet des recherches par intervalle (BETWEEN, >, <) et du tri en O(log N), contrairement aux index Hash limitÃ©s aux Ã©galitÃ©s strictes.",
            "de": "B-Tree-Indizes halten Daten sortiert, was Bereichsabfragen (BETWEEN, >, <) und Sortierungen in O(log N) erlaubt. Hash-Indizes unterstÃ¼tzen nur exakte Gleichheit.",
            "ja": "B-Treeã‚¤ãƒ³ãƒ‡ãƒƒã‚¯ã‚¹ã¯ãƒ‡ãƒ¼ã‚¿ã‚’ã‚½ãƒ¼ãƒˆçŠ¶æ…‹ã§ä¿æŒã™ã‚‹ãŸã‚ã€ç¯„å›²æ¤œç´¢ï¼ˆBETWEENã€>ã€<ï¼‰ã‚„ORDER BYã‚’O(log N)ã§é«˜é€Ÿå‡¦ç†ã§ãã¾ã™ã€‚ãƒãƒƒã‚·ãƒ¥ã‚¤ãƒ³ãƒ‡ãƒƒã‚¯ã‚¹ã¯å®Œå…¨ä¸€è‡´ã®ã¿å¯¾å¿œã—ã¾ã™ã€‚"
        },
        "tags": ["SQL", "Indexes", "B-Tree", "Optimization"]
    },

    # --- PYTORCH & DEEP LEARNING ---
    {
        "id": "fc-pt-1",
        "topic": "pytorch",
        "subtopic": "Autograd & Graphs",
        "difficulty": "Intermediate",
        "front_prompt": "Why must `optimizer.zero_grad()` be invoked before `loss.backward()` in a PyTorch training loop?",
        "code_snippet": "for x, y in train_loader:\n    optimizer.zero_grad()  # <-- Essential step\n    pred = model(x)\n    loss = criterion(pred, y)\n    loss.backward()\n    optimizer.step()",
        "back_answer": "PyTorch accumulates gradients in `.grad` buffers by default rather than overwriting them.",
        "key_takeaway": "Without `zero_grad()`, gradients from previous batches continuously accumulate, corrupting optimization trajectory.",
        "explanations": {
            "en": "PyTorch intentionally accumulates gradients to enable techniques like gradient accumulation over micro-batches. If not cleared, previous batch gradients add up and skew weight updates.",
            "hi": "PyTorch à¤®à¥‡à¤‚ à¤—à¥à¤°à¥‡à¤¡à¤¿à¤à¤‚à¤Ÿ à¤¡à¤¿à¤«à¤¼à¥‰à¤²à¥à¤Ÿ à¤°à¥‚à¤ª à¤¸à¥‡ à¤¬à¤«à¤° à¤®à¥‡à¤‚ à¤œà¤®à¤¾ (accumulate) à¤¹à¥‹à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤ à¤¯à¤¦à¤¿ `zero_grad()` à¤¨à¤¹à¥€à¤‚ à¤¬à¥à¤²à¤¾à¤¯à¤¾ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆ, à¤¤à¥‹ à¤ªà¤¿à¤›à¤²à¥‡ à¤¬à¥ˆà¤š à¤•à¥‡ à¤—à¥à¤°à¥‡à¤¡à¤¿à¤à¤‚à¤Ÿ à¤œà¥à¤¡à¤¼ à¤œà¤¾à¤à¤‚à¤—à¥‡ à¤”à¤° à¤®à¥‰à¤¡à¤² à¤—à¤²à¤¤ à¤¸à¥€à¤–à¥‡à¤—à¤¾à¥¤",
            "pa": "PyTorch à¨µà¨¿à©±à¨š à¨—à©à¨°à©‡à¨¡à©€à¨à¨‚à¨Ÿ à¨¬à¨«à¨° à¨µà¨¿à©±à¨š à¨œà¨®à©à¨¹à¨¾à¨‚ à¨¹à©à©°à¨¦à©‡ à¨°à¨¹à¨¿à©°à¨¦à©‡ à¨¹à¨¨à¥¤ à¨œà©‡à¨•à¨° `zero_grad()` à¨¨à¨¾ à¨šà¨²à¨¾à¨‡à¨† à¨œà¨¾à¨µà©‡, à¨¤à¨¾à¨‚ à¨ªà¨¿à¨›à¨²à©‡ à¨¬à©ˆà¨šà¨¾à¨‚ à¨¦à©‡ à¨—à©à¨°à©‡à¨¡à©€à¨à¨‚à¨Ÿ à¨œà©à©œ à¨•à©‡ à¨¨à¨¤à©€à¨œà¨¾ à¨–à¨°à¨¾à¨¬ à¨•à¨° à¨¦à©‡à¨£à¨—à©‡à¥¤",
            "es": "PyTorch acumula gradientes en los bÃºferes por defecto. Si no se llama a `zero_grad()`, los gradientes del lote anterior se suman al actual, arruinando la optimizaciÃ³n.",
            "fr": "PyTorch accumule par dÃ©faut les gradients dans les tampons. Si `zero_grad()` n'est pas appelÃ©, les gradients des lots prÃ©cÃ©dents s'additionnent, faussant la mise Ã  jour des poids.",
            "de": "PyTorch akkumuliert Gradienten standardmÃ¤ÃŸig. Ohne `zero_grad()` summieren sich die Gradienten vorheriger Batches auf, was die Gewichtsaktualisierung verfÃ¤lscht.",
            "ja": "PyTorchã¯ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆã§å‹¾é…ã‚’ç´¯ç©ã—ã¾ã™ã€‚`zero_grad()`ã‚’å‘¼ã³å‡ºã•ãªã„ã¨ã€å‰å›žã®ãƒãƒƒãƒã®å‹¾é…ãŒåŠ ç®—ã•ã‚Œç¶šã‘ã€ãƒ¢ãƒ‡ãƒ«ã®é‡ã¿æ›´æ–°ãŒä¸æ­£ã«ãªã‚Šã¾ã™ã€‚"
        },
        "tags": ["PyTorch", "Autograd", "Optimization", "Backpropagation"]
    },
    {
        "id": "fc-pt-2",
        "topic": "pytorch",
        "subtopic": "Inference Optimization",
        "difficulty": "Intermediate",
        "front_prompt": "What are the two critical commands to configure a PyTorch model for evaluation/inference, and why?",
        "code_snippet": "model.eval()  # Step 1\nwith torch.no_grad():  # Step 2\n    predictions = model(test_input)",
        "back_answer": "1. `model.eval()` disables Dropout and sets BatchNorm to inference mode.\n2. `torch.no_grad()` stops tracking autograd, slashing GPU VRAM usage and boosting speed.",
        "key_takeaway": "Always pair `model.eval()` with `torch.no_grad()` (or `torch.inference_mode()`) to prevent memory leaks and deterministic inference.",
        "explanations": {
            "en": "`model.eval()` alters layer behavior (Dropout becomes identity, BatchNorm uses running stats). `torch.no_grad()` deactivates dynamic computation graph construction, freeing significant GPU VRAM.",
            "hi": "`model.eval()` à¤¡à¥à¤°à¥‰à¤ªà¤†à¤‰à¤Ÿ à¤•à¥‹ à¤¬à¤‚à¤¦ à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆ à¤”à¤° à¤¬à¥ˆà¤š à¤¨à¥‰à¤°à¥à¤® à¤•à¥‹ à¤¸à¥à¤¥à¤¿à¤° à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆà¥¤ `torch.no_grad()` à¤‘à¤Ÿà¥‹-à¤—à¥à¤°à¥‡à¤¡ à¤Ÿà¥à¤°à¥ˆà¤•à¤¿à¤‚à¤— à¤¬à¤‚à¤¦ à¤•à¤° à¤µà¥€à¤†à¤°à¤à¤à¤® à¤¬à¤šà¤¾à¤¤à¤¾ à¤¹à¥ˆ à¤”à¤° à¤…à¤¨à¥à¤®à¤¾à¤¨ à¤¤à¥‡à¤œ à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆà¥¤",
            "pa": "`model.eval()` à¨¡à©à¨°à©Œà¨ªà¨†à¨‰à¨Ÿ à¨¨à©‚à©° à¨¬à©°à¨¦ à¨•à¨°à¨¦à¨¾ à¨¹à©ˆ à¨…à¨¤à©‡ à¨¬à©ˆà¨š-à¨¨à©‹à¨°à¨® à¨¨à©‚à©° à¨¸à¨¥à¨¿à¨° à¨•à¨°à¨¦à¨¾ à¨¹à©ˆà¥¤ `torch.no_grad()` à¨—à©à¨°à¨¾à¨« à¨Ÿà¨°à©ˆà¨•à¨¿à©°à¨— à¨¬à©°à¨¦ à¨•à¨°à¨•à©‡ à¨®à©ˆà¨®à©‹à¨°à©€ à¨¬à¨šà¨¾à¨‰à¨‚à¨¦à¨¾ à¨¹à©ˆà¥¤",
            "es": "`model.eval()` desactiva Dropout y fija las estadÃ­sticas de BatchNorm. `torch.no_grad()` desactiva el grafo computacional, ahorrando mucha memoria GPU.",
            "fr": "`model.eval()` dÃ©sactive le Dropout et fige BatchNorm. `torch.no_grad()` dÃ©sactive le graphe de calcul dynamique, rÃ©duisant l'utilisation de VRAM et accÃ©lÃ©rant l'infÃ©rence.",
            "de": "`model.eval()` deaktiviert Dropout und fixiert BatchNorm. `torch.no_grad()` stoppt die Berechnungsgraph-Erstellung, spart VRAM und beschleunigt die Inferenz.",
            "ja": "`model.eval()`ã¯Dropoutã‚’ç„¡åŠ¹åŒ–ã—BatchNormã‚’å®Ÿè¡Œçµ±è¨ˆå›ºå®šã«è¨­å®šã—ã¾ã™ã€‚`torch.no_grad()`ã¯è¨ˆç®—ã‚°ãƒ©ãƒ•æ§‹ç¯‰ã‚’åœæ­¢ã—ã¦GPUãƒ¡ãƒ¢ãƒªã‚’å¤§å¹…ã«ç¯€ç´„ã—ã¾ã™ã€‚"
        },
        "tags": ["PyTorch", "Inference", "VRAM", "Production"]
    },

    # --- MACHINE LEARNING ALGORITHMS ---
    {
        "id": "fc-ml-1",
        "topic": "ml",
        "subtopic": "Model Evaluation",
        "difficulty": "Intermediate",
        "front_prompt": "When dealing with extreme class imbalance (e.g. 99.8% negative fraud cases), why is Accuracy a dangerous metric, and what should be used instead?",
        "code_snippet": "# Predicting all 0s gives 99.8% Accuracy!\n# Yet fraud recall is 0.0%!",
        "back_answer": "A naive model predicting only the majority class achieves 99.8% accuracy while catching 0 frauds. Use PR-AUC, Precision, Recall, or F1-Score.",
        "key_takeaway": "In skewed distributions, optimize Precision (minimizing false alarms) and Recall (catching all true frauds) via PR-AUC or F-beta.",
        "explanations": {
            "en": "Accuracy measures overall correct predictions over total predictions. With high class imbalance, accuracy completely masks minority class failures. Precision-Recall AUC or F1 focuses strictly on positive detections.",
            "hi": "à¤…à¤¤à¥à¤¯à¤§à¤¿à¤• à¤…à¤¸à¤‚à¤¤à¥à¤²à¤¨ à¤®à¥‡à¤‚ à¤•à¥‡à¤µà¤² à¤¨à¤•à¤¾à¤°à¤¾à¤¤à¥à¤®à¤• à¤…à¤¨à¥à¤®à¤¾à¤¨ à¤²à¤—à¤¾à¤¨à¥‡ à¤¸à¥‡ à¤­à¥€ 99.8% à¤¸à¤Ÿà¥€à¤•à¤¤à¤¾ à¤®à¤¿à¤² à¤œà¤¾à¤¤à¥€ à¤¹à¥ˆà¥¤ à¤‡à¤¸à¤²à¤¿à¤ à¤§à¥‹à¤–à¤¾à¤§à¤¡à¤¼à¥€ à¤ªà¤•à¤¡à¤¼à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ Precision, Recall à¤”à¤° PR-AUC à¤•à¤¾ à¤‰à¤ªà¤¯à¥‹à¤— à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆà¥¤",
            "pa": "à¨…à¨¸à©°à¨¤à©à¨²à¨¿à¨¤ à¨¡à©‡à¨Ÿà¨¾ à¨µà¨¿à©±à¨š à¨¸à¨¼à©à©±à¨§à¨¤à¨¾ à¨§à©‹à¨–à¨¾ à¨¦à©‡ à¨¸à¨•à¨¦à©€ à¨¹à©ˆà¥¤ à¨‡à¨¸ à¨²à¨ˆ à¨§à©‹à¨–à¨¾à¨§à©œà©€ à¨«à©œà¨¨ à¨µà¨¾à¨¸à¨¤à©‡ Precision, Recall à¨…à¨¤à©‡ PR-AUC à¨µà¨°à¨¤à¨¿à¨† à¨œà¨¾à¨‚à¨¦à¨¾ à¨¹à©ˆà¥¤",
            "es": "La exactitud (Accuracy) es engaÃ±osa en clases desbalanceadas porque un modelo trivial que siempre predice la clase mayoritaria tendrÃ¡ alta precisiÃ³n. Usa Precision, Recall y PR-AUC.",
            "fr": "L'exactitude (Accuracy) est trompeuse avec des classes dÃ©sÃ©quilibrÃ©es. Un modÃ¨le prÃ©disant toujours la classe majoritaire affiche un score Ã©levÃ©. Utilisez Precision, Recall et PR-AUC.",
            "de": "Genauigkeit (Accuracy) ist bei unausgeglichenen Klassen irrefÃ¼hrend. Ein triviales Modell erreicht hohe Werte ohne Treffer bei Betrug. Nutzen Sie Precision, Recall und PR-AUC.",
            "ja": "æ¥µç«¯ãªä¸å‡è¡¡ãƒ‡ãƒ¼ã‚¿ã§ã¯ã€å…¨ã¦å¤šæ•°æ´¾ã¨äºˆæ¸¬ã™ã‚‹ã ã‘ã§é«˜ã„AccuracyãŒå‡ºã¾ã™ã€‚ä¸æ­£æ¤œçŸ¥ã«ã¯Precisionã€Recallã€PR-AUCã€F1ã‚¹ã‚³ã‚¢ã‚’ä½¿ç”¨ã—ã¾ã™ã€‚"
        },
        "tags": ["Machine Learning", "Metrics", "Imbalance", "Evaluation"]
    },
    {
        "id": "fc-ml-2",
        "topic": "ml",
        "subtopic": "Regularization",
        "difficulty": "Intermediate",
        "front_prompt": "How does L1 Regularization (Lasso) differ from L2 Regularization (Ridge) in feature selection?",
        "code_snippet": "L1 Loss = Loss + lambda * sum(|w|)     # Drives weights to EXACT 0\nL2 Loss = Loss + lambda * sum(w^2)      # Shrinks weights close to 0",
        "back_answer": "L1 drives non-informative feature coefficients to exact zero (sparse feature selection). L2 shrinks weights asymptotically close to zero without zeroing them out.",
        "key_takeaway": "Choose L1 (Lasso) when you have thousands of features and want automatic feature pruning; choose L2 (Ridge) when collinear features share predictive signal.",
        "explanations": {
            "en": "The diamond constraint geometry of L1 penalty forces corner intersections on axes, causing redundant weights to collapse to 0.0. The spherical contour of L2 penalizes large weights evenly without producing true zeros.",
            "hi": "L1 à¤ªà¥‡à¤¨à¤²à¥à¤Ÿà¥€ (Lasso) à¤—à¥ˆà¤°-à¤œà¤¼à¤°à¥‚à¤°à¥€ à¤µà¤¿à¤¶à¥‡à¤·à¤¤à¤¾à¤“à¤‚ à¤•à¥‡ à¤µà¤œà¤¼à¤¨ à¤•à¥‹ à¤¬à¤¿à¤²à¥à¤•à¥à¤² à¤¶à¥‚à¤¨à¥à¤¯ à¤•à¤° à¤¦à¥‡à¤¤à¥€ à¤¹à¥ˆ, à¤œà¤¿à¤¸à¤¸à¥‡ à¤¸à¥à¤µà¤šà¤¾à¤²à¤¿à¤¤ à¤«à¥€à¤šà¤° à¤šà¤¯à¤¨ à¤¹à¥‹à¤¤à¤¾ à¤¹à¥ˆà¥¤ L2 (Ridge) à¤µà¤œà¤¼à¤¨ à¤•à¥‹ à¤›à¥‹à¤Ÿà¤¾ à¤•à¤°à¤¤à¥€ à¤¹à¥ˆ à¤²à¥‡à¤•à¤¿à¤¨ à¤¶à¥‚à¤¨à¥à¤¯ à¤¨à¤¹à¥€à¤‚ à¤•à¤°à¤¤à¥€à¥¤",
            "pa": "L1 (Lasso) à¨¬à©‡à¨²à©‹à©œà©€à¨†à¨‚ à¨µà¨¿à¨¸à¨¼à©‡à¨¸à¨¼à¨¤à¨¾à¨µà¨¾à¨‚ à¨¦à©‡ à¨­à¨¾à¨° à¨¨à©‚à©° à¨¬à¨¿à¨²à¨•à©à¨² à¨œà¨¼à©€à¨°à©‹ à¨•à¨° à¨¦à¨¿à©°à¨¦à¨¾ à¨¹à©ˆà¥¤ L2 (Ridge) à¨­à¨¾à¨° à¨˜à¨Ÿà¨¾à¨‰à¨‚à¨¦à¨¾ à¨¹à©ˆ à¨ªà¨° à¨ªà©‚à¨°à©€ à¨¤à¨°à©à¨¹à¨¾à¨‚ à¨œà¨¼à©€à¨°à©‹ à¨¨à¨¹à©€à¨‚ à¨•à¨°à¨¦à¨¾à¥¤",
            "es": "L1 (Lasso) anula a cero los coeficientes irrelevantes generando selecciÃ³n dispersa de variables. L2 (Ridge) reduce los pesos suavemente sin llevarlos exactamente a cero.",
            "fr": "L1 (Lasso) force les coefficients inutiles Ã  zÃ©ro (sÃ©lection de variables). L2 (Ridge) rÃ©duit uniformÃ©ment l'amplitude des poids sans les annuler totalement.",
            "de": "L1 (Lasso) setzt irrelevante Koeffizienten exakt auf Null (automatische Feature-Auswahl). L2 (Ridge) verkleinert Gewichte kontinuierlich, ohne sie ganz zu nullen.",
            "ja": "L1ï¼ˆLassoï¼‰ã¯ä¸è¦ãªç‰¹å¾´é‡ã®é‡ã¿ã‚’åŽ³å¯†ã«ã‚¼ãƒ­ã«ã—ã¦ã‚¹ãƒ‘ãƒ¼ã‚¹ãªç‰¹å¾´é‡é¸æŠžã‚’è¡Œã„ã¾ã™ã€‚L2ï¼ˆRidgeï¼‰ã¯é‡ã¿ã‚’å…¨ä½“çš„ã«ç¸®å°ã—ã¾ã™ãŒå®Œå…¨ãªã‚¼ãƒ­ã«ã¯ã—ã¾ã›ã‚“ã€‚"
        },
        "tags": ["Machine Learning", "Regularization", "Lasso", "Ridge"]
    },

    # --- FASTAPI & MICROSERVICES ---
    {
        "id": "fc-fa-1",
        "topic": "fastapi",
        "subtopic": "Dependency Injection",
        "difficulty": "Intermediate",
        "front_prompt": "What advantages does FastAPI's `Depends` dependency injection system provide over manual object creation?",
        "code_snippet": "async def get_db():\n    async with AsyncSessionLocal() as session:\n        yield session\n\n@app.get('/users')\nasync def list_users(db: AsyncSession = Depends(get_db)): ...",
        "back_answer": "Automatic resource lifecycles (open/close sessions), parameter deduplication, effortless mockability for unit tests, and hierarchical security enforcement.",
        "key_takeaway": "Use `Depends` with generators (`yield`) so database transactions, locks, and network sessions automatically clean up after HTTP responses finish.",
        "explanations": {
            "en": "FastAPI's dependency injection resolves execution order, caches dependencies per request, automatically invokes teardown logic after yielding, and allows overriding dependencies during automated testing with `app.dependency_overrides`.",
            "hi": "FastAPI à¤•à¤¾ `Depends` à¤¸à¥à¤µà¤šà¤¾à¤²à¤¿à¤¤ à¤°à¥‚à¤ª à¤¸à¥‡ à¤¡à¥‡à¤Ÿà¤¾à¤¬à¥‡à¤¸ à¤¸à¥‡à¤¶à¤¨ à¤–à¥‹à¤²à¤¤à¤¾ à¤”à¤° à¤¬à¤‚à¤¦ à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆ, à¤ªà¥à¤°à¤¤à¤¿ à¤…à¤¨à¥à¤°à¥‹à¤§ à¤•à¥ˆà¤¶à¤¿à¤‚à¤— à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆ, à¤”à¤° à¤¯à¥‚à¤¨à¤¿à¤Ÿ à¤ªà¤°à¥€à¤•à¥à¤·à¤£à¥‹à¤‚ à¤®à¥‡à¤‚ à¤¡à¥‡à¤Ÿà¤¾à¤¬à¥‡à¤¸ à¤•à¥‹ à¤®à¥‰à¤• à¤•à¤°à¤¨à¤¾ à¤¬à¥‡à¤¹à¤¦ à¤†à¤¸à¤¾à¤¨ à¤¬à¤¨à¤¾à¤¤à¤¾ à¤¹à¥ˆà¥¤",
            "pa": "FastAPI à¨¦à¨¾ `Depends` à¨¸à¨°à©‹à¨¤à¨¾à¨‚ à¨¦à¨¾ à¨œà©€à¨µà¨¨ à¨šà©±à¨•à¨° à¨¸à©°à¨­à¨¾à¨²à¨¦à¨¾ à¨¹à©ˆ, à¨¸à©ˆà¨¸à¨¼à¨¨ à¨–à©‹à¨²à©à¨¹à¨¦à¨¾ à¨¤à©‡ à¨¬à©°à¨¦ à¨•à¨°à¨¦à¨¾ à¨¹à©ˆ à¨…à¨¤à©‡ à¨Ÿà©ˆà¨¸à¨Ÿà¨¿à©°à¨— à¨µà¨¿à©±à¨š à¨†à¨¸à¨¾à¨¨à©€ à¨ªà©à¨°à¨¦à¨¾à¨¨ à¨•à¨°à¨¦à¨¾ à¨¹à©ˆà¥¤",
            "es": "El sistema `Depends` de FastAPI gestiona el ciclo de vida de recursos (cierra sesiones tras `yield`), deduce parÃ¡metros y permite sustituir dependencias fÃ¡cilmente en tests.",
            "fr": "Le systÃ¨me `Depends` de FastAPI gÃ¨re le cycle de vie des ressources (fermeture de sessions aprÃ¨s `yield`), Ã©vite les doublons et permet de mocker facilement les dÃ©pendances dans les tests.",
            "de": "FastAPIs `Depends` regelt den Lebenszyklus von Ressourcen (SchlieÃŸen von Sessions nach `yield`), verhindert Duplikate und erleichtert das Mocking in Unit-Tests.",
            "ja": "FastAPIã®`Depends`ã¯ãƒªã‚½ãƒ¼ã‚¹ã®ãƒ©ã‚¤ãƒ•ã‚µã‚¤ã‚¯ãƒ«ç®¡ç†ï¼ˆ`yield`å¾Œã®è‡ªå‹•ã‚¯ãƒ­ãƒ¼ã‚ºï¼‰ã€ãƒªã‚¯ã‚¨ã‚¹ãƒˆæ¯Žã®ä¾å­˜é–¢ä¿‚è§£æ±ºã€ãƒ†ã‚¹ãƒˆæ™‚ã®ãƒ¢ãƒƒã‚¯å·®ã—æ›¿ãˆã‚’å®¹æ˜“ã«ã—ã¾ã™ã€‚"
        },
        "tags": ["FastAPI", "Dependency Injection", "Architecture", "Testing"]
    },

    # --- DOCKER & CLOUD DEVOPS ---
    {
        "id": "fc-dk-1",
        "topic": "docker",
        "subtopic": "Layer Optimization",
        "difficulty": "Intermediate",
        "front_prompt": "Why should `COPY requirements.txt .` and `pip install` be placed before `COPY . .` in a production Dockerfile?",
        "code_snippet": "# Optimized Dockerfile pattern:\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .  # <-- Application source code placed last",
        "back_answer": "To maximize Docker's layer cache! Python dependencies rarely change, while source code changes constantly.",
        "key_takeaway": "Order Dockerfile instructions from least-frequently-changing to most-frequently-changing to achieve sub-second rebuilds.",
        "explanations": {
            "en": "Docker caches each build step. If application code is copied before `pip install`, any one-line code edit invalidates the cache for all subsequent steps, forcing a slow re-download of all pip packages on every build.",
            "hi": "Docker à¤¹à¤° à¤šà¤°à¤£ à¤•à¥‹ à¤•à¥ˆà¤¶ à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆà¥¤ à¤¯à¤¦à¤¿ à¤•à¥‹à¤¡ à¤ªà¤¹à¤²à¥‡ à¤•à¥‰à¤ªà¥€ à¤•à¤¿à¤¯à¤¾ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆ, à¤¤à¥‹ à¤•à¤¿à¤¸à¥€ à¤­à¥€ à¤›à¥‹à¤Ÿà¥‡ à¤¬à¤¦à¤²à¤¾à¤µ à¤ªà¤° Docker à¤•à¥‹ à¤«à¤¿à¤° à¤¸à¥‡ à¤¸à¤­à¥€ à¤²à¤¾à¤‡à¤¬à¥à¤°à¥‡à¤°à¥€ à¤¡à¤¾à¤‰à¤¨à¤²à¥‹à¤¡ à¤•à¤°à¤¨à¥€ à¤ªà¤¡à¤¼à¥‡à¤—à¥€à¥¤ à¤†à¤µà¤¶à¥à¤¯à¤•à¤¤à¤¾ à¤«à¤¾à¤‡à¤²à¥‡à¤‚ à¤ªà¤¹à¤²à¥‡ à¤°à¤–à¤¨à¥‡ à¤¸à¥‡ à¤¸à¤®à¤¯ à¤¬à¤šà¤¤à¤¾ à¤¹à¥ˆà¥¤",
            "pa": "Docker à¨¹à¨° à¨•à¨¦à¨® à¨¨à©‚à©° à¨•à©ˆà¨¸à¨¼à©‡ à¨µà¨¿à©±à¨š à¨°à©±à¨–à¨¦à¨¾ à¨¹à©ˆà¥¤ à¨œà©‡à¨•à¨° à¨•à©‹à¨¡ à¨ªà¨¹à¨¿à¨²à¨¾à¨‚ à¨•à¨¾à¨ªà©€ à¨•à©€à¨¤à¨¾ à¨œà¨¾à¨µà©‡, à¨¤à¨¾à¨‚ à¨¹à¨° à¨›à©‹à¨Ÿà©‡ à¨¬à¨¦à¨²à¨¾à¨… 'à¨¤à©‡ à¨¸à¨¾à¨°à©€à¨†à¨‚ à¨²à¨¾à¨‡à¨¬à©à¨°à©‡à¨°à©€à¨†à¨‚ à¨¦à©à¨¬à¨¾à¨°à¨¾ à¨¡à¨¾à¨Šà¨¨à¨²à©‹à¨¡ à¨¹à©‹à¨£à¨—à©€à¨†à¨‚à¥¤",
            "es": "Docker almacena en cachÃ© cada capa. Si copias el cÃ³digo antes de `pip install`, cualquier cambio invalida la cachÃ© y obliga a descargar e instalar todas las dependencias de nuevo.",
            "fr": "Docker met en cache chaque couche. Copier le code avant `pip install` invalide le cache Ã  chaque modification, forÃ§ant la rÃ©installation complÃ¨te de tous les paquets pip.",
            "de": "Docker nutzt Layer-Caching. Wird der Code vor `pip install` kopiert, fÃ¼hrt jede Code-Ã„nderung zum Neuinstallieren aller Pakete. Das Voranstellen spart extrem viel Build-Zeit.",
            "ja": "Dockerã¯å„ãƒ¬ã‚¤ãƒ¤ãƒ¼ã‚’ã‚­ãƒ£ãƒƒã‚·ãƒ¥ã—ã¾ã™ã€‚ã‚³ãƒ¼ãƒ‰ã‚’å…ˆã«ã‚³ãƒ”ãƒ¼ã™ã‚‹ã¨ã€1è¡Œã®ä¿®æ­£ã§ã‚‚ã‚­ãƒ£ãƒƒã‚·ãƒ¥ãŒç„¡åŠ¹ã«ãªã‚Šã€æ¯Žå›žæ™‚é–“ã®ã‹ã‹ã‚‹ãƒ©ã‚¤ãƒ–ãƒ©ãƒªã®å†ã‚¤ãƒ³ã‚¹ãƒˆãƒ¼ãƒ«ãŒç™ºç”Ÿã—ã¾ã™ã€‚"
        },
        "tags": ["Docker", "CI/CD", "Caching", "Performance"]
    }
];

export const SELF_ASSESSMENT_QUIZ_BANK = [
    {
        "id": "q-py-1",
        "topic": "python",
        "difficulty": "Intermediate",
        "title": "Python Mutable Default Argument Pitfall",
        "question": "What is the exact output of running this Python script?",
        "code_snippet": "def append_to(element, target_list=[]):\n    target_list.append(element)\n    return target_list\n\nprint(append_to(1))\nprint(append_to(2))",
        "options": [
            "[1] then [2]",
            "[1] then [1, 2]",
            "Throws a TypeError: unhashable type",
            "[1] then []"
        ],
        "correct_answer": "[1] then [1, 2]",
        "hint": "Default arguments in Python functions are evaluated once at function definition time, not on each invocation.",
        "explanations": {
            "en": "Python evaluates default parameter expressions once when the function is defined. The list `[]` is instantiated once and reused across all subsequent calls, causing mutated state to persist.",
            "hi": "à¤ªà¤¾à¤¯à¤¥à¤¨ à¤®à¥‡à¤‚ à¤¡à¤¿à¤«à¤¼à¥‰à¤²à¥à¤Ÿ à¤¤à¤°à¥à¤• à¤«à¤¼à¤‚à¤•à¥à¤¶à¤¨ à¤ªà¤°à¤¿à¤­à¤¾à¤·à¤¾ à¤•à¥‡ à¤¸à¤®à¤¯ à¤•à¥‡à¤µà¤² à¤à¤• à¤¬à¤¾à¤° à¤¬à¤¨à¤¾à¤ à¤œà¤¾à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤ à¤µà¤¹à¥€ à¤¸à¥‚à¤šà¥€ à¤¹à¤° à¤•à¥‰à¤² à¤®à¥‡à¤‚ à¤ªà¥à¤¨: à¤‰à¤ªà¤¯à¥‹à¤— à¤•à¥€ à¤œà¤¾à¤¤à¥€ à¤¹à¥ˆ, à¤‡à¤¸à¤²à¤¿à¤ `[1, 2]` à¤ªà¥à¤°à¤¿à¤‚à¤Ÿ à¤¹à¥‹à¤¤à¤¾ à¤¹à¥ˆà¥¤ à¤¸à¤¹à¥€ à¤¤à¤°à¥€à¤•à¤¾ `target_list=null` à¤•à¤¾ à¤‰à¤ªà¤¯à¥‹à¤— à¤•à¤°à¤¨à¤¾ à¤¹à¥ˆà¥¤",
            "pa": "à¨ªà¨¾à¨ˆà¨¥à¨¨ à¨µà¨¿à©±à¨š à¨¡à¨¿à¨«à¨¾à¨²à¨Ÿ à¨†à¨°à¨—à©‚à¨®à©ˆà¨‚à¨Ÿ à¨¸à¨¿à¨°à¨«à¨¼ à¨‡à©±à¨• à¨µà¨¾à¨° à¨«à©°à¨•à¨¸à¨¼à¨¨ à¨ªà¨°à¨¿à¨­à¨¾à¨¸à¨¼à¨¿à¨¤ à¨•à¨°à¨¦à©‡ à¨¸à¨®à©‡à¨‚ à¨¬à¨£à¨¦à©‡ à¨¹à¨¨à¥¤ à¨‰à¨¹à©€ à¨¸à©‚à¨šà©€ à¨¬à¨¾à¨°-à¨¬à¨¾à¨° à¨µà¨°à¨¤à©€ à¨œà¨¾à¨‚à¨¦à©€ à¨¹à©ˆ, à¨œà¨¿à¨¸ à¨•à¨¾à¨°à¨¨ `[1, 2]` à¨¬à¨£à¨¦à¨¾ à¨¹à©ˆà¥¤",
            "es": "Los argumentos por defecto en Python se evalÃºan solo una vez en el momento de la definiciÃ³n. La lista mutada se comparte entre llamadas sucesivas, produciendo `[1, 2]`.",
            "fr": "Les arguments par dÃ©faut en Python sont Ã©valuÃ©s une seule fois Ã  la dÃ©finition de la fonction. La mÃªme liste mutable est rÃ©utilisÃ©e d'un appel Ã  l'autre, affichant `[1, 2]`.",
            "de": "Standardargumente werden in Python einmalig bei der Funktionsdefinition ausgewertet. Die mutierbare Liste wird geteilt, sodass der zweite Aufruf `[1, 2]` liefert.",
            "ja": "Pythonã®ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆå¼•æ•°ã¯é–¢æ•°å®šç¾©æ™‚ã«ä¸€åº¦ã ã‘è©•ä¾¡ã•ã‚Œã¾ã™ã€‚åŒä¸€ã®ãƒŸãƒ¥ãƒ¼ã‚¿ãƒ–ãƒ«ãªãƒªã‚¹ãƒˆãŒå…¨å‘¼ã³å‡ºã—ã§å…±æœ‰ã•ã‚Œã‚‹ãŸã‚ã€å‡ºåŠ›ã¯`[1, 2]`ã«ãªã‚Šã¾ã™ã€‚"
        }
    },
    {
        "id": "q-sql-1",
        "topic": "sql",
        "difficulty": "Intermediate",
        "title": "SQL Aggregate Filtering with WHERE vs HAVING",
        "question": "Which SQL query correctly identifies all departments that employ more than 5 engineers with a salary greater than $80,000?",
        "code_snippet": null,
        "options": [
            "SELECT dept_id, COUNT(*) FROM engineers WHERE salary > 80000 GROUP BY dept_id HAVING COUNT(*) > 5;",
            "SELECT dept_id, COUNT(*) FROM engineers HAVING salary > 80000 GROUP BY dept_id WHERE COUNT(*) > 5;",
            "SELECT dept_id, COUNT(*) FROM engineers WHERE salary > 80000 AND COUNT(*) > 5 GROUP BY dept_id;",
            "SELECT dept_id FROM engineers GROUP BY dept_id WHERE salary > 80000 HAVING COUNT(*) > 5;"
        ],
        "correct_answer": "SELECT dept_id, COUNT(*) FROM engineers WHERE salary > 80000 GROUP BY dept_id HAVING COUNT(*) > 5;",
        "hint": "`WHERE` filters individual rows before grouping; `HAVING` filters aggregated groups.",
        "explanations": {
            "en": "In SQL logical processing order, `WHERE` evaluates row-level predicates before aggregation (`salary > 80000`). `GROUP BY` aggregates the remaining rows, and `HAVING` filters the resulting groups on aggregate values (`COUNT(*) > 5`).",
            "hi": "SQL à¤®à¥‡à¤‚ `WHERE` à¤—à¥à¤°à¥à¤ªà¤¿à¤‚à¤— à¤¸à¥‡ à¤ªà¤¹à¤²à¥‡ à¤…à¤²à¤—-à¤…à¤²à¤— à¤ªà¤‚à¤•à¥à¤¤à¤¿à¤¯à¥‹à¤‚ à¤•à¥‹ à¤«à¤¼à¤¿à¤²à¥à¤Ÿà¤° à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆ, à¤œà¤¬à¤•à¤¿ `HAVING` à¤—à¥à¤°à¥à¤ªà¤¿à¤‚à¤— à¤•à¥‡ à¤¬à¤¾à¤¦ à¤à¤—à¥à¤°à¥€à¤—à¥‡à¤Ÿ à¤—à¤£à¤¨à¤¾ (`COUNT(*) > 5`) à¤•à¥‹ à¤«à¤¼à¤¿à¤²à¥à¤Ÿà¤° à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆà¥¤",
            "pa": "`WHERE` à¨—à¨°à©à©±à¨ª à¨¬à¨£à¨¾à¨‰à¨£ à¨¤à©‹à¨‚ à¨ªà¨¹à¨¿à¨²à¨¾à¨‚ à¨²à¨¾à¨ˆà¨¨à¨¾à¨‚ à¨¨à©‚à©° à¨«à¨¿à¨²à¨Ÿà¨° à¨•à¨°à¨¦à¨¾ à¨¹à©ˆ, à¨œà¨¦à©‹à¨‚ à¨•à¨¿ `HAVING` à¨—à¨°à©à©±à¨ª à¨¬à¨£à¨¨ à¨¤à©‹à¨‚ à¨¬à¨¾à¨…à¨¦ à¨¨à¨¤à©€à¨œà¨¿à¨†à¨‚ à¨¦à©€ à¨—à¨¿à¨£à¨¤à©€ à¨«à¨¿à¨²à¨Ÿà¨° à¨•à¨°à¨¦à¨¾ à¨¹à©ˆà¥¤",
            "es": "`WHERE` filtra filas individuales antes de agrupar (`salary > 80000`). `GROUP BY` crea los grupos y `HAVING` filtra las funciones agregadas (`COUNT(*) > 5`).",
            "fr": "`WHERE` filtre les lignes individuelles avant le regroupement. `GROUP BY` forme les groupes et `HAVING` filtre le rÃ©sultat agrÃ©gÃ© (`COUNT(*) > 5`).",
            "de": "`WHERE` filtert Zeilen vor der Gruppierung (`salary > 80000`). `GROUP BY` fasst zusammen und `HAVING` filtert aggregierte Gruppen (`COUNT(*) > 5`).",
            "ja": "`WHERE`å¥ã¯é›†è¨ˆå‰ã«å€‹åˆ¥è¡Œï¼ˆçµ¦ä¸Ž8ä¸‡è¶…ï¼‰ã‚’ãƒ•ã‚£ãƒ«ã‚¿ã—ã€`GROUP BY`ã§é›†è¨ˆå¾Œã€`HAVING`å¥ã§é›†è¨ˆçµæžœï¼ˆæ‰€å±ž5åè¶…ï¼‰ã‚’çµžã‚Šè¾¼ã¿ã¾ã™ã€‚"
        }
    },
    {
        "id": "q-pt-1",
        "topic": "pytorch",
        "difficulty": "Advanced",
        "title": "PyTorch Tensor In-Place Operations & Autograd",
        "question": "What error or behavior occurs when performing in-place modification (e.g. `x.add_()`) on a tensor needed for backpropagation in PyTorch?",
        "code_snippet": "x = torch.tensor([2.0], requires_grad=true)\ny = x ** 2\nx.add_(1.0)  # In-place mutation!\ny.backward()",
        "back_answer": "RuntimeError: one of the variables needed for gradient computation has been modified by an inplace operation.",
        "options": [
            "RuntimeError: one of the variables needed for gradient computation has been modified by an inplace operation",
            "Silent calculation of wrong gradients with no error",
            "Segmentation fault in CUDA backend",
            "Automatic memory clone with normal backpropagation"
        ],
        "correct_answer": "RuntimeError: one of the variables needed for gradient computation has been modified by an inplace operation",
        "hint": "PyTorch saves input tensors required to compute derivatives; mutating them in-place invalidates the mathematical gradient formula.",
        "explanations": {
            "en": "To compute dy/dx = 2*x, PyTorch autograd saves the forward-pass value of `x`. Because `x.add_()` mutates that memory buffer in-place, the original value is lost, causing PyTorch's version-counter check to raise a RuntimeError.",
            "hi": "à¤—à¥à¤°à¥‡à¤¡à¤¿à¤à¤‚à¤Ÿ à¤•à¥€ à¤—à¤£à¤¨à¤¾ à¤•à¥‡ à¤²à¤¿à¤ PyTorch à¤•à¥‹ `x` à¤•à¥‡ à¤®à¥‚à¤² à¤®à¤¾à¤¨ à¤•à¥€ à¤†à¤µà¤¶à¥à¤¯à¤•à¤¤à¤¾ à¤¹à¥‹à¤¤à¥€ à¤¹à¥ˆà¥¤ à¤œà¤¬ à¤‡à¤¨-à¤ªà¥à¤²à¥‡à¤¸ à¤‘à¤ªà¤°à¥‡à¤¶à¤¨ (`add_()`) à¤®à¥‡à¤®à¥‹à¤°à¥€ à¤•à¥‹ à¤¬à¤¦à¤² à¤¦à¥‡à¤¤à¤¾ à¤¹à¥ˆ, à¤¤à¥‹ PyTorch à¤¸à¥à¤°à¤•à¥à¤·à¤¾ à¤•à¥‡ à¤²à¤¿à¤ RuntimeError à¤‰à¤ à¤¾à¤¤à¤¾ à¤¹à¥ˆà¥¤",
            "pa": "à¨—à©à¨°à©‡à¨¡à©€à¨à¨‚à¨Ÿ à¨—à¨£à¨¨à¨¾ à¨²à¨ˆ à¨…à¨¸à¨² à¨®à©à©±à¨² à¨œà¨¼à¨°à©‚à¨°à©€ à¨¹à©à©°à¨¦à¨¾ à¨¹à©ˆà¥¤ à¨‡à¨¨-à¨ªà¨²à©‡à¨¸ à¨¬à¨¦à¨²à¨¾à¨… à¨®à©ˆà¨®à©‹à¨°à©€ à¨–à¨°à¨¾à¨¬ à¨•à¨° à¨¦à¨¿à©°à¨¦à¨¾ à¨¹à©ˆ, à¨‡à¨¸ à¨²à¨ˆ PyTorch à¨‡à©±à¨• RuntimeError à¨¦à¨¿à©°à¨¦à¨¾ à¨¹à©ˆà¥¤",
            "es": "Para calcular el gradiente, PyTorch necesita el valor original de `x`. La mutaciÃ³n in-situ invalida el bÃºfer, activando el contador de versiones y lanzando un RuntimeError.",
            "fr": "Pour calculer la dÃ©rivÃ©e, PyTorch conserve la valeur initiale de `x`. La modification in-place dÃ©truit cette valeur et dÃ©clenche une RuntimeError via le compteur de version.",
            "de": "PyTorch benÃ¶tigt den Originalwert von `x` fÃ¼r den Gradienten. Die In-Place-Operation zerstÃ¶rt den Puffer, was zu einem geschÃ¼tzten RuntimeError fÃ¼hrt.",
            "ja": "å‹¾é…è¨ˆç®—ã«ã¯é †ä¼æ’­æ™‚ã®`x`ã®å€¤ãŒå¿…è¦ã§ã™ã€‚ã‚¤ãƒ³ãƒ—ãƒ¬ãƒ¼ã‚¹æ“ä½œï¼ˆ`add_`ï¼‰ã§ãƒ¡ãƒ¢ãƒªãŒä¸Šæ›¸ãã•ã‚Œã‚‹ã¨å€¤ãŒå¤±ã‚ã‚Œã€PyTorchã¯å®‰å…¨ã®ãŸã‚RuntimeErrorã‚’ç™ºç”Ÿã•ã›ã¾ã™ã€‚"
        }
    },
    {
        "id": "q-ml-1",
        "topic": "ml",
        "difficulty": "Intermediate",
        "title": "Data Leakage Prevention in Preprocessing Pipelines",
        "question": "Why must feature scaling (such as `StandardScaler`) be fitted ONLY on the training split rather than on the entire dataset prior to splitting?",
        "code_snippet": "# Flawed approach:\nscaler.fit(X_all)  # <-- Why is this data leakage?\nX_train = scaler.transform(X_train)\nX_test = scaler.transform(X_test)",
        "options": [
            "Fitting on the whole dataset leaks statistical properties (mean & variance) of test data into the training process",
            "It slows down model inference time by 2x",
            "StandardScaler produces NaN values when applied before splitting",
            "Scikit-learn raises an UnfittedEstimatorException"
        ],
        "correct_answer": "Fitting on the whole dataset leaks statistical properties (mean & variance) of test data into the training process",
        "hint": "The test set must simulate completely unseen real-world data.",
        "explanations": {
            "en": "Fitting a scaler on the entire dataset incorporates the mean and variance of the test set into training data scaling. This yields over-optimistic evaluation metrics that fail to reflect real-world generalization.",
            "hi": "à¤ªà¥‚à¤°à¥‡ à¤¡à¥‡à¤Ÿà¤¾à¤¸à¥‡à¤Ÿ à¤ªà¤° à¤¸à¥à¤•à¥‡à¤²à¤° à¤«à¤¿à¤Ÿ à¤•à¤°à¤¨à¥‡ à¤¸à¥‡ à¤Ÿà¥‡à¤¸à¥à¤Ÿ à¤¡à¥‡à¤Ÿà¤¾ à¤•à¥‡ à¤†à¤‚à¤•à¤¡à¤¼à¥‡ (à¤®à¥€à¤¨ à¤”à¤° à¤µà¥‡à¤°à¤¿à¤¯à¤‚à¤¸) à¤Ÿà¥à¤°à¥‡à¤¨à¤¿à¤‚à¤— à¤®à¥‡à¤‚ à¤²à¥€à¤• à¤¹à¥‹ à¤œà¤¾à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤ à¤‡à¤¸à¤¸à¥‡ à¤®à¥‰à¤¡à¤² à¤•à¤¾ à¤ªà¥à¤°à¤¦à¤°à¥à¤¶à¤¨ à¤•à¤¾à¤—à¤œà¤¼ à¤ªà¤° à¤…à¤šà¥à¤›à¤¾ à¤¦à¤¿à¤–à¤¤à¤¾ à¤¹à¥ˆ à¤²à¥‡à¤•à¤¿à¤¨ à¤…à¤¸à¤²à¥€ à¤¦à¥à¤¨à¤¿à¤¯à¤¾ à¤®à¥‡à¤‚ à¤«à¥‡à¤² à¤¹à¥‹ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆà¥¤",
            "pa": "à¨ªà©‚à¨°à©‡ à¨¡à©‡à¨Ÿà¨¾ 'à¨¤à©‡ à¨¸à¨•à©‡à¨²à¨° à¨²à¨—à¨¾à¨‰à¨£ à¨¨à¨¾à¨² à¨Ÿà©ˆà¨¸à¨Ÿ à¨¡à©‡à¨Ÿà¨¾ à¨¦à©€ à¨œà¨¾à¨£à¨•à¨¾à¨°à©€ à¨Ÿà©à¨°à©‡à¨¨à¨¿à©°à¨— à¨µà¨¿à©±à¨š à¨²à©€à¨• à¨¹à©‹ à¨œà¨¾à¨‚à¨¦à©€ à¨¹à©ˆ, à¨œà¨¿à¨¸ à¨¨à¨¾à¨² à¨®à¨¾à¨¡à¨² à¨…à¨¸à¨²à©€ à¨¦à©à¨¨à©€à¨† à¨µà¨¿à©±à¨š à¨¸à¨¹à©€ à¨•à©°à¨® à¨¨à¨¹à©€à¨‚ à¨•à¨°à¨¦à¨¾à¥¤",
            "es": "Ajustar el escalador en todo el conjunto filtra la media y desviaciÃ³n del conjunto de prueba en el entrenamiento (data leakage), inflando falsamente el rendimiento real del modelo.",
            "fr": "Ajuster le scaler sur l'ensemble complet fait fuiter les statistiques (moyenne/variance) des donnÃ©es de test dans l'entraÃ®nement, faussant les mÃ©triques d'Ã©valuation rÃ©elles.",
            "de": "Das Fitten des Skalierers auf den gesamten Datensatz leckt Mittelwert und Varianz der Testdaten in das Training (Data Leakage), was zu unrealistisch guten Testergebnissen fÃ¼hrt.",
            "ja": "å…¨ä½“ãƒ‡ãƒ¼ã‚¿ã§ã‚¹ã‚±ãƒ¼ãƒ©ãƒ¼ã‚’fitã•ã›ã‚‹ã¨ã€ãƒ†ã‚¹ãƒˆãƒ‡ãƒ¼ã‚¿ã®çµ±è¨ˆæƒ…å ±ï¼ˆå¹³å‡ã‚„åˆ†æ•£ï¼‰ãŒå­¦ç¿’ã«æ¼æ´©ï¼ˆãƒ‡ãƒ¼ã‚¿ãƒªãƒ¼ã‚¯ï¼‰ã—ã€éŽåº¦ã«æ¥½è¦³çš„ãªè©•ä¾¡çµæžœã«ãªã£ã¦ã—ã¾ã„ã¾ã™ã€‚"
        }
    },
    {
        "id": "q-fa-1",
        "topic": "fastapi",
        "difficulty": "Intermediate",
        "title": "Asynchronous Endpoints vs Blocking Synchronous Calls",
        "question": "What severe performance bottleneck occurs when calling a synchronous blocking function (e.g. `time.sleep(5)`) inside an `async def` FastAPI endpoint?",
        "code_snippet": "@app.get('/slow')\nasync def slow_endpoint():\n    time.sleep(5)  # Blocking standard sleep\n    return {'status': 'done'}",
        "options": [
            "It blocks the entire main asyncio event loop, preventing all concurrent requests from being handled",
            "FastAPI automatically offloads `time.sleep` to a worker thread pool",
            "The request times out immediately with HTTP 408",
            "It triggers a database deadlock"
        ],
        "correct_answer": "It blocks the entire main asyncio event loop, preventing all concurrent requests from being handled",
        "hint": "In an `async def` endpoint, blocking code stalls the single thread executing the event loop. Use `asyncio.sleep()` or define as standard `def`.",
        "explanations": {
            "en": "In FastAPI, `async def` functions run directly on the main single-threaded event loop. A blocking call like `time.sleep` halts the entire event loop, freezing all simultaneous user requests. Use `asyncio.sleep` or standard `def` which FastAPI offloads to an external threadpool.",
            "hi": "FastAPI à¤®à¥‡à¤‚ `async def` à¤®à¥à¤–à¥à¤¯ à¤‡à¤µà¥‡à¤‚à¤Ÿ à¤²à¥‚à¤ª à¤ªà¤° à¤šà¤²à¤¤à¤¾ à¤¹à¥ˆà¥¤ à¤¯à¤¦à¤¿ à¤‡à¤¸à¤®à¥‡à¤‚ `time.sleep()` à¤œà¥ˆà¤¸à¤¾ à¤¬à¥à¤²à¥‰à¤•à¤¿à¤‚à¤— à¤•à¥‹à¤¡ à¤²à¤¿à¤–à¤¾ à¤œà¤¾à¤, à¤¤à¥‹ à¤ªà¥‚à¤°à¤¾ à¤¸à¤°à¥à¤µà¤° à¤«à¥à¤°à¥€à¤œ à¤¹à¥‹ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆ à¤”à¤° à¤¬à¤¾à¤•à¥€ à¤¯à¥‚à¤œà¤¼à¤°à¥à¤¸ à¤•à¥‡ à¤…à¤¨à¥à¤°à¥‹à¤§ à¤°à¥à¤• à¤œà¤¾à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤",
            "pa": "`async def` à¨®à©à©±à¨– à¨‡à¨µà©ˆà¨‚à¨Ÿ à¨²à©‚à¨ª 'à¨¤à©‡ à¨šà¨²à¨¦à¨¾ à¨¹à©ˆà¥¤ `time.sleep()` à¨µà¨°à¨—à©‡ à¨¬à¨²à¨¾à¨•à¨¿à©°à¨— à¨«à©°à¨•à¨¸à¨¼à¨¨ à¨ªà©‚à¨°à©‡ à¨¸à¨°à¨µà¨° à¨¨à©‚à©° à¨°à©‹à¨• à¨¦à¨¿à©°à¨¦à©‡ à¨¹à¨¨, à¨œà¨¿à¨¸ à¨¨à¨¾à¨² à¨¹à©‹à¨° à¨‰à¨ªà¨­à©‹à¨—à¨¤à¨¾à¨µà¨¾à¨‚ à¨¦à©‡ à¨•à©°à¨® à¨°à©à¨• à¨œà¨¾à¨‚à¨¦à©‡ à¨¹à¨¨à¥¤",
            "es": "En FastAPI, las funciones `async def` corren en el hilo del event loop. Una llamada bloqueante como `time.sleep` congela el bucle por completo, impidiendo procesar otras peticiones concurrentes.",
            "fr": "Dans FastAPI, `async def` s'exÃ©cute sur le thread principal de la boucle d'Ã©vÃ©nements. Un appel bloquant comme `time.sleep` paralyse la boucle et bloque toutes les requÃªtes concurrentes.",
            "de": "In FastAPI lÃ¤uft `async def` auf dem Haupt-Event-Loop. Ein blockierender Aufruf wie `time.sleep` friert den gesamten Event-Loop ein und stoppt alle parallelen Anfragen.",
            "ja": "FastAPIã®`async def`ã¯å˜ä¸€ã‚¹ãƒ¬ãƒƒãƒ‰ã®ã‚¤ãƒ™ãƒ³ãƒˆãƒ«ãƒ¼ãƒ—ä¸Šã§å‹•ä½œã—ã¾ã™ã€‚`time.sleep`ã®ã‚ˆã†ãªãƒ–ãƒ­ãƒƒã‚­ãƒ³ã‚°å‡¦ç†ã‚’å®Ÿè¡Œã™ã‚‹ã¨ã‚¤ãƒ™ãƒ³ãƒˆãƒ«ãƒ¼ãƒ—å…¨ä½“ãŒåœæ­¢ã—ã€ä»–ãƒ¦ãƒ¼ã‚¶ãƒ¼ã®ä¸¦è¡Œãƒªã‚¯ã‚¨ã‚¹ãƒˆãŒå…¨ã¦ãƒ–ãƒ­ãƒƒã‚¯ã•ã‚Œã¾ã™ã€‚"
        }
    }
]
;
