# 🚀 Deployment Guide

Complete guide to deploying the AI Resume Screener to production.

---

## Deployment Options

- Docker (Recommended)
- AWS (EC2, ECS, Lambda)
- Heroku
- DigitalOcean
- VPS
- Google Cloud
- Azure

---

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations done
- [ ] Security settings enabled
- [ ] Error logging configured
- [ ] Backups configured
- [ ] Load testing completed
- [ ] Documentation updated

---

## Option 1: Docker Deployment

### Create Dockerfile

**`backend/Dockerfile`:**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm

COPY app/ ./app/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**`frontend/Dockerfile`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]
```

### Docker Compose

**`docker-compose.yml`:**

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=/data/resume_screener.db
      - FASTAPI_ENV=production
    volumes:
      - ./data:/data

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:8000
```

### Deploy

```bash
docker-compose up -d
```

---

## Option 2: AWS Deployment

### EC2 Instance

**1. Launch Instance**
- Ubuntu 22.04 LTS
- t3.medium or larger
- Security group allowing ports 80, 443, 8000

**2. Connect & Setup**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python & Node
sudo apt install -y python3.11 python3-venv nodejs npm

# Install dependencies
sudo apt install -y git supervisor nginx
```

**3. Clone & Setup**

```bash
cd /home/ubuntu
git clone https://github.com/yourname/resume-screener.git
cd resume-screener

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Frontend
cd ../frontend
npm install
npm run build
```

**4. Configure Supervisor**

Create `/etc/supervisor/conf.d/resumescreen.conf`:

```ini
[program:resumescreen]
directory=/home/ubuntu/resume-screener/backend
command=/home/ubuntu/resume-screener/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
autostart=true
autorestart=true
user=ubuntu
```

Start service:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start resumescreen
```

**5. Configure Nginx**

Create `/etc/nginx/sites-available/resumescreen`:

```nginx
upstream backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name your-domain.com;
    client_max_body_size 25M;

    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /home/ubuntu/resume-screener/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/resumescreen /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**6. SSL Certificate (Let's Encrypt)**

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### ECS Deployment

**1. Create ECR Repository**

```bash
aws ecr create-repository --repository-name resume-screener
```

**2. Build & Push Images**

```bash
# Backend
docker build -t resume-screener-backend ./backend
aws ecr get-login-password | docker login --username AWS --password-stdin YOUR_ECR_URI
docker tag resume-screener-backend:latest YOUR_ECR_URI/resume-screener-backend:latest
docker push YOUR_ECR_URI/resume-screener-backend:latest

# Frontend
docker build -t resume-screener-frontend ./frontend
docker tag resume-screener-frontend:latest YOUR_ECR_URI/resume-screener-frontend:latest
docker push YOUR_ECR_URI/resume-screener-frontend:latest
```

**3. Create ECS Task Definition**

**4. Create ECS Service**

---

## Option 3: Heroku Deployment

### Setup

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create your-app-name
```

### Procfile

```procfile
web: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
release: cd backend && python -m spacy download en_core_web_sm
```

### Deploy

```bash
git push heroku main
```

### Database

```bash
heroku addons:create heroku-postgresql:standard-0
```

---

## Option 4: DigitalOcean Deployment

### Setup Droplet

```bash
# 1. Create Droplet (Ubuntu 22.04, 4GB RAM)
# 2. SSH into droplet
ssh root@your_ip

# 3. Install dependencies
apt update && apt install -y python3.11 python3-venv nodejs npm git supervisor nginx
```

Follow similar steps as AWS EC2 above.

### App Platform

Alternatively, use DigitalOcean App Platform:
- Connect GitHub repo
- DigitalOcean detects configuration
- Auto-deploys on push

---

## Database Considerations

### SQLite (Current)

**Pros:**
- No setup required
- Good for development
- File-based

**Cons:**
- Limited concurrency
- Single file storage
- Not ideal for scale

### Migrate to PostgreSQL

**1. Install PostgreSQL**

```bash
sudo apt install -y postgresql postgresql-contrib
```

**2. Create Database**

```sql
createdb resume_screener
```

**3. Update Connection String**

```env
DATABASE_URL=postgresql://user:password@localhost/resume_screener
```

**4. Update Code**

```python
import psycopg2
# Use psycopg2 instead of sqlite3
```

---

## Security Checklist

### SSL/TLS
- [ ] Use HTTPS everywhere
- [ ] Valid SSL certificate
- [ ] HSTS headers

### Environment Variables
- [ ] No secrets in code
- [ ] Use environment variables
- [ ] .env in .gitignore

### Database
- [ ] Use connection pooling
- [ ] Encrypt sensitive data
- [ ] Regular backups
- [ ] SQL injection prevention

### API Security
- [ ] Add authentication
- [ ] Add rate limiting
- [ ] CORS configured
- [ ] Input validation
- [ ] Error handling

### Infrastructure
- [ ] Firewall configured
- [ ] SSH key authentication
- [ ] No root login
- [ ] Log monitoring

---

## Performance Optimization

### Caching

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_cached_skills(job_description):
    return extract_skills(job_description)
```

### Database Indexing

```sql
CREATE INDEX idx_job_id ON resumes(job_id);
CREATE INDEX idx_created_at ON jobs(created_at);
```

### Load Balancing

```nginx
upstream backend {
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}
```

### CDN

Deploy static files (frontend build) to CDN:
- Cloudflare
- AWS CloudFront
- Akamai

---

## Monitoring & Logging

### Application Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/resumescreen.log'),
        logging.StreamHandler()
    ]
)
```

### Log Aggregation

- ELK Stack (Elasticsearch, Logstash, Kibana)
- CloudWatch (AWS)
- Stackdriver (Google Cloud)
- Datadog

### Monitoring Tools

- Prometheus + Grafana
- New Relic
- Datadog
- CloudWatch

---

## Backup Strategy

### Database Backups

**Daily backups:**

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
sqlite3 /data/resume_screener.db ".backup /backups/resume_screener_$DATE.db"

# Keep only last 30 days
find /backups -name "resume_screener_*.db" -mtime +30 -delete
```

**Schedule with cron:**

```bash
0 2 * * * /home/ubuntu/backup.sh
```

### Cloud Backup

- AWS S3
- Google Cloud Storage
- Backblaze

---

## Disaster Recovery

### RTO & RPO

- **RTO** (Recovery Time Objective): Max 1 hour
- **RPO** (Recovery Point Objective): Max 6 hours

### Recovery Plan

1. Restore from latest backup
2. Verify data integrity
3. Sync with replicas
4. Test in staging
5. Deploy to production

---

## Scaling Strategy

### Vertical Scaling
- Increase server size
- More CPU/RAM
- Simpler, limited growth

### Horizontal Scaling
- Add more servers
- Load balancing
- Database replication
- Better for growth

### Auto-scaling

```yaml
# AWS example
AutoScalingGroup:
  MinSize: 2
  MaxSize: 10
  DesiredCapacity: 3
  ScalingPolicy:
    TargetCPU: 70%
```

---

## Cost Optimization

- Use spot instances (33% cheaper)
- Reserved instances for baseline
- Optimize database queries
- Compress assets
- Use CDN for static files
- Auto-scaling

---

## Maintenance

### Regular Updates

```bash
# Security updates
sudo apt update && sudo apt upgrade -y

# Python packages
pip install --upgrade pip
pip list --outdated
```

### Database Maintenance

```sql
VACUUM;  -- SQLite
ANALYZE; -- Optimize queries
```

---

## Support & Documentation

- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [Docker Documentation](https://docs.docker.com/)

---

**Last Updated:** May 22, 2026
