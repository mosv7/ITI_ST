@echo off
title House Price Prediction System
color 0A

echo ==================================================
echo   HOUSE PRICE PREDICTION SYSTEM (XGBoost Powered)
echo ==================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "Backend API Server" python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000

timeout /t 3 >nul

echo [2/2] Starting React Frontend on http://localhost:3000 ...
cd /d "%~dp0frontend"
start "React Frontend" npm start

echo.
echo ==================================================
echo Application launched!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo ==================================================
echo.
pause