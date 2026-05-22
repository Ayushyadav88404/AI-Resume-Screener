# 📚 API Documentation

Complete REST API reference for the AI Resume Screener.

---

## Base URL

**Development:** `http://localhost:8000`

**Production:** Your deployed domain

---

## Authentication

Currently, the API has no authentication. For production, add JWT tokens or API keys.

---

## Health Check

Check if the API is running.

**Request:**
```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-22T10:30:45.123456"
}
```

---

## Job Management

### Create Job

Create a new job posting for resume screening.

**Request:**
```
POST /api/jobs
Content-Type: application/json

{
  "title": "Senior Python Developer",
  "description": "We are looking for an experienced Python developer with 5+ years of experience in FastAPI and PostgreSQL..."
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Senior Python Developer",
  "description": "We are looking for...",
  "extracted_skills": [
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "REST API"
  ],
  "created_at": "2026-05-22T10:30:45.123456"
}
```

---

### List All Jobs

Retrieve all job postings.

**Request:**
```
GET /api/jobs
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Senior Python Developer",
    "extracted_skills": ["Python", "FastAPI", "PostgreSQL"],
    "created_at": "2026-05-22T10:30:45"
  },
  {
    "id": 2,
    "title": "React Developer",
    "extracted_skills": ["React", "JavaScript", "CSS"],
    "created_at": "2026-05-22T11:15:30"
  }
]
```

---

### Get Job Details

Retrieve details for a specific job.

**Request:**
```
GET /api/jobs/{job_id}
```

**Example:**
```
GET /api/jobs/1
```

**Response:**
```json
{
  "id": 1,
  "title": "Senior Python Developer",
  "description": "We are looking for...",
  "extracted_skills": ["Python", "FastAPI", "PostgreSQL"],
  "created_at": "2026-05-22T10:30:45"
}
```

**Status Codes:**
- `200` - Success
- `404` - Job not found

---

## Resume Management

### Upload Resume

Upload a resume for a job.

**Request:**
```
POST /api/resumes
Content-Type: multipart/form-data

{
  "job_id": 1,
  "file": <binary file data>
}
```

**Supported Formats:**
- `.txt` - Plain text
- `.pdf` - PDF files
- `.docx` - Word documents

**Response:**
```json
{
  "id": 1,
  "job_id": 1,
  "filename": "john_doe.pdf",
  "extracted_skills": [
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Docker"
  ],
  "experience_years": 7,
  "education": "Bachelor's in Computer Science",
  "created_at": "2026-05-22T10:35:20"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid file type
- `413` - File too large
- `404` - Job not found

---

### List Resumes for Job

Get all resumes uploaded for a specific job.

**Request:**
```
GET /api/resumes/{job_id}
```

**Example:**
```
GET /api/resumes/1
```

**Response:**
```json
[
  {
    "id": 1,
    "filename": "john_doe.pdf",
    "extracted_skills": ["Python", "FastAPI"],
    "created_at": "2026-05-22T10:35:20"
  },
  {
    "id": 2,
    "filename": "jane_smith.docx",
    "extracted_skills": ["Python", "Django", "PostgreSQL"],
    "created_at": "2026-05-22T10:40:15"
  }
]
```

**Status Codes:**
- `200` - Success
- `404` - Job not found

---

## Screening & Rankings

### Start Screening

Screen all resumes for a job and generate rankings.

**Request:**
```
POST /api/screen
Content-Type: application/json

