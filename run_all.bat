@echo off
echo ========================================================
echo   EduPath — AI-Powered Personalized Learning Agent
echo ========================================================
echo Launching Backend Server on http://127.0.0.1:8000 ...
start "EduPath Backend API" cmd /k "run_backend.bat"

echo Launching Frontend Server on http://localhost:5173 ...
start "EduPath Frontend" cmd /k "run_frontend.bat"

echo.
echo Both servers initiated!
echo Access the application in your browser: http://localhost:5173
echo API Swagger documentation: http://127.0.0.1:8000/docs
echo ========================================================
pause
