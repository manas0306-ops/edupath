"""
EduPath Programming Flashcards and Self-Assessment Quiz Bank
Includes multi-domain programming concepts with full multilingual explanations:
en (English), hi (Hindi), pa (Punjabi), es (Spanish), fr (French), de (German), ja (Japanese).
"""
from typing import List, Dict, Any

AVAILABLE_TOPICS = [
    {"id": "all", "name": "All Programming Topics", "icon": "🌐"},
    {"id": "python", "name": "Python & Data Structures", "icon": "🐍"},
    {"id": "sql", "name": "SQL & Database Engineering", "icon": "💾"},
    {"id": "pytorch", "name": "PyTorch & Deep Learning", "icon": "🔥"},
    {"id": "ml", "name": "Machine Learning Algorithms", "icon": "🤖"},
    {"id": "fastapi", "name": "FastAPI & Microservices", "icon": "⚡"},
    {"id": "docker", "name": "Docker & Cloud DevOps", "icon": "🐳"},
]

PROGRAMMING_FLASHCARDS: List[Dict[str, Any]] = [
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
            "hi": "GIL CPython में एक सुरक्षात्मक म्यूटिक्स है जो एक समय में केवल एक थ्रेड को बाइटकोड निष्पादित करने की अनुमति देता है। इसलिए सीपीयू-गहन कार्यों के लिए मल्टीथ्रेडिंग के बजाय मल्टीप्रोसेसिंग का उपयोग किया जाता है।",
            "pa": "GIL CPython ਵਿੱਚ ਇੱਕ ਮਿਊਟੈਕਸ ਹੈ ਜੋ ਇੱਕ ਸਮੇਂ ਸਿਰਫ਼ ਇੱਕ ਥ੍ਰੈੱਡ ਨੂੰ ਬਾਈਟਕੋਡ ਚਲਾਉਣ ਦਿੰਦਾ ਹੈ। ਇਸ ਕਰਕੇ CPU-ਗੰਭੀਰ ਕੰਮਾਂ ਲਈ ਮਲਟੀਪ੍ਰੋਸੈਸਿੰਗ ਵਰਤਣੀ ਚਾਹੀਦੀ ਹੈ।",
            "es": "El GIL es un mutex en CPython que permite que solo un subproceso ejecute código de bytes a la vez. Para tareas que consumen mucha CPU, se debe usar multiprocesamiento en lugar de subprocesos múltiples.",
            "fr": "Le GIL est un mutex dans CPython permettant à un seul thread d'exécuter le bytecode à la fois. Pour les calculs intensifs sur processeur, il faut utiliser le multiprocessing plutôt que le multi-threading.",
            "de": "Das GIL ist ein Mutex in CPython, der sicherstellt, dass jeweils nur ein Thread Python-Bytecode ausführt. Bei CPU-intensiven Aufgaben sollte Multiprocessing statt Multithreading genutzt werden.",
            "ja": "GILはCPythonにおいて一度に1つのスレッドのみがバイトコードを実行できるようにするミューテックスです。CPU負荷の高いタスクにはマルチスレッドではなくマルチプロセッシングを使用します。"
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
            "hi": "पायथन डिक्शनरी डायनेमिक हैश टेबल का उपयोग करती हैं। सामान्य परिस्थितियों में हैश इंडेक्सिंग O(1) स्थिर समय लेती है। दुर्लभ गंभीर हैश टकराव में यह O(n) हो सकता है।",
            "pa": "ਪਾਈਥਨ ਡਿਕਸ਼ਨਰੀਆਂ ਹੈਸ਼ ਟੇਬਲ ਦੀ ਵਰਤੋਂ ਕਰਦੀਆਂ ਹਨ। ਆਮ ਤੌਰ 'ਤੇ ਕੁੰਜੀ ਲੱਭਣ ਦਾ ਸਮਾਂ O(1) ਹੁੰਦਾ ਹੈ, ਪਰ ਗੰਭੀਰ ਟਕਰਾਅ ਵਿੱਚ ਇਹ O(n) ਹੋ ਸਕਦਾ ਹੈ।",
            "es": "Los diccionarios de Python son tablas hash dinámicas. Con claves bien distribuidas, la búsqueda toma tiempo constante O(1). En el peor caso con colisiones extremas se degrada a O(n).",
            "fr": "Les dictionnaires Python reposent sur des tables de hachage dynamiques. La recherche s'effectue en temps constant moyen O(1), et peut se dégrader en O(n) en cas de collisions extrêmes.",
            "de": "Python-Dictionaries sind dynamische Hashtabellen. Bei gleichmäßiger Verteilung beträgt der Zugriff durchschnittlich O(1). Im schlechtesten Fall bei extremen Kollisionen O(n).",
            "ja": "Pythonの辞書は動的ハッシュテーブルとして実装されています。キーが均一に分散されている場合、平均アクセス時間はO(1)です。極端な衝突時の最悪計算量はO(n)になります。"
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
            "hi": "`yield` निष्पादन को रोककर स्थिति बनाए रखता है और आवश्यकतानुसार मान स्ट्रीम करता है। इससे बिना रैम भरे बड़े लॉग डेटा को प्रोसेस किया जा सकता है।",
            "pa": "`yield` ਕੋਡ ਨੂੰ ਰੋਕ ਕੇ ਸਥਿਤੀ ਯਾਦ ਰੱਖਦਾ ਹੈ ਅਤੇ ਮੰਗ ਅਨੁਸਾਰ ਡੇਟਾ ਭੇਜਦਾ ਹੈ। ਇਸ ਨਾਲ ਰੈਮ ਭਰੇ ਬਿਨਾਂ ਵੱਡੀਆਂ ਫਾਈਲਾਂ ਪ੍ਰੋਸੈਸ ਕੀਤੀਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ।",
            "es": "`yield` pausa la ejecución conservando el estado local y emite valores bajo demanda. Permite procesar archivos de muchos gigabytes sin agotar la memoria RAM.",
            "fr": "`yield` suspend l'exécution tout en conservant l'état local, produisant les valeurs à la demande. Cela permet de traiter d'énormes fichiers sans saturer la RAM.",
            "de": "`yield` unterbricht die Ausführung unter Beibehaltung des Zustands und liefert Werte bedarfsgesteuert. So können riesige Datenmengen ohne RAM-Überlauf verarbeitet werden.",
            "ja": "`yield`はローカル状態を保持したまま実行を一時中断し、オンデマンドで値を生成します。これにより大容量ログもメモリ不足を起こさず処理できます。"
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
            "hi": "ACID में Atomicity (सब कुछ या कुछ नहीं), Consistency (नियमों का पालन), Isolation (समवर्ती सुरक्षा), और Durability (क्रैश के बाद भी डेटा सुरक्षित) सुनिश्चित करती है।",
            "pa": "ACID ਲੈਣ-ਦੇਣ ਦੀ ਸ਼ੁੱਧਤਾ ਬਣਾਈ ਰੱਖਦਾ ਹੈ: ਸਾਰੇ ਕਦਮ ਪੂਰੇ ਹੋਣ ਜਾਂ ਵਾਪਸ ਮੁੜਨ, ਇਕਸਾਰਤਾ, ਵੱਖਰੇਵੇਂ ਅਤੇ ਹਾਰਡਵੇਅਰ ਕਰੈਸ਼ ਤੋਂ ਬਾਅਦ ਵੀ ਡਾਟਾ ਸੁਰੱਖਿਆ।",
            "es": "ACID garantiza que las transacciones sean Atómicas (todo o nada), Consistentes (reglas válidas), Aisladas (concurrencia segura) y Duraderas (permanentes en disco tras fallos).",
            "fr": "ACID garantit qu'une transaction est Atomique (tout ou rien), Cohérente (règles respectées), Isolée (sécurité concurrente) et Durable (persistance après panne).",
            "de": "ACID garantiert Atomarität (alles oder nichts), Konsistenz (Regelkonformität), Isolation (nebenläufige Sicherheit) und Dauerhaftigkeit (übersteht Systemabstürze).",
            "ja": "ACIDはトランザクションの原子性（全て実行か全取消）、一貫性（整合性規則）、独立性（並行処理の安全性）、永続性（クラッシュ時の復元）を保証します。"
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
            "hi": "B-Tree इंडेक्स डेटा को सॉर्ट करके रखते हैं, जिससे रेंज क्वेरी (BETWEEN, <, >) और सॉर्टिंग O(log N) समय में कुशल हो जाती है। हैश इंडेक्स केवल सटीक समानता (=) का समर्थन करते हैं।",
            "pa": "B-Tree ਇੰਡੈਕਸ ਡਾਟਾ ਨੂੰ ਕ੍ਰਮਬੱਧ ਰੱਖਦੇ ਹਨ, ਜਿਸ ਨਾਲ ਰੇਂਜ ਖੋਜਾਂ ਅਤੇ ਛਾਂਟੀ ਆਸਾਨ ਹੁੰਦੀ ਹੈ। ਹੈਸ਼ ਇੰਡੈਕਸ ਸਿਰਫ਼ ਬਰਾਬਰਤਾ (=) ਦਾ ਸਮਰਥਨ ਕਰਦੇ ਹਨ।",
            "es": "Los índices B-Tree mantienen los datos ordenados, lo que permite consultas por rango (BETWEEN, >, <) y ordenación eficiente en tiempo O(log N). Los índices Hash solo admiten igualdad exacta.",
            "fr": "Les index B-Tree conservent les données triées, ce qui permet des recherches par intervalle (BETWEEN, >, <) et du tri en O(log N), contrairement aux index Hash limités aux égalités strictes.",
            "de": "B-Tree-Indizes halten Daten sortiert, was Bereichsabfragen (BETWEEN, >, <) und Sortierungen in O(log N) erlaubt. Hash-Indizes unterstützen nur exakte Gleichheit.",
            "ja": "B-Treeインデックスはデータをソート状態で保持するため、範囲検索（BETWEEN、>、<）やORDER BYをO(log N)で高速処理できます。ハッシュインデックスは完全一致のみ対応します。"
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
            "hi": "PyTorch में ग्रेडिएंट डिफ़ॉल्ट रूप से बफर में जमा (accumulate) होते हैं। यदि `zero_grad()` नहीं बुलाया जाता है, तो पिछले बैच के ग्रेडिएंट जुड़ जाएंगे और मॉडल गलत सीखेगा।",
            "pa": "PyTorch ਵਿੱਚ ਗ੍ਰੇਡੀਐਂਟ ਬਫਰ ਵਿੱਚ ਜਮ੍ਹਾਂ ਹੁੰਦੇ ਰਹਿੰਦੇ ਹਨ। ਜੇਕਰ `zero_grad()` ਨਾ ਚਲਾਇਆ ਜਾਵੇ, ਤਾਂ ਪਿਛਲੇ ਬੈਚਾਂ ਦੇ ਗ੍ਰੇਡੀਐਂਟ ਜੁੜ ਕੇ ਨਤੀਜਾ ਖਰਾਬ ਕਰ ਦੇਣਗੇ।",
            "es": "PyTorch acumula gradientes en los búferes por defecto. Si no se llama a `zero_grad()`, los gradientes del lote anterior se suman al actual, arruinando la optimización.",
            "fr": "PyTorch accumule par défaut les gradients dans les tampons. Si `zero_grad()` n'est pas appelé, les gradients des lots précédents s'additionnent, faussant la mise à jour des poids.",
            "de": "PyTorch akkumuliert Gradienten standardmäßig. Ohne `zero_grad()` summieren sich die Gradienten vorheriger Batches auf, was die Gewichtsaktualisierung verfälscht.",
            "ja": "PyTorchはデフォルトで勾配を累積します。`zero_grad()`を呼び出さないと、前回のバッチの勾配が加算され続け、モデルの重み更新が不正になります。"
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
            "hi": "`model.eval()` ड्रॉपआउट को बंद करता है और बैच नॉर्म को स्थिर करता है। `torch.no_grad()` ऑटो-ग्रेड ट्रैकिंग बंद कर वीआरएएम बचाता है और अनुमान तेज करता है।",
            "pa": "`model.eval()` ਡ੍ਰੌਪਆਉਟ ਨੂੰ ਬੰਦ ਕਰਦਾ ਹੈ ਅਤੇ ਬੈਚ-ਨੋਰਮ ਨੂੰ ਸਥਿਰ ਕਰਦਾ ਹੈ। `torch.no_grad()` ਗ੍ਰਾਫ ਟਰੈਕਿੰਗ ਬੰਦ ਕਰਕੇ ਮੈਮੋਰੀ ਬਚਾਉਂਦਾ ਹੈ।",
            "es": "`model.eval()` desactiva Dropout y fija las estadísticas de BatchNorm. `torch.no_grad()` desactiva el grafo computacional, ahorrando mucha memoria GPU.",
            "fr": "`model.eval()` désactive le Dropout et fige BatchNorm. `torch.no_grad()` désactive le graphe de calcul dynamique, réduisant l'utilisation de VRAM et accélérant l'inférence.",
            "de": "`model.eval()` deaktiviert Dropout und fixiert BatchNorm. `torch.no_grad()` stoppt die Berechnungsgraph-Erstellung, spart VRAM und beschleunigt die Inferenz.",
            "ja": "`model.eval()`はDropoutを無効化しBatchNormを実行統計固定に設定します。`torch.no_grad()`は計算グラフ構築を停止してGPUメモリを大幅に節約します。"
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
            "hi": "अत्यधिक असंतुलन में केवल नकारात्मक अनुमान लगाने से भी 99.8% सटीकता मिल जाती है। इसलिए धोखाधड़ी पकड़ने के लिए Precision, Recall और PR-AUC का उपयोग किया जाता है।",
            "pa": "ਅਸੰਤੁਲਿਤ ਡੇਟਾ ਵਿੱਚ ਸ਼ੁੱਧਤਾ ਧੋਖਾ ਦੇ ਸਕਦੀ ਹੈ। ਇਸ ਲਈ ਧੋਖਾਧੜੀ ਫੜਨ ਵਾਸਤੇ Precision, Recall ਅਤੇ PR-AUC ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
            "es": "La exactitud (Accuracy) es engañosa en clases desbalanceadas porque un modelo trivial que siempre predice la clase mayoritaria tendrá alta precisión. Usa Precision, Recall y PR-AUC.",
            "fr": "L'exactitude (Accuracy) est trompeuse avec des classes déséquilibrées. Un modèle prédisant toujours la classe majoritaire affiche un score élevé. Utilisez Precision, Recall et PR-AUC.",
            "de": "Genauigkeit (Accuracy) ist bei unausgeglichenen Klassen irreführend. Ein triviales Modell erreicht hohe Werte ohne Treffer bei Betrug. Nutzen Sie Precision, Recall und PR-AUC.",
            "ja": "極端な不均衡データでは、全て多数派と予測するだけで高いAccuracyが出ます。不正検知にはPrecision、Recall、PR-AUC、F1スコアを使用します。"
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
            "hi": "L1 पेनल्टी (Lasso) गैर-ज़रूरी विशेषताओं के वज़न को बिल्कुल शून्य कर देती है, जिससे स्वचालित फीचर चयन होता है। L2 (Ridge) वज़न को छोटा करती है लेकिन शून्य नहीं करती।",
            "pa": "L1 (Lasso) ਬੇਲੋੜੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦੇ ਭਾਰ ਨੂੰ ਬਿਲਕੁਲ ਜ਼ੀਰੋ ਕਰ ਦਿੰਦਾ ਹੈ। L2 (Ridge) ਭਾਰ ਘਟਾਉਂਦਾ ਹੈ ਪਰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਜ਼ੀਰੋ ਨਹੀਂ ਕਰਦਾ।",
            "es": "L1 (Lasso) anula a cero los coeficientes irrelevantes generando selección dispersa de variables. L2 (Ridge) reduce los pesos suavemente sin llevarlos exactamente a cero.",
            "fr": "L1 (Lasso) force les coefficients inutiles à zéro (sélection de variables). L2 (Ridge) réduit uniformément l'amplitude des poids sans les annuler totalement.",
            "de": "L1 (Lasso) setzt irrelevante Koeffizienten exakt auf Null (automatische Feature-Auswahl). L2 (Ridge) verkleinert Gewichte kontinuierlich, ohne sie ganz zu nullen.",
            "ja": "L1（Lasso）は不要な特徴量の重みを厳密にゼロにしてスパースな特徴量選択を行います。L2（Ridge）は重みを全体的に縮小しますが完全なゼロにはしません。"
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
            "hi": "FastAPI का `Depends` स्वचालित रूप से डेटाबेस सेशन खोलता और बंद करता है, प्रति अनुरोध कैशिंग करता है, और यूनिट परीक्षणों में डेटाबेस को मॉक करना बेहद आसान बनाता है।",
            "pa": "FastAPI ਦਾ `Depends` ਸਰੋਤਾਂ ਦਾ ਜੀਵਨ ਚੱਕਰ ਸੰਭਾਲਦਾ ਹੈ, ਸੈਸ਼ਨ ਖੋਲ੍ਹਦਾ ਤੇ ਬੰਦ ਕਰਦਾ ਹੈ ਅਤੇ ਟੈਸਟਿੰਗ ਵਿੱਚ ਆਸਾਨੀ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।",
            "es": "El sistema `Depends` de FastAPI gestiona el ciclo de vida de recursos (cierra sesiones tras `yield`), deduce parámetros y permite sustituir dependencias fácilmente en tests.",
            "fr": "Le système `Depends` de FastAPI gère le cycle de vie des ressources (fermeture de sessions après `yield`), évite les doublons et permet de mocker facilement les dépendances dans les tests.",
            "de": "FastAPIs `Depends` regelt den Lebenszyklus von Ressourcen (Schließen von Sessions nach `yield`), verhindert Duplikate und erleichtert das Mocking in Unit-Tests.",
            "ja": "FastAPIの`Depends`はリソースのライフサイクル管理（`yield`後の自動クローズ）、リクエスト毎の依存関係解決、テスト時のモック差し替えを容易にします。"
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
            "hi": "Docker हर चरण को कैश करता है। यदि कोड पहले कॉपी किया जाता है, तो किसी भी छोटे बदलाव पर Docker को फिर से सभी लाइब्रेरी डाउनलोड करनी पड़ेगी। आवश्यकता फाइलें पहले रखने से समय बचता है।",
            "pa": "Docker ਹਰ ਕਦਮ ਨੂੰ ਕੈਸ਼ੇ ਵਿੱਚ ਰੱਖਦਾ ਹੈ। ਜੇਕਰ ਕੋਡ ਪਹਿਲਾਂ ਕਾਪੀ ਕੀਤਾ ਜਾਵੇ, ਤਾਂ ਹਰ ਛੋਟੇ ਬਦਲਾਅ 'ਤੇ ਸਾਰੀਆਂ ਲਾਇਬ੍ਰੇਰੀਆਂ ਦੁਬਾਰਾ ਡਾਊਨਲੋਡ ਹੋਣਗੀਆਂ।",
            "es": "Docker almacena en caché cada capa. Si copias el código antes de `pip install`, cualquier cambio invalida la caché y obliga a descargar e instalar todas las dependencias de nuevo.",
            "fr": "Docker met en cache chaque couche. Copier le code avant `pip install` invalide le cache à chaque modification, forçant la réinstallation complète de tous les paquets pip.",
            "de": "Docker nutzt Layer-Caching. Wird der Code vor `pip install` kopiert, führt jede Code-Änderung zum Neuinstallieren aller Pakete. Das Voranstellen spart extrem viel Build-Zeit.",
            "ja": "Dockerは各レイヤーをキャッシュします。コードを先にコピーすると、1行の修正でもキャッシュが無効になり、毎回時間のかかるライブラリの再インストールが発生します。"
        },
        "tags": ["Docker", "CI/CD", "Caching", "Performance"]
    }
]

