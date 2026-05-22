import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobForm.css';

const JobForm = ({ onJobCreated, onJobSelected }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs');
      if (response.data.success) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/jobs', formData);
      if (response.data.success) {
        alert('Job created successfully!');
        setFormData({ title: '', description: '', requirements: '' });
        fetchJobs();
        onJobCreated(response.data.job_id);
      }
    } catch (error) {
      alert('Error creating job: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    onJobSelected(job.id);
  };

  return (
    <div className="job-form-container">
      <div className="form-section">
        <h2>Create Job Posting</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Senior Python Developer"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Enter full job description including responsibilities and requirements..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Additional Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="3"
              placeholder="Optional: List specific requirements or qualifications..."
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </form>
      </div>

      <div className="jobs-list-section">
        <h2>Available Jobs</h2>
        <div className="jobs-list">
          {jobs.length === 0 ? (
            <p className="no-jobs">No jobs created yet</p>
          ) : (
            jobs.map(job => (
              <div 
                key={job.id} 
                className={`job-card ${selectedJob?.id === job.id ? 'selected' : ''}`}
                onClick={() => handleSelectJob(job)}
              >
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <button 
                    className="expand-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedJob(expandedJob === job.id ? null : job.id);
                    }}
                  >
                    {expandedJob === job.id ? '−' : '+'}
                  </button>
                </div>
                
                {expandedJob === job.id && (
                  <div className="job-details">
                    <p className="description">{job.description.slice(0, 200)}...</p>
                    {job.skills && (
                      <div className="skills">
                        <strong>Extracted Skills:</strong>
                        <div className="skills-list">
                          {JSON.parse(job.skills).slice(0, 5).map((skill, idx) => (
                            <span key={idx} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobForm;
