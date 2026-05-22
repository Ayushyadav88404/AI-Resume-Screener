# 🤖 AI-Powered Resume Screener

**An Intelligent Resume Screening Platform Powered by BERT AI and Machine Learning**

Automate recruitment by parsing, analyzing, and ranking resumes based on job descriptions using advanced NLP and semantic similarity.

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📚 Documentation

| Quick Links | Purpose | Time |
|-----------|---------|------|
| [docs/QUICK_START.md](docs/QUICK_START.md) | Get running in 5 minutes | 5 min |
| [docs/SETUP.md](docs/SETUP.md) | Installation & troubleshooting | 10 min |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design & data flow | 15 min |
| [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | Complete API reference | 10 min |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Customize & extend | 10 min |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment | 15 min |

---

## ✨ Key Features

### 🧠 Intelligent Resume Parsing
- Automatic skill, experience, and education extraction
- spaCy Named Entity Recognition
- Resume section parsing
- 30+ technical skills recognized
- Supports TXT, PDF, DOCX formats

### 📊 Advanced Semantic Matching
- BERT-based semantic analysis
- 4-factor scoring system:
  - **Skill Match (40%)** - Required vs candidate skills
  - **Experience (30%)** - BERT semantic similarity
  - **Education (10%)** - Educational relevance
  - **Text Similarity (20%)** - Overall similarity

### 🎯 Intelligent Ranking
- Automatic ranking by match percentage
- Detailed breakdown for each resume
- Score analytics
- Result export capability

### 🎨 Modern UI
- Responsive design (desktop, tablet, mobile)
- Professional landing page
- Real-time results display
- Intuitive 3-step workflow

### 💾 Data Management
- SQLite database
- Complete screening history
- Full CRUD operations
- Data export

### ⚡ Performance
- Screen 100+ resumes in ~2 seconds
- Optimized NLP pipeline
- Smart model caching
- Production-ready

---

## 🛠️ Tech Stack

**Backend:**
- FastAPI (REST API)
- spaCy (NLP)
- Sentence-Transformers / BERT (Semantic similarity)
- SQLite (Database)
- Uvicorn (ASGI server)

**Frontend:**
- React 18
- Vite (Build tool)
- CSS3 (Responsive design)
- Axios (HTTP client)

---

## 🚀 Quick Start

### Backend Setup (Terminal 1)

```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python -m uvicorn app.main:app --reload
```

**Access API:** http://localhost:8000/docs

### Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

**Access App:** http://localhost:5173

👉 **For detailed setup:** See [docs/QUICK_START.md](docs/QUICK_START.md)

---

## 📂 Project Structure

```
AI-Powered_resume_Screener/
├── README.md
├── docs/
│   ├── QUICK_START.md
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   ├── API_DOCUMENTATION.md
│   ├── DEVELOPMENT.md
│   └── DEPLOYMENT.md
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── nlp_processor.py
│   │   ├── database.py
│   │   ├── schemas.py
│   │   └── __init__.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── *.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── SAMPLE_RESUME.txt
├── SAMPLE_JOB_DESCRIPTION.txt
└── .gitignore
```

---

## 💻 Basic Usage

### Step 1: Create Job
1. Enter job title
2. Paste job description
3. System extracts skills automatically
4. Click "Create Job"

### Step 2: Upload Resumes
1. Select the job
2. Upload resume files (TXT, PDF, DOCX)
3. System parses automatically

### Step 3: Screen Resumes
1. Click "🚀 Start Screening"
2. Wait 2-5 seconds for processing
3. View ranked results with scores

---

## 📊 Scoring Algorithm

```
Final Score = (Skill Match × 0.40) +
              (Experience × 0.30) +
              (Education × 0.10) +
              (Text Similarity × 0.20)
```

---

## 🔗 API Overview

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Health check |
| POST/GET | `/api/jobs` | Job management |
| POST/GET | `/api/resumes` | Resume management |
| POST | `/api/screen` | Screen resumes |
| GET | `/api/rankings/{job_id}` | Get rankings |

👉 **Full API docs:** See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

---

## 🆘 Getting Help

- **Quick setup:** [docs/QUICK_START.md](docs/QUICK_START.md)
- **Installation help:** [docs/SETUP.md](docs/SETUP.md)
- **How it works:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **API reference:** [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- **Customization:** [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **Deployment:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 📄 License

MIT License - see LICENSE for details

---

**Last Updated:** May 22, 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
