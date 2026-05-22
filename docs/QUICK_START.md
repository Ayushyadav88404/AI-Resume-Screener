# 🚀 Quick Start (5 Minutes)

Get the application running in just 5 minutes!

---

## Prerequisites

Verify you have the required software:

```bash
python --version    # Should be 3.8+
node --version      # Should be 14+
npm --version       # Should be 6+
```

---

## Backend Setup (Terminal 1)

Navigate to the backend directory and set up the virtual environment:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Download spaCy model:

```bash
python -m spacy download en_core_web_sm
```

Start the backend server:

```bash
python -m uvicorn app.main:app --reload
```

✅ **Check:** Visit http://localhost:8000/docs

---

## Frontend Setup (Terminal 2)

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

✅ **Check:** Visit http://localhost:5173

---

## Test the Application

### 1. Create a Job

- Open http://localhost:5173
- Click "Create Job"
- Copy text from `SAMPLE_JOB_DESCRIPTION.txt` (in project root)
- Paste into the job description field
- Click "Create Job"

### 2. Upload a Resume

- Click "Upload Resumes"
- Select the job you just created
- Upload `SAMPLE_RESUME.txt` (in project root)
- Wait for upload to complete

### 3. Screen Resumes

- Click "🚀 Start Screening"
- Wait 2-5 seconds
- View ranked results

### 4. Check Results

- See resume scores
- Click on any result to see detailed breakdown
- Verify scoring factors

---

## Common Issues

| Issue | Solution |
|-------|----------|
| `python: command not found` | Use `python3` instead or add Python to PATH |
| `Port 8000 already in use` | Use `--port 8001` with uvicorn |
| `npm ERR! code ERESOLVE` | Run `npm install --legacy-peer-deps` |
| `spaCy model not found` | Run `python -m spacy download en_core_web_sm` again |
| `Module not found` | Make sure virtual environment is activated |
| `npm ERR! code EACCES` | Try `npm install -g npm@latest` |

---

## Next Steps

- 📖 Read [README.md](../README.md) for full overview
- 🏗️ Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
- 📚 Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- ⚙️ See [DEVELOPMENT.md](DEVELOPMENT.md) for customization
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for production setup

---

**✅ You're ready to go!**
