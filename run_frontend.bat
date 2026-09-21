@echo off
echo Starting EduPath Frontend Dev Server on http://localhost:5173 ...
cd frontend
if not exist "node_modules" (
    echo [EduPath] node_modules not found. Installing frontend dependencies...
    call npm install
)
call npm run dev
