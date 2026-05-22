# 👨‍💻 Development Guide

Learn how to customize and extend the AI Resume Screener.

---

## Project Structure

```
backend/
├── app/
│   ├── main.py                # FastAPI app & routes
│   ├── nlp_processor.py       # NLP & BERT logic
│   ├── database.py            # SQLite operations
│   ├── schemas.py             # Pydantic models
│   └── __init__.py
└── requirements.txt

frontend/
├── src/
│   ├── components/
│   │   ├── JobForm.jsx        # Job creation UI
│   │   ├── ResumeUpload.jsx   # Resume upload UI
│   │   ├── ScreeningButton.jsx# Screening trigger
│   │   ├── Results.jsx        # Results display
│   │   ├── LandingPage.jsx    # Landing page
│   │   └── *.css
│   ├── pages/
│   │   └── Home.jsx
│   ├── App.jsx                # Main app component
│   └── index.jsx
├── package.json
└── vite.config.js
```

---

## Backend Development

### Modifying the Scoring Algorithm

Edit `backend/app/nlp_processor.py` in the `calculate_final_score()` function:

Current weights:
```python
final_score = (
    skill_match * 0.40 +          # 40% - Exact skill match
    experience_similarity * 0.30 + # 30% - Experience similarity
    education_relevance * 0.10 +   # 10% - Education
    text_similarity * 0.20         # 20% - Overall similarity
)
```

**To change weights:**
```python
# Example: Increase skill match importance
final_score = (
    skill_match * 0.50 +          # 50% (increased)
    experience_similarity * 0.25 + # 25% (decreased)
    education_relevance * 0.10 +   # 10% (unchanged)
    text_similarity * 0.15         # 15% (decreased)
)
```

Make sure weights sum to 1.0!

---

### Adding New Skills to Recognition

Edit `backend/app/nlp_processor.py` in the `TECHNICAL_SKILLS` set:

```python
TECHNICAL_SKILLS = {
    # Existing skills...
    'Python', 'JavaScript', 'Java',
    # Add new skills:
    'Rust', 'Go', 'TypeScript',
    'Kubernetes', 'Docker Swarm'
}
```

---

### Modifying Job Required Skills

In `backend/app/main.py`, create_job() function:

```python
@app.post("/api/jobs")
async def create_job(job: JobCreate):
    # Add validation
    if len(job.title) < 3:
        raise HTTPException(status_code=400, detail="Title too short")
    
    # Extract skills
    extracted_skills = nlp_processor.extract_skills(job.description)
    
    # Add more extraction if needed
    education_level = nlp_processor.extract_education(job.description)
    years_experience = nlp_processor.extract_years_of_experience(job.description)
```

---

### Adding New API Endpoints

Add to `backend/app/main.py`:

```python
@app.get("/api/custom-endpoint")
async def custom_endpoint():
    """Your endpoint description"""
    # Your logic here
    return {"message": "Success"}
```

Then register in `__init__.py` or use app.include_router()

---

### Changing Database Structure

Edit `backend/app/database.py`:

```python
def init_db():
    # Add new table
    db.execute("""
        CREATE TABLE IF NOT EXISTS new_table (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            value TEXT
        )
    """)
    db.commit()
```

---

### Using Environment Variables

Create `.env` file:

```env
DATABASE_URL=resume_screener.db
FASTAPI_ENV=development
PORT=8000
CUSTOM_VAR=my_value
```

Access in code:

```python
import os
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv("DATABASE_URL")
```

---

## Frontend Development

### Styling Components

Edit component CSS files in `frontend/src/components/`:

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}
```

---

### Adding New Components

Create `frontend/src/components/NewComponent.jsx`:

```jsx
export default function NewComponent() {
  return (
    <div className="new-component">
      <h1>New Component</h1>
      <p>Content here</p>
    </div>
  );
}
```

Add CSS file `NewComponent.css`:

```css
.new-component {
  /* styles */
}
```

Import and use in `App.jsx`:

```jsx
import NewComponent from './components/NewComponent';

export default function App() {
  return (
    <>
      <NewComponent />
    </>
  );
}
```

---

### Modifying API Calls

Edit component to change API endpoint or method:

```jsx
// Before
const response = await axios.post('/api/screen', { job_id });

