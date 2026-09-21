# Contributing to EduPath

Thank you for your interest in contributing to **EduPath**! We welcome contributions from developers, designers, data scientists, and educators.

---

## Code of Conduct

Please maintain an inclusive, welcoming, and respectful environment for everyone. Constructive feedback and respectful communication are mandatory across all issues and pull requests.

---

## Development Workflow

### 1. Prerequisites
- Python 3.10+
- Node.js LTS (v18+) & npm

### 2. Fork & Clone
```bash
git clone https://github.com/manas0306-ops/edupath.git
cd edupath
```

### 3. Backend Setup
```bash
# Verify python dependencies
pip install -r requirements.txt # or pre-installed FastAPI, Uvicorn, SQLAlchemy, aiosqlite, pydantic

# Run backend API
python -m uvicorn backend.app.main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 5. Running Tests
```bash
# Run backend pytest suite
python -m pytest backend/tests -p no:cacheprovider

# Run frontend build check
cd frontend
npm run build
```

---

## Pull Request Guidelines

1. Create a feature branch (`git checkout -b feat/your-feature-name`).
2. Ensure all unit and integration tests pass.
3. Keep commits atomic, clean, and prefixed with standard conventional commit tags (`feat:`, `fix:`, `docs:`, `test:`).
4. Open a pull request against the `main` branch with a clear description of changes.
