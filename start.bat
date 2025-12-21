@echo off
echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 3

echo Starting Frontend Server...
start cmd /k "npm run dev"

echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
pause