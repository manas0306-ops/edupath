@echo off
echo ========================================================
echo   EduPath — AI-Powered Personalized Learning Agent
echo ========================================================
cd /d "%~dp0"

echo [1/2] Checking Python backend dependencies...
python -c "import fastapi, uvicorn, aiosqlite" 2>nul
if %errorlevel% neq 0 (
    echo [EduPath] Missing Python libraries. Installing from requirements.txt...
    pip install -r requirements.txt
)

echo [2/2] Checking frontend dependencies...
if not exist "frontend\node_modules" (
    echo [EduPath] node_modules not found. Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo Launching Backend Server on http://127.0.0.1:8000 ...
start "EduPath Backend API" cmd /k "run_backend.bat"

echo Launching Frontend Server on http://localhost:5173 ...
start "EduPath Frontend" cmd /k "run_frontend.bat"

echo.
echo ========================================================
echo   Both servers initiated successfully!
echo   👉 Frontend App:    http://localhost:5173
echo   👉 Backend API:     http://127.0.0.1:8000/docs
echo ========================================================
pause
