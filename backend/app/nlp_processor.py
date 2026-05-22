import spacy
from sentence_transformers import SentenceTransformer
import numpy as np
import re
from typing import List, Dict, Tuple
import json
import subprocess
import sys

# Initialize spaCy and BERT models
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spacy model en_core_web_sm...")
    try:
        subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
        nlp = spacy.load("en_core_web_sm")
    except Exception as e:
        print(f"Failed to download spacy model: {e}")
        print("Using nlp features limited mode. Install manually: python -m spacy download en_core_web_sm")
        raise

# BERT model for semantic similarity
model = SentenceTransformer('all-MiniLM-L6-v2')

# Common technical skills database
COMMON_SKILLS = {
    'programming_languages': ['python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'typescript', 'kotlin', 'swift', 'r', 'matlab'],
    'web_frameworks': ['django', 'flask', 'fastapi', 'react', 'vue', 'angular', 'express', 'spring', 'asp.net', 'rails'],
    'databases': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'firebase', 'cassandra', 'dynamodb', 'sqlite'],
    'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'cloudformation'],
    'ml_frameworks': ['tensorflow', 'pytorch', 'scikit-learn', 'keras', 'spark', 'spark ml', 'xgboost'],
    'nlp_tools': ['spacy', 'nltk', 'huggingface', 'transformers', 'gensim', 'bert'],
    'data_tools': ['pandas', 'numpy', 'matplotlib', 'seaborn', 'plotly', 'excel'],
    'other': ['git', 'linux', 'rest api', 'graphql', 'docker', 'agile', 'scrum', 'jira']
}

def extract_skills(text: str) -> List[str]:
    """Extract technical skills from text."""
    text_lower = text.lower()
    found_skills = set()
    
    for category, skills in COMMON_SKILLS.items():
        for skill in skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                found_skills.add(skill.title())
    
    return sorted(list(found_skills))

def extract_entities(text: str) -> Dict:
    """Extract named entities (organizations, dates, etc.) using spaCy."""
    doc = nlp(text)
    entities = {
        'organizations': [],
        'dates': [],
        'locations': [],
        'persons': []
    }
    
    for ent in doc.ents:
        if ent.label_ == 'ORG':
            entities['organizations'].append(ent.text)
        elif ent.label_ == 'DATE':
            entities['dates'].append(ent.text)
        elif ent.label_ == 'GPE':
            entities['locations'].append(ent.text)
        elif ent.label_ == 'PERSON':
            entities['persons'].append(ent.text)
    
    return entities

def extract_sections(text: str) -> Dict:
    """Extract resume sections."""
    sections = {
        'contact': '',
        'summary': '',
        'experience': '',
        'education': '',
        'skills': ''
    }
    
    lines = text.split('\n')
    current_section = 'contact'
    
    section_keywords = {
        'experience': ['experience', 'work history', 'employment', 'career'],
        'education': ['education', 'university', 'degree', 'certification'],
        'skills': ['skills', 'technical skills', 'competencies', 'expertise'],
        'summary': ['summary', 'objective', 'professional profile', 'about']
    }
    
    for line in lines:
        line_lower = line.lower().strip()
        
        for section, keywords in section_keywords.items():
            if any(keyword in line_lower for keyword in keywords):
                current_section = section
                break
        
        sections[current_section] += line + '\n'
    
    return sections

def parse_resume(resume_text: str) -> Dict:
    """Parse resume and extract information."""
    sections = extract_sections(resume_text)
    skills = extract_skills(resume_text)
    entities = extract_entities(resume_text)
    
    return {
        'sections': sections,
        'skills': skills,
        'entities': entities,
        'full_text': resume_text
    }

def parse_job_description(jd_text: str) -> Dict:
    """Parse job description and extract information."""
    skills = extract_skills(jd_text)
    entities = extract_entities(jd_text)
    
    # Extract requirements sections
    lines = jd_text.split('\n')
    requirements = []
    
    for line in lines:
        if any(marker in line.lower() for marker in ['require', 'must have', 'should have', 'nice to have', '-', '*']):
            requirements.append(line.strip())
    
    return {
        'skills': skills,
        'entities': entities,
        'requirements': requirements,
        'full_text': jd_text
    }

def calculate_semantic_similarity(text1: str, text2: str) -> float:
    """Calculate semantic similarity between two texts using BERT."""
    embeddings = model.encode([text1, text2])
    similarity = np.dot(embeddings[0], embeddings[1]) / (np.linalg.norm(embeddings[0]) * np.linalg.norm(embeddings[1]))
    return float(similarity)

def calculate_skill_match(resume_skills: List[str], job_skills: List[str]) -> Tuple[float, List[str]]:
    """Calculate skill match percentage and matched skills."""
    if not job_skills:
        return 0.0, []
    
    matched = [skill for skill in resume_skills if skill.lower() in [s.lower() for s in job_skills]]
    match_percentage = (len(matched) / len(job_skills)) * 100
    
    return match_percentage, matched

def score_resume(resume_data: Dict, job_data: Dict) -> Dict:
    """Score a resume against a job description."""
    
    # Skill matching (40% weight)
    skill_match_percentage, matched_skills = calculate_skill_match(
        resume_data['skills'], 
        job_data['skills']
    )
    skill_score = skill_match_percentage / 100 * 0.4
    
    # Experience similarity (30% weight)
    experience_text = resume_data['sections'].get('experience', '')
    jd_text = job_data['full_text']
    experience_similarity = calculate_semantic_similarity(experience_text, jd_text)
    experience_score = max(0, experience_similarity) * 0.3
    
    # Education similarity (10% weight)
    education_text = resume_data['sections'].get('education', '')
    education_similarity = calculate_semantic_similarity(education_text, jd_text)
    education_score = max(0, education_similarity) * 0.1
    
    # Overall text similarity (20% weight)
    full_text_similarity = calculate_semantic_similarity(
        resume_data['full_text'], 
        job_data['full_text']
    )
    text_score = max(0, full_text_similarity) * 0.2
    
    # Calculate final score (0-100)
    final_score = (skill_score + experience_score + education_score + text_score) * 100
    
    return {
        'total_score': round(final_score, 2),
        'skill_match_percentage': round(skill_match_percentage, 2),
        'matched_skills': matched_skills,
        'skill_score': round(skill_score * 100, 2),
        'experience_score': round(experience_score * 100, 2),
        'education_score': round(education_score * 100, 2),
        'text_similarity_score': round(text_score * 100, 2)
    }