// After - with custom headers
const response = await axios.post('/api/screen', 
  { job_id },
  { headers: { 'X-Custom-Header': 'value' } }
);
```

---

### Adding Form Validation

```jsx
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  
  // Validate
  if (!jobTitle.trim()) {
    setErrors({ ...errors, jobTitle: 'Required' });
    return;
  }
  
  // Submit
  submitForm();
};
```

---

## Development Workflow

### 1. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Make Changes

Edit files while servers are running. Changes auto-reload!

### 3. Test Your Changes

- Backend: Check http://localhost:8000/docs
- Frontend: Check http://localhost:5173

### 4. Debug

**Backend:**
```python
print(f"Debug: {variable}")  # Console output
```

**Frontend:**
```javascript
console.log("Debug:", variable);  // Browser console (F12)
```

---

## Testing

### Backend Testing

Create test file `backend/test_api.py`:

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_create_job():
    response = client.post("/api/jobs", json={
        "title": "Test Job",
        "description": "Test description"
    })
    assert response.status_code == 200
    assert "id" in response.json()
```

Run tests:
```bash
pytest backend/test_api.py
```

### Frontend Testing

Use React Testing Library. Example:

```jsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  expect(screen.getByText(/Create Job/i)).toBeInTheDocument();
});
```

Run tests:
```bash
npm test
```

---

## Performance Optimization

### Backend

**Caching BERT Model:**
```python
# Load once at startup
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')  # Cache this

# Reuse for all calculations
def get_similarity(text1, text2):
    embedding1 = model.encode(text1, convert_to_numpy=True)
    embedding2 = model.encode(text2, convert_to_numpy=True)
    return cosine_similarity(embedding1, embedding2)
```

**Database Optimization:**
```python
# Add indexes for faster queries
db.execute("CREATE INDEX idx_job_id ON resumes(job_id)")
db.execute("CREATE INDEX idx_created_at ON jobs(created_at)")
```

### Frontend

**Lazy Load Components:**
```jsx
import { lazy, Suspense } from 'react';

const Results = lazy(() => import('./components/Results'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Results />
    </Suspense>
  );
}
```

**Optimize Renders:**
```jsx
import { memo } from 'react';

export default memo(function ResultCard({ result }) {
  // Only re-renders if props change
  return <div>{result.filename}</div>;
});
```

---

## Common Tasks

### Add New Supported File Type

Edit `backend/app/main.py`:

```python
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx', 'doc'}  # Add 'doc'

@app.post("/api/resumes")
async def upload_resume(job_id: int, file: UploadFile):
    if file.filename.split('.')[-1].lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="File type not allowed")
```

### Change Default Port

Backend:
```bash
python -m uvicorn app.main:app --reload --port 8001
```

Frontend:
```bash
npm run dev -- --port 5174
```

### Add Dark Mode

```css
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1e1e1e;
    color: #fff;
  }
}
```

### Clear Database

#### Using Python Script

A Python script is available to clear the database from command line:

```bash
cd backend
python clear_db.py
```

The script will:
1. Show all tables and their record counts
2. Ask for confirmation
3. Clear all tables
4. Show success message

**With Backup:**

To create a backup before clearing:

```bash
python clear_db.py --backup
```

This creates a timestamped backup file (e.g., `resume_screener_backup_20260522_143000.db`) before clearing.

#### Using API Endpoint

Clear the database via API:

```bash
curl -X POST http://localhost:8000/api/clear-db
```

Response:
```json
{
  "success": true,
  "message": "Database cleared successfully",
  "tables_cleared": [
    {"table": "jobs", "records_cleared": 5},
    {"table": "resumes", "records_cleared": 12},
    {"table": "rankings", "records_cleared": 8}
  ],
  "total_records_cleared": 25
}
```

#### Using UI Button

In the web application:

1. Click the **🗑️ Clear DB** button in the header (top right)
2. A confirmation dialog will appear
3. Review the warning message
4. Click "Yes, Clear Database" to proceed
5. A success message will confirm the action

**Features:**
- Prevents accidental clicks with confirmation dialog
- Shows what will be deleted
- Auto-clears form after operation
- Resets app state
- Visual feedback (success/error message)

#### Get Database Statistics

Check current database usage:

```bash
curl http://localhost:8000/api/db-stats
```

Response:
```json
{
  "success": true,
  "table_stats": {
    "jobs": 3,
    "resumes": 8,
    "rankings": 24
  },
  "total_records": 35
}
```

---

## Debugging Tips

### Backend
- Check console output in terminal
- Use `print()` statements
- Access FastAPI docs: http://localhost:8000/docs
- Check `resume_screener.db` with SQLite browser

### Frontend
- Open Developer Tools: F12
- Check Console tab for errors
- Use React DevTools extension
- Check Network tab for API calls

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# Test thoroughly

# Commit
git add .
git commit -m "Add my feature"

# Push
git push origin feature/my-feature

# Create Pull Request
```

---

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [React Documentation](https://react.dev)
- [spaCy Documentation](https://spacy.io)
- [Sentence-Transformers](https://www.sbert.net)

---

**Last Updated:** May 22, 2026
