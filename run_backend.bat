@echo off
echo ========================================================
echo  [🚀] Khoi dong Gamified 3D Daily Savings Backend (FastAPI)...
echo ========================================================
cd backend
if exist venv\Scripts\python.exe (
    venv\Scripts\python.exe run.py
) else (
    python run.py
)
pause