SELF_ASSESSMENT_QUIZ_BANK: List[Dict[str, Any]] = [
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
            "hi": "पायथन में डिफ़ॉल्ट तर्क फ़ंक्शन परिभाषा के समय केवल एक बार बनाए जाते हैं। वही सूची हर कॉल में पुन: उपयोग की जाती है, इसलिए `[1, 2]` प्रिंट होता है। सही तरीका `target_list=None` का उपयोग करना है।",
            "pa": "ਪਾਈਥਨ ਵਿੱਚ ਡਿਫਾਲਟ ਆਰਗੂਮੈਂਟ ਸਿਰਫ਼ ਇੱਕ ਵਾਰ ਫੰਕਸ਼ਨ ਪਰਿਭਾਸ਼ਿਤ ਕਰਦੇ ਸਮੇਂ ਬਣਦੇ ਹਨ। ਉਹੀ ਸੂਚੀ ਬਾਰ-ਬਾਰ ਵਰਤੀ ਜਾਂਦੀ ਹੈ, ਜਿਸ ਕਾਰਨ `[1, 2]` ਬਣਦਾ ਹੈ।",
            "es": "Los argumentos por defecto en Python se evalúan solo una vez en el momento de la definición. La lista mutada se comparte entre llamadas sucesivas, produciendo `[1, 2]`.",
            "fr": "Les arguments par défaut en Python sont évalués une seule fois à la définition de la fonction. La même liste mutable est réutilisée d'un appel à l'autre, affichant `[1, 2]`.",
            "de": "Standardargumente werden in Python einmalig bei der Funktionsdefinition ausgewertet. Die mutierbare Liste wird geteilt, sodass der zweite Aufruf `[1, 2]` liefert.",
            "ja": "Pythonのデフォルト引数は関数定義時に一度だけ評価されます。同一のミュータブルなリストが全呼び出しで共有されるため、出力は`[1, 2]`になります。"
        }
    },
    {
        "id": "q-sql-1",
        "topic": "sql",
        "difficulty": "Intermediate",
        "title": "SQL Aggregate Filtering with WHERE vs HAVING",
        "question": "Which SQL query correctly identifies all departments that employ more than 5 engineers with a salary greater than $80,000?",
        "code_snippet": None,
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
            "hi": "SQL में `WHERE` ग्रुपिंग से पहले अलग-अलग पंक्तियों को फ़िल्टर करता है, जबकि `HAVING` ग्रुपिंग के बाद एग्रीगेट गणना (`COUNT(*) > 5`) को फ़िल्टर करता है।",
            "pa": "`WHERE` ਗਰੁੱਪ ਬਣਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਲਾਈਨਾਂ ਨੂੰ ਫਿਲਟਰ ਕਰਦਾ ਹੈ, ਜਦੋਂ ਕਿ `HAVING` ਗਰੁੱਪ ਬਣਨ ਤੋਂ ਬਾਅਦ ਨਤੀਜਿਆਂ ਦੀ ਗਿਣਤੀ ਫਿਲਟਰ ਕਰਦਾ ਹੈ।",
            "es": "`WHERE` filtra filas individuales antes de agrupar (`salary > 80000`). `GROUP BY` crea los grupos y `HAVING` filtra las funciones agregadas (`COUNT(*) > 5`).",
            "fr": "`WHERE` filtre les lignes individuelles avant le regroupement. `GROUP BY` forme les groupes et `HAVING` filtre le résultat agrégé (`COUNT(*) > 5`).",
            "de": "`WHERE` filtert Zeilen vor der Gruppierung (`salary > 80000`). `GROUP BY` fasst zusammen und `HAVING` filtert aggregierte Gruppen (`COUNT(*) > 5`).",
            "ja": "`WHERE`句は集計前に個別行（給与8万超）をフィルタし、`GROUP BY`で集計後、`HAVING`句で集計結果（所属5名超）を絞り込みます。"
        }
    },
    {
        "id": "q-pt-1",
        "topic": "pytorch",
        "difficulty": "Advanced",
        "title": "PyTorch Tensor In-Place Operations & Autograd",
        "question": "What error or behavior occurs when performing in-place modification (e.g. `x.add_()`) on a tensor needed for backpropagation in PyTorch?",
        "code_snippet": "x = torch.tensor([2.0], requires_grad=True)\ny = x ** 2\nx.add_(1.0)  # In-place mutation!\ny.backward()",
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
            "hi": "ग्रेडिएंट की गणना के लिए PyTorch को `x` के मूल मान की आवश्यकता होती है। जब इन-प्लेस ऑपरेशन (`add_()`) मेमोरी को बदल देता है, तो PyTorch सुरक्षा के लिए RuntimeError उठाता है।",
            "pa": "ਗ੍ਰੇਡੀਐਂਟ ਗਣਨਾ ਲਈ ਅਸਲ ਮੁੱਲ ਜ਼ਰੂਰੀ ਹੁੰਦਾ ਹੈ। ਇਨ-ਪਲੇਸ ਬਦਲਾਅ ਮੈਮੋਰੀ ਖਰਾਬ ਕਰ ਦਿੰਦਾ ਹੈ, ਇਸ ਲਈ PyTorch ਇੱਕ RuntimeError ਦਿੰਦਾ ਹੈ।",
            "es": "Para calcular el gradiente, PyTorch necesita el valor original de `x`. La mutación in-situ invalida el búfer, activando el contador de versiones y lanzando un RuntimeError.",
            "fr": "Pour calculer la dérivée, PyTorch conserve la valeur initiale de `x`. La modification in-place détruit cette valeur et déclenche une RuntimeError via le compteur de version.",
            "de": "PyTorch benötigt den Originalwert von `x` für den Gradienten. Die In-Place-Operation zerstört den Puffer, was zu einem geschützten RuntimeError führt.",
            "ja": "勾配計算には順伝播時の`x`の値が必要です。インプレース操作（`add_`）でメモリが上書きされると値が失われ、PyTorchは安全のためRuntimeErrorを発生させます。"
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
            "hi": "पूरे डेटासेट पर स्केलर फिट करने से टेस्ट डेटा के आंकड़े (मीन और वेरियंस) ट्रेनिंग में लीक हो जाते हैं। इससे मॉडल का प्रदर्शन कागज़ पर अच्छा दिखता है लेकिन असली दुनिया में फेल हो जाता है।",
            "pa": "ਪੂਰੇ ਡੇਟਾ 'ਤੇ ਸਕੇਲਰ ਲਗਾਉਣ ਨਾਲ ਟੈਸਟ ਡੇਟਾ ਦੀ ਜਾਣਕਾਰੀ ਟ੍ਰੇਨਿੰਗ ਵਿੱਚ ਲੀਕ ਹੋ ਜਾਂਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਮਾਡਲ ਅਸਲੀ ਦੁਨੀਆ ਵਿੱਚ ਸਹੀ ਕੰਮ ਨਹੀਂ ਕਰਦਾ।",
            "es": "Ajustar el escalador en todo el conjunto filtra la media y desviación del conjunto de prueba en el entrenamiento (data leakage), inflando falsamente el rendimiento real del modelo.",
            "fr": "Ajuster le scaler sur l'ensemble complet fait fuiter les statistiques (moyenne/variance) des données de test dans l'entraînement, faussant les métriques d'évaluation réelles.",
            "de": "Das Fitten des Skalierers auf den gesamten Datensatz leckt Mittelwert und Varianz der Testdaten in das Training (Data Leakage), was zu unrealistisch guten Testergebnissen führt.",
            "ja": "全体データでスケーラーをfitさせると、テストデータの統計情報（平均や分散）が学習に漏洩（データリーク）し、過度に楽観的な評価結果になってしまいます。"
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
            "hi": "FastAPI में `async def` मुख्य इवेंट लूप पर चलता है। यदि इसमें `time.sleep()` जैसा ब्लॉकिंग कोड लिखा जाए, तो पूरा सर्वर फ्रीज हो जाता है और बाकी यूज़र्स के अनुरोध रुक जाते हैं।",
            "pa": "`async def` ਮੁੱਖ ਇਵੈਂਟ ਲੂਪ 'ਤੇ ਚਲਦਾ ਹੈ। `time.sleep()` ਵਰਗੇ ਬਲਾਕਿੰਗ ਫੰਕਸ਼ਨ ਪੂਰੇ ਸਰਵਰ ਨੂੰ ਰੋਕ ਦਿੰਦੇ ਹਨ, ਜਿਸ ਨਾਲ ਹੋਰ ਉਪਭੋਗਤਾਵਾਂ ਦੇ ਕੰਮ ਰੁਕ ਜਾਂਦੇ ਹਨ।",
            "es": "En FastAPI, las funciones `async def` corren en el hilo del event loop. Una llamada bloqueante como `time.sleep` congela el bucle por completo, impidiendo procesar otras peticiones concurrentes.",
            "fr": "Dans FastAPI, `async def` s'exécute sur le thread principal de la boucle d'événements. Un appel bloquant comme `time.sleep` paralyse la boucle et bloque toutes les requêtes concurrentes.",
            "de": "In FastAPI läuft `async def` auf dem Haupt-Event-Loop. Ein blockierender Aufruf wie `time.sleep` friert den gesamten Event-Loop ein und stoppt alle parallelen Anfragen.",
            "ja": "FastAPIの`async def`は単一スレッドのイベントループ上で動作します。`time.sleep`のようなブロッキング処理を実行するとイベントループ全体が停止し、他ユーザーの並行リクエストが全てブロックされます。"
        }
    }
]
