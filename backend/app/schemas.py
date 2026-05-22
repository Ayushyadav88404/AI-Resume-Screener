from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class JobCreate(BaseModel):
    title: str
    description: str
    requirements: Optional[str] = None

class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    requirements: Optional[str]
    skills: Optional[str]
    created_at: datetime

class ResumeCreate(BaseModel):
    filename: str
    content: str

class ResumeResponse(BaseModel):
    id: int
    filename: str
    content: str
    skills: Optional[str]
    experience: Optional[str]
    education: Optional[str]
    created_at: datetime

class RankingResponse(BaseModel):
    id: int
    job_id: int
    resume_id: int
    score: float
    match_percentage: Optional[float]
    matched_skills: Optional[str]
    job_title: str
    filename: str
    created_at: datetime

class ScreeningRequest(BaseModel):
    job_id: int
    resume_ids: Optional[List[int]] = None

class ScreeningResponse(BaseModel):
    job_id: int
    results: List[RankingResponse]
    total_resumes_scored: int
