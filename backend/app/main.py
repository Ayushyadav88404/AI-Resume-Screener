from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from typing import List
import json

from . import database
from . import schemas
from . import nlp_processor

# Initialize FastAPI app
app = FastAPI(
    title="AI Resume Screener",
    description="Automated resume screening using NLP and semantic similarity",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    database.init_db()

@app.get("/")
async def root():
    return {
        "message": "AI Resume Screener API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# ==================== JOB ENDPOINTS ====================

@app.post("/api/jobs", response_model=dict)
async def create_job(job: schemas.JobCreate):
    """Create a new job posting."""
    try:
        # Parse job description for skills
        job_data = nlp_processor.parse_job_description(job.description)
        skills_json = json.dumps(job_data['skills'])
        requirements_text = ' '.join(job_data['requirements']) if job_data['requirements'] else job.requirements
        
        job_id = database.insert_job(
            title=job.title,
            description=job.description,
            requirements=requirements_text,
            skills=skills_json
        )
        
        return {
            "success": True,
            "job_id": job_id,
            "title": job.title,
            "skills_extracted": job_data['skills']
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/jobs")
async def list_jobs():
    """List all jobs."""
    try:
        jobs = database.get_all_jobs()
        return {
            "success": True,
            "jobs": [dict(job) for job in jobs],
            "total": len(jobs)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/jobs/{job_id}")
async def get_job(job_id: int):
    """Get a specific job."""
    try:
        job = database.get_job(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"success": True, "job": dict(job)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== RESUME ENDPOINTS ====================

@app.post("/api/resumes")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and parse a resume."""
    try:
        # Read file content
        content = await file.read()
        text_content = content.decode('utf-8', errors='ignore')
        
        # Parse resume
        resume_data = nlp_processor.parse_resume(text_content)
        skills_json = json.dumps(resume_data['skills'])
        experience_json = json.dumps(resume_data['sections'].get('experience', ''))
        education_json = json.dumps(resume_data['sections'].get('education', ''))
        
        # Store in database
        resume_id = database.insert_resume(
            filename=file.filename,
            content=text_content,
            skills=skills_json,
            experience=experience_json,
            education=education_json
        )
        
        return {
            "success": True,
            "resume_id": resume_id,
            "filename": file.filename,
            "skills_extracted": resume_data['skills']
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/resumes")
async def list_resumes():
    """List all resumes."""
    try:
        resumes = database.get_all_resumes()
        return {
            "success": True,
            "resumes": [dict(resume) for resume in resumes],
            "total": len(resumes)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/resumes/{resume_id}")
async def get_resume(resume_id: int):
    """Get a specific resume."""
    try:
        resume = database.get_resume(resume_id)
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        return {"success": True, "resume": dict(resume)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== SCREENING ENDPOINTS ====================

@app.post("/api/screen")
async def screen_resumes(request: schemas.ScreeningRequest):
    """Screen multiple resumes against a job posting."""
    try:
        # Get job
        job = database.get_job(request.job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Parse job data
        job_skills = json.loads(job['skills']) if job['skills'] else []
        job_data = {
            'skills': job_skills,
            'full_text': job['description'],
            'requirements': job['requirements'].split('\n') if job['requirements'] else []
        }
        
        # Get resumes to screen
        if request.resume_ids:
            resumes = [database.get_resume(rid) for rid in request.resume_ids]
            resumes = [r for r in resumes if r]
        else:
            resumes = database.get_all_resumes()
        
        # Screen each resume
        results = []
        for resume in resumes:
            # Parse resume data
            resume_skills = json.loads(resume['skills']) if resume['skills'] else []
            resume_data = {
                'skills': resume_skills,
                'full_text': resume['content'],
                'sections': {
                    'experience': json.loads(resume['experience']) if resume['experience'] else '',
                    'education': json.loads(resume['education']) if resume['education'] else ''
                }
            }
            
            # Score resume
            score_result = nlp_processor.score_resume(resume_data, job_data)
            
            # Store ranking
            matched_skills_str = ', '.join(score_result['matched_skills'])
            database.insert_ranking(
                job_id=request.job_id,
                resume_id=resume['id'],
                score=score_result['total_score'],
                match_percentage=score_result['skill_match_percentage'],
                matched_skills=matched_skills_str
            )
            
            results.append({
                'resume_id': resume['id'],
                'filename': resume['filename'],
                'score': score_result['total_score'],
                'skill_match': score_result['skill_match_percentage'],
                'matched_skills': score_result['matched_skills'],
                'breakdown': {
                    'skill_score': score_result['skill_score'],
                    'experience_score': score_result['experience_score'],
                    'education_score': score_result['education_score'],
                    'text_similarity': score_result['text_similarity_score']
                }
            })
        
        # Sort by score
        results.sort(key=lambda x: x['score'], reverse=True)
        
        return {
            "success": True,
            "job_id": request.job_id,
            "job_title": job['title'],
            "total_resumes_scored": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/rankings/{job_id}")
async def get_rankings(job_id: int, limit: int = 100):
    """Get rankings for a job."""
    try:
        rankings = database.get_rankings_for_job(job_id, limit)
        return {
            "success": True,
            "job_id": job_id,
            "rankings": [dict(ranking) for ranking in rankings],
            "total": len(rankings)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== DATABASE MANAGEMENT ====================

@app.post("/api/clear-db")
async def clear_database():
    """
    Clear all data from the database.
    WARNING: This action cannot be undone!
    """
    try:
        import sqlite3
        
        # Get database path
        db_path = "resume_screener.db"
        
        if not os.path.exists(db_path):
            raise HTTPException(status_code=404, detail="Database not found")
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        cleared_tables = []
        cleared_records = 0
        
        # Clear each table
        for table in tables:
            table_name = table[0]
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            cleared_records += count
            
            cursor.execute(f"DELETE FROM {table_name};")
            cleared_tables.append({
                "table": table_name,
                "records_cleared": count
            })
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "message": "Database cleared successfully",
            "tables_cleared": cleared_tables,
            "total_records_cleared": cleared_records
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/db-stats")
async def get_database_stats():
    """Get database statistics."""
    try:
        import sqlite3
        
        db_path = "resume_screener.db"
        
        if not os.path.exists(db_path):
            raise HTTPException(status_code=404, detail="Database not found")
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        stats = {}
        total_records = 0
        
        # Get stats for each table
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        for table in tables:
            table_name = table[0]
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            stats[table_name] = count
            total_records += count
        
        conn.close()
        
        return {
            "success": True,
            "table_stats": stats,
            "total_records": total_records
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== HEALTH CHECK ====================

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "AI Resume Screener"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