{
  "job_id": 1
}
```

**Response:**
```json
{
  "job_id": 1,
  "total_resumes": 5,
  "screening_time_seconds": 3.5,
  "results": [
    {
      "resume_id": 1,
      "filename": "john_doe.pdf",
      "match_percentage": 87.5,
      "score_breakdown": {
        "skill_match": 90,
        "experience_similarity": 85,
        "education_relevance": 75,
        "text_similarity": 88
      }
    },
    {
      "resume_id": 2,
      "filename": "jane_smith.docx",
      "match_percentage": 78.3,
      "score_breakdown": {
        "skill_match": 80,
        "experience_similarity": 76,
        "education_relevance": 70,
        "text_similarity": 78
      }
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - No resumes for job
- `404` - Job not found

---

### Get Rankings

Get saved rankings for a job.

**Request:**
```
GET /api/rankings/{job_id}
```

**Example:**
```
GET /api/rankings/1
```

**Response:**
```json
[
  {
    "ranking_id": 1,
    "resume_id": 1,
    "filename": "john_doe.pdf",
    "match_percentage": 87.5,
    "rank": 1,
    "score_breakdown": {
      "skill_match": 90,
      "experience_similarity": 85,
      "education_relevance": 75,
      "text_similarity": 88
    },
    "created_at": "2026-05-22T10:45:30"
  },
  {
    "ranking_id": 2,
    "resume_id": 2,
    "filename": "jane_smith.docx",
    "match_percentage": 78.3,
    "rank": 2,
    "score_breakdown": {
      "skill_match": 80,
      "experience_similarity": 76,
      "education_relevance": 70,
      "text_similarity": 78
    },
    "created_at": "2026-05-22T10:45:30"
  }
]
```

**Status Codes:**
- `200` - Success
- `404` - Job or rankings not found

---

## Scoring Explanation

### Score Breakdown

Each candidate receives scores in 4 categories:

**1. Skill Match (0-100)**
- Compares required skills with candidate skills
- Percentage of required skills found in resume

Example:
```
Job requires: Python, FastAPI, PostgreSQL
Resume has: Python, FastAPI, Docker
Match = 2/3 = 66.7%
```

**2. Experience Similarity (0-100)**
- Uses BERT semantic embeddings
- Compares job experience requirements with resume experience
- Cosine similarity score

Example:
```
Job: "5+ years with FastAPI and microservices"
Resume: "7 years building REST APIs with FastAPI"
Similarity = 85/100
```

**3. Education Relevance (0-100)**
- Scores based on education level and field
- Bachelor's in related field = 80%
- Master's in related field = 90%
- Relevant certifications = varies

**4. Text Similarity (0-100)**
- Overall document similarity
- BERT semantic similarity
- Full job vs full resume

---

## Final Score Calculation

```
Final Score = (Skill Match × 0.40) +
              (Experience Similarity × 0.30) +
              (Education Relevance × 0.10) +
              (Text Similarity × 0.20)
```

### Example Calculation

```
Resume: john_doe.pdf

Skill Match: 90 × 0.40 = 36.0
Experience: 85 × 0.30 = 25.5
Education: 75 × 0.10 = 7.5
Text Sim: 88 × 0.20 = 17.6
───────────────────────────
Final Score: 86.6%
```

---

## Error Responses

### 400 - Bad Request

```json
{
  "detail": "Invalid request: Missing required field 'title'"
}
```

### 404 - Not Found

```json
{
  "detail": "Job with id 999 not found"
}
```

### 413 - Payload Too Large

```json
{
  "detail": "File size exceeds maximum allowed (25MB)"
}
```

### 500 - Internal Server Error

```json
{
  "detail": "An error occurred while processing your request"
}
```

---

## Testing with cURL

### Create Job

```bash
curl -X POST http://localhost:8000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Python Developer",
    "description": "5+ years FastAPI experience..."
  }'
```

### List Jobs

```bash
curl http://localhost:8000/api/jobs
```

### Upload Resume

```bash
curl -X POST http://localhost:8000/api/resumes \
  -F "job_id=1" \
  -F "file=@resume.pdf"
```

### Screen Resumes

```bash
curl -X POST http://localhost:8000/api/screen \
  -H "Content-Type: application/json" \
  -d '{"job_id": 1}'
```

### Get Rankings

```bash
curl http://localhost:8000/api/rankings/1
```

---

## Python Example

Using Python requests library:

```python
import requests

BASE_URL = "http://localhost:8000"

# Create job
job_data = {
    "title": "Senior Python Developer",
    "description": "5+ years experience with FastAPI..."
}
response = requests.post(f"{BASE_URL}/api/jobs", json=job_data)
job_id = response.json()["id"]

# Upload resume
with open("resume.pdf", "rb") as f:
    files = {"file": f}
    data = {"job_id": job_id}
    requests.post(f"{BASE_URL}/api/resumes", files=files, data=data)

# Screen resumes
response = requests.post(
    f"{BASE_URL}/api/screen",
    json={"job_id": job_id}
)
results = response.json()

# Display results
for result in results["results"]:
    print(f"{result['filename']}: {result['match_percentage']}%")
```

---

## Database Management

### Get Database Statistics

Get current database usage statistics.

**Request:**
```
GET /api/db-stats
```

**Response:**
```json
{
  "success": true,
  "table_stats": {
    "jobs": 5,
    "resumes": 12,
    "rankings": 24
  },
  "total_records": 41
}
```

**Status Codes:**
- `200` - Success
- `404` - Database not found
- `500` - Error

---

### Clear Database

**⚠️ WARNING:** This endpoint permanently deletes all data. Use with caution!

Clear all data from the database.

**Request:**
```
POST /api/clear-db
```

**Response:**
```json
{
  "success": true,
  "message": "Database cleared successfully",
  "tables_cleared": [
    {
      "table": "jobs",
      "records_cleared": 5
    },
    {
      "table": "resumes",
      "records_cleared": 12
    },
    {
      "table": "rankings",
      "records_cleared": 24
    }
  ],
  "total_records_cleared": 41
}
```

**Status Codes:**
- `200` - Success
- `404` - Database not found
- `500` - Error

**Using cURL:**

```bash
curl -X POST http://localhost:8000/api/clear-db
```

**Using Python:**

```python
import requests

response = requests.post('http://localhost:8000/api/clear-db')
result = response.json()

if result['success']:
    print(f"✅ Cleared {result['total_records_cleared']} records")
    for table in result['tables_cleared']:
        print(f"  - {table['table']}: {table['records_cleared']} records")
```

---

## Rate Limiting

Currently no rate limiting. For production, implement:
- Request throttling
- IP-based limits
- Authenticated user quotas

---

## Pagination

Currently, all results are returned. For large datasets, add:
- `?limit=50&offset=0` parameters
- Cursor-based pagination

---

## Getting Help

- See [README.md](../README.md)
- Check [QUICK_START.md](QUICK_START.md)
- Review [ARCHITECTURE.md](ARCHITECTURE.md)
- Interactive API Docs: http://localhost:8000/docs

---

**Last Updated:** May 22, 2026
