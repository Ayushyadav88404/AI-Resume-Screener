# 🔧 Setup Guide

Detailed installation and configuration instructions for the AI Resume Screener.

---

## Prerequisites Verification

Before starting, verify all requirements are installed:

### Python

```bash
python --version
# Output should be: Python 3.8 or higher
```

### Node.js and npm

```bash
node --version
# Should be 14 or higher

npm --version
# Should be 6 or higher
```

---

## Backend Installation

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

Upgrade pip first:

```bash
pip install --upgrade pip
```

Install all requirements:

```bash
pip install -r requirements.txt
```

### Step 4: Download NLP Model

```bash
python -m spacy download en_core_web_sm
```

This downloads the English language model for spaCy (~40MB).

### Step 5: Verify Installation

Test that all dependencies are installed:

```bash
python -c "import fastapi; import spacy; import torch; print('✅ All dependencies installed')"
```

---

## Frontend Installation

### Step 1: Navigate to Frontend

```bash
cd frontend
```

### Step 2: Install Node Modules

```bash
npm install
```

### Step 3: Verify Installation

```bash
npm list react vite
```

---

## Environment Configuration

### Backend Environment (.env)

Create `backend/.env` file:

```env
DATABASE_URL=resume_screener.db
FASTAPI_ENV=development
PORT=8000
```

### Frontend Environment (.env)

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:8000
```

---

## Running the Application

### Terminal 1 - Start Backend

```bash
cd backend
venv\Scripts\activate    # Windows
# OR: source venv/bin/activate  # macOS/Linux

python -m uvicorn app.main:app --reload
```

Expected output:
```
Uvicorn running on http://127.0.0.1:8000
```

Access Swagger UI: http://localhost:8000/docs

### Terminal 2 - Start Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v4.x.x  ready in 123 ms

➜  Local:   http://localhost:5173/
```

Access application: http://localhost:5173

---

## Troubleshooting

### Backend Issues

#### Python: Command Not Found

**Problem:** `python: command not found`

**Solution:**
- Use `python3` instead of `python`
- Or add Python to system PATH

```bash
python3 --version
```

#### ModuleNotFoundError

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
# Make sure virtual environment is activated
venv\Scripts\activate

# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

#### spaCy Model Not Found

**Problem:** `OSError: [E050] Can't find model 'en_core_web_sm'`

**Solution:**
```bash
python -m spacy download en_core_web_sm
```

#### Port 8000 Already in Use

**Problem:** `Address already in use`

**Solution:**

Find what's using port 8000:

```bash
# macOS/Linux
lsof -i :8000

# Windows
netstat -ano | findstr :8000
```

Use a different port:

```bash
python -m uvicorn app.main:app --reload --port 8001
```

#### Connection Refused

**Problem:** `Connection refused` when accessing API

**Solution:**
- Make sure backend is running
- Check if port 8000 is correct
- Verify CORS settings in main.py

---

### Frontend Issues

#### npm ERR! code ERESOLVE

**Problem:** Peer dependency conflict during install

**Solution:**

```bash
npm install --legacy-peer-deps
```

Or use npm 7+:

```bash
npm install --force
```

#### Port 5173 Already in Use

**Problem:** `Address already in use`

**Solution:**

```bash
npm run dev -- --port 5174
```

#### Module Not Found

**Problem:** Various `Module not found` errors

**Solution:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or force install
npm install --force
```

#### Cannot Find Module React

**Problem:** React module missing

**Solution:**

```bash
cd frontend
npm install
npm install react react-dom
```

#### API Connection Failed

**Problem:** Frontend can't connect to backend

**Solution:**

1. Verify backend is running on port 8000
2. Check VITE_API_URL in .env file
3. Ensure CORS is enabled in backend
4. Check browser console for errors

---

### Database Issues

#### Database Locked

**Problem:** `database is locked` error

**Solution:**

- Close all terminal instances
- Delete `resume_screener.db` if necessary
- Restart backend

```bash
cd backend
rm resume_screener.db
python -m uvicorn app.main:app --reload
```

#### No Such Table: jobs

**Problem:** `no such table: jobs` error

**Solution:**

This happens on first run. The database schema should auto-create. If it persists:

```bash
# Stop backend
# Delete database file
rm resume_screener.db

# Start backend again
python -m uvicorn app.main:app --reload
```

#### Corrupted Database

**Problem:** Database file is corrupted

**Solution:**

```bash
# Backup old database
cp resume_screener.db resume_screener.db.backup

# Delete and recreate
rm resume_screener.db

# Restart backend
python -m uvicorn app.main:app --reload
```

---

## System Requirements

### Minimum
- RAM: 2GB
- Disk: 500MB
- Processor: Dual core

### Recommended
- RAM: 4GB+
- Disk: 2GB+
- Processor: Quad core+

---

## Performance Optimization

### Backend

```bash
# Use production server instead of reload
python -m uvicorn app.main:app --workers 4
```

### Frontend

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Database

```bash
# Optimize database
python -c "import sqlite3; db = sqlite3.connect('resume_screener.db'); db.execute('VACUUM'); db.close()"
```

---

## Getting Help

- Check [README.md](../README.md)
- Review [QUICK_START.md](QUICK_START.md)
- See [ARCHITECTURE.md](ARCHITECTURE.md)
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

**Last Updated:** May 22, 2026
