# 🏗️ System Architecture

Complete overview of the AI Resume Screener system design and architecture.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface (React)                │
│                    (http://localhost:5173)                 │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend                           │
│                  (http://localhost:8000)                    │
│                                                             │
│  - Job Management       - Resume Upload                    │
│  - Screening Logic      - Result Rankings                  │
└────────────────┬────────────────────────┬───────────────────┘
                 │                        │
                 ↓                        ↓
    ┌─────────────────────┐   ┌──────────────────────┐
    │   NLP Processing    │   │  SQLite Database     │
    │                     │   │                      │
    │ - spaCy (skill)     │   │ - jobs table         │
    │ - BERT (semantic)   │   │ - resumes table      │
    │ - Entity Extraction │   │ - rankings table     │
    └─────────────────────┘   └──────────────────────┘
```

---

## Architecture Layers

### 1. Presentation Layer (Frontend)

**Technology:** React 18 + Vite

**Components:**
- `LandingPage.jsx` - Marketing landing page
- `JobForm.jsx` - Create and manage jobs
- `ResumeUpload.jsx` - Upload resume files
- `ScreeningButton.jsx` - Trigger screening
- `Results.jsx` - Display ranked results

**Styling:** CSS3 with responsive design

**HTTP Client:** Axios for API calls

---

### 2. API Layer (Backend)

**Technology:** FastAPI 0.104.1

**Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Health check |
| POST | `/api/jobs` | Create job |
| GET | `/api/jobs` | List jobs |
| GET | `/api/jobs/{id}` | Get job details |
| POST | `/api/resumes` | Upload resume |
| GET | `/api/resumes/{job_id}` | List resumes |
| POST | `/api/screen` | Screen resumes |
| GET | `/api/rankings/{job_id}` | Get rankings |

---

### 3. Business Logic Layer

**NLP Pipeline:**

1. **Job Description Processing**
   - Extract required skills using spaCy NER
   - Parse experience level
   - Identify education requirements

2. **Resume Processing**
   - Parse resume text
   - Extract candidate skills
   - Extract experience details
   - Identify education

3. **Scoring Engine**
   - Calculate skill match (40%)
   - Calculate experience similarity (30%)
   - Calculate education relevance (10%)
   - Calculate text similarity (20%)

---

### 4. Data Layer

**Database:** SQLite

**Tables:**

#### jobs
```sql
CREATE TABLE jobs (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    extracted_skills TEXT,
    created_at TIMESTAMP
);
```

#### resumes
```sql
CREATE TABLE resumes (
    id INTEGER PRIMARY KEY,
    job_id INTEGER,
    filename TEXT NOT NULL,
    extracted_skills TEXT,
    text TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);
```

#### rankings
```sql
CREATE TABLE rankings (
    id INTEGER PRIMARY KEY,
    job_id INTEGER,
    resume_id INTEGER,
    match_percentage FLOAT,
    skill_match FLOAT,
    experience_similarity FLOAT,
    education_relevance FLOAT,
    text_similarity FLOAT,
    created_at TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (resume_id) REFERENCES resumes(id)
);
```

---

## Data Flow

### Workflow 1: Create Job

```
User Input (Job Title + Description)
        ↓
FastAPI Route: POST /api/jobs
        ↓
Extract Skills (spaCy NER)
        ↓
Store in Database
        ↓
Return Job ID + Extracted Skills
        ↓
Display in Frontend
```

### Workflow 2: Upload Resume

```
User Selects File + Job
        ↓
Frontend Sends File
        ↓
FastAPI Route: POST /api/resumes
        ↓
Parse File (TXT/PDF/DOCX)
        ↓
Extract Skills & Experience
        ↓
Store in Database
        ↓
Return Resume ID
        ↓
Update Frontend List
```

### Workflow 3: Screen Resumes

```
User Clicks "Start Screening"
        ↓
Frontend Sends: POST /api/screen
        ↓
For Each Resume:
  - Get job requirements
  - Get resume details
  - Calculate skill match
  - Calculate experience similarity (BERT)
  - Calculate education relevance
  - Calculate text similarity
  - Combine into final score
        ↓
Store Rankings in Database
        ↓
Sort by Match Percentage
        ↓
Return Results
        ↓
Display in Frontend (Ranked)
```

---

## Scoring Algorithm

### 4-Factor Weighted Score

```
Final Score = (A × 0.40) + (B × 0.30) + (C × 0.10) + (D × 0.20)

Where:
A = Skill Match (0-100)
B = Experience Similarity (0-100)
C = Education Relevance (0-100)
D = Text Similarity (0-100)
```

### Factor Details

**A. Skill Match (40% weight)**
- Required skills from job
- Candidate skills from resume
- Match percentage = (matched skills / total required) × 100

Example:
```
Job requires: Python, FastAPI, PostgreSQL (3 skills)
Resume has: Python, FastAPI, Docker (2 match)
Skill Match = (2/3) × 100 = 66.7%
```

**B. Experience Similarity (30% weight)**
- BERT embedding of job requirements
- BERT embedding of candidate experience
- Cosine similarity (0-1 scale, converted to 0-100)

**C. Education Relevance (10% weight)**
- Bachelor's = 80%
- Master's = 90%
- PhD = 95%
- Relevant certifications = varies

**D. Text Similarity (20% weight)**
- Full job description vs full resume text
- BERT semantic similarity
- Cosine similarity (0-1 scale, converted to 0-100)

---

## Technology Stack Details

### Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| FastAPI | 0.104.1 | REST API framework |
| Uvicorn | 0.24.0 | ASGI server |
| spaCy | 3.7.2 | NLP & entity extraction |
| Sentence-Transformers | 2.2.2 | BERT embeddings |
| PyTorch | 2.0.0 | Deep learning |
| Pydantic | 2.4.2 | Data validation |
| SQLite3 | Built-in | Database |

### Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| React | 18.x | UI framework |
| Vite | 4.x | Build tool |
| Axios | 1.x | HTTP client |
| CSS3 | Native | Styling |

---

## Performance Characteristics

### Processing Speed

- **Single Resume:** ~200-500ms
- **Batch (100 resumes):** ~15-30 seconds
- **API Response:** <100ms (database queries)

### Memory Usage

- **Backend Startup:** ~1.5GB (BERT model loaded)
- **Per Resume:** ~50MB
- **Database (1000 records):** ~20MB

### Scalability Considerations

**Current Limits:**
- SQLite single-file limit
- Single-threaded BERT processing
- No async resume screening

**Improvements for Scale:**
- Switch to PostgreSQL
- Implement job queues (Celery)
- Use GPU for BERT
- Add caching layer (Redis)

---

## Security Architecture

### Input Validation
- Pydantic models validate all inputs
- File type verification
- Size limits on uploads

### Data Protection
- SQLite database (local storage)
- No external API calls
- All processing local

### Error Handling
- Graceful error responses
- No sensitive data in errors
- Logging for debugging

---

## Deployment Architecture

```
Production Deployment

┌─────────────────────────┐
│   Load Balancer         │
│   (nginx/haproxy)       │
└────────┬────────────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌──────┐  ┌──────┐
│  API │  │  API │  (Multiple instances)
└──────┘  └──────┘
    │         │
    └────┬────┘
         ↓
┌─────────────────────────┐
│  Shared Database        │
│  (PostgreSQL)           │
└─────────────────────────┘
```

---

## Getting Started with Architecture

1. **Understand the Flow:** Review "Data Flow" section
2. **Understand Scoring:** Review "Scoring Algorithm" section
3. **Review Code:** Check `nlp_processor.py` for implementation
4. **Customize:** See [DEVELOPMENT.md](DEVELOPMENT.md)

---

**Last Updated:** May 22, 2026
