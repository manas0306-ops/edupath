"""
EduPath Unified Launcher
Cross-platform helper to launch backend and frontend with auto-dependency checks.
"""
import os
import sys
import subprocess
import time

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

def ensure_backend_dependencies():
    print("[1/2] Checking Python dependencies...")
    try:
        import fastapi
        import uvicorn
        import aiosqlite
        print("  ✓ Backend packages installed.")
    except ImportError as e:
        print(f"  ⚠️ Missing dependency ({e.name}). Installing from requirements.txt...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], cwd=ROOT_DIR)
        print("  ✓ Backend packages installed successfully.")

def ensure_frontend_dependencies():
    print("[2/2] Checking frontend dependencies...")
    node_modules = os.path.join(FRONTEND_DIR, "node_modules")
    if not os.path.exists(node_modules):
        print("  ⚠️ 'node_modules' not found. Running 'npm install' (one-time setup)...")
        npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
        subprocess.check_call([npm_cmd, "install"], cwd=FRONTEND_DIR, shell=True)
        print("  ✓ Frontend dependencies installed successfully.")
    else:
        print("  ✓ Frontend dependencies found.")

def main():
    print("=" * 60)
    print("  🚀 EduPath — Personalized Learning Agent Launcher")
    print("=" * 60)

    ensure_backend_dependencies()
    ensure_frontend_dependencies()

    print("\nStarting servers...")
    print("  👉 Backend API:  http://127.0.0.1:8000 (Swagger: /docs)")
    print("  👉 Frontend App: http://localhost:5173")
    print("=" * 60)
    print("Press CTRL+C to stop both servers at any time.\n")

    # Start backend
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=ROOT_DIR
    )

    # Start frontend
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=FRONTEND_DIR,
        shell=True
    )

    try:
        backend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping EduPath servers...")
        try:
            backend_proc.terminate()
            frontend_proc.terminate()
        except Exception:
            pass
        print("EduPath stopped.")

if __name__ == "__main__":
    main()
