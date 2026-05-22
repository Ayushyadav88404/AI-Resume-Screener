import sqlite3
from contextlib import contextmanager
from datetime import datetime
import os

DATABASE_URL = "resume_screener.db"

def init_db():
    """Initialize the database with required tables."""
    conn = sqlite3.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    # Create jobs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            requirements TEXT,
            skills TEXT,
            embeddings BLOB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create resumes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            content TEXT NOT NULL,
            skills TEXT,
            experience TEXT,
            education TEXT,
            embeddings BLOB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create rankings table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS rankings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id INTEGER NOT NULL,
            resume_id INTEGER NOT NULL,
            score REAL NOT NULL,
            match_percentage REAL,
            matched_skills TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id) REFERENCES jobs(id),
            FOREIGN KEY (resume_id) REFERENCES resumes(id)
        )
    ''')
    
    conn.commit()
    conn.close()

@contextmanager
def get_db():
    """Get a database connection."""
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def insert_job(title: str, description: str, requirements: str = None, skills: str = None) -> int:
    """Insert a job posting."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO jobs (title, description, requirements, skills) VALUES (?, ?, ?, ?)',
            (title, description, requirements, skills)
        )
        conn.commit()
        return cursor.lastrowid

def insert_resume(filename: str, content: str, skills: str = None, experience: str = None, education: str = None) -> int:
    """Insert a resume."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO resumes (filename, content, skills, experience, education) VALUES (?, ?, ?, ?, ?)',
            (filename, content, skills, experience, education)
        )
        conn.commit()
        return cursor.lastrowid

def insert_ranking(job_id: int, resume_id: int, score: float, match_percentage: float = None, matched_skills: str = None):
    """Insert a ranking."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO rankings (job_id, resume_id, score, match_percentage, matched_skills) VALUES (?, ?, ?, ?, ?)',
            (job_id, resume_id, score, match_percentage, matched_skills)
        )
        conn.commit()

def get_job(job_id: int):
    """Get a job by ID."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM jobs WHERE id = ?', (job_id,))
        return cursor.fetchone()

def get_resume(resume_id: int):
    """Get a resume by ID."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM resumes WHERE id = ?', (resume_id,))
        return cursor.fetchone()

def get_rankings_for_job(job_id: int, limit: int = 100):
    """Get top rankings for a job."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT r.*, j.title as job_title, res.filename 
            FROM rankings r
            JOIN jobs j ON r.job_id = j.id
            JOIN resumes res ON r.resume_id = res.id
            WHERE r.job_id = ?
            ORDER BY r.score DESC
            LIMIT ?
        ''', (job_id, limit))
        return cursor.fetchall()

def get_all_jobs():
    """Get all jobs."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM jobs ORDER BY created_at DESC')
        return cursor.fetchall()

def get_all_resumes():
    """Get all resumes."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM resumes ORDER BY created_at DESC')
        return cursor.fetchall()
