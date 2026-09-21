# EduPath — System Environment Audit Report

**Generated:** September 21, 2026  
**Host Machine:** Windows 11 Home Single Language (64-bit, Build 10.0.26200)

---

## 1. Hardware Specifications

| Component | Specification | Assessment & Compatibility |
| :--- | :--- | :--- |
| **CPU** | 13th Gen Intel(R) Core(TM) i5-13420H (8 Cores, 12 Threads) | Excellent. Ample compute for parallel asynchronous FastAPI workers and Vite HMR. |
| **RAM** | 32 GB DDR5/DDR4 (33,130,024 KB visible, ~19.8 GB free) | Abundant. Zero memory bottlenecks for frontend dev servers, database queries, and background tasks. |
| **Storage** | Primary SSD (Drive C:) — 509 GB total, **303 GB free** | Plentiful. Rapid disk I/O for virtual environments, node_modules, and SQLite databases. |
| **GPU** | Intel(R) UHD Graphics (Integrated, 2 GB shared VRAM) | Non-CUDA. Heavy local LLM inference (e.g. 70B models) is not viable locally; cloud LLM APIs (Gemini, OpenAI, Groq) with intelligent deterministic offline fallbacks are optimal. |

---

## 2. Software & Runtime Availability

| Runtime / Tool | Detected Version & Path | Status & Decision |
| :--- | :--- | :--- |
| **Python** | Python 3.13.7 (`C:\Users\krish\Downloads\python.exe`) | **Available & Active**. Pre-equipped with `fastapi`, `uvicorn`, `sqlalchemy`, `aiosqlite`, `pydantic`, `pypdf`, `openai`, `pytest`. |
| **Pip** | Pip 26.0.1 (`C:\Users\krish\Downloads\Lib\site-packages\pip`) | **Available & Active**. Ready for any additional Python packages. |
| **Node.js** | Node.js v24.19.0 LTS (`C:\Users\krish\AppData\Local\Microsoft\WinGet\Packages\...`) | **Installed & Verified**. Accessible via `node` (shims placed in `C:\Users\krish\Downloads\node.cmd`). |
| **NPM** | npm 11.17.0 (`C:\Users\krish\Downloads\npm.cmd`) | **Installed & Verified**. High-speed package management for React/Vite frontend. |
| **Git** | git version 2.55.0.windows.5 | **Available & Active**. Ready for atomic Git commits per development phase. |
| **Package Managers** | Chocolatey 2.7.3, Windows Package Manager (winget) v1.29.380 | **Available**. |
| **IDE / Editors** | VS Code, Cursor, Antigravity IDE | **Available**. |
| **Docker** | Not installed in PATH | Not required. We prioritize lightweight, zero-overhead native execution. |
| **Databases** | - **SQLite 3**: Built-in Python 3.13 (zero config, file-based, async via `aiosqlite`)<br>- **PostgreSQL**: Detected active service on port `5432` | **SQLite (Primary default)** with automatic PostgreSQL migration option via `.env`. |

---

## 3. Network & Port Allocation

| Port | Allocation Status | Recommended Role |
| :--- | :--- | :--- |
| **8000** | **Free** | FastAPI Asynchronous Backend API Server |
| **5173** | **Free** | Vite + React Frontend Development Server |
| **3000** | **Free** | Alternative Frontend Port |
| **5432** | **Occupied** (`postgres` process PID 7508) | Optional external DB integration; EduPath defaults to local SQLite to avoid credential collisions. |

---

## 4. Environment Variables & Credentials

- Existing AI keys: No external API keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`, etc.) were pre-configured in the OS environment.
- **Architectural Solution**: 
  1. EduPath will support `.env` and `.env.example` where users can insert their Gemini, OpenAI, or Groq API keys.
  2. EduPath provides a **Built-in Deterministic AI Engine & Demo Mode** allowing reviewers to experience 100% of the platform's features (resume parsing, skill gap analysis, adaptive roadmap, practice tests, AI chat) without requiring any paid API key.

---

## 5. Potential Constraints & Compatibility Notes

1. **Windows Long Paths / PowerShell Execution**:
   - Node and Python are executed via standard cmd/PowerShell shims in the user's path.
   - All file operations use cross-platform `pathlib` and standard forward/escaped slash conventions.
2. **Python 3.13 Compatibility**:
   - Modern FastAPI 0.135+ and SQLAlchemy 2.0+ are verified to run flawlessly on Python 3.13.7.
