import React, { useState, useRef } from 'react';
import axios from 'axios';
import './ResumeUpload.css';

const ResumeUpload = ({ onResumesUploaded, selectedJobId }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [selectedResumes, setSelectedResumes] = useState(new Set());
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    for (const file of files) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 10 }));

        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/api/resumes', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success) {
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          
          setUploadedResumes(prev => [...prev, {
            id: response.data.resume_id,
            filename: response.data.filename,
            skills: response.data.skills_extracted
          }]);

          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[file.name];
              return newProgress;
            });
          }, 500);
        }
      } catch (error) {
        alert('Error uploading ' + file.name + ': ' + (error.response?.data?.detail || error.message));
      }
    }

    setUploading(false);
    setFileInputRef?.current?.value('');
    onResumesUploaded();
  };

  const handleSelectResume = (resumeId) => {
    setSelectedResumes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resumeId)) {
        newSet.delete(resumeId);
      } else {
        newSet.add(resumeId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedResumes.size === uploadedResumes.length && uploadedResumes.length > 0) {
      setSelectedResumes(new Set());
    } else {
      setSelectedResumes(new Set(uploadedResumes.map(r => r.id)));
    }
  };

  return (
    <div className="resume-upload-container">
      <h2>Upload Resumes</h2>

      <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.pdf,.docx"
          onChange={handleFileSelect}
          disabled={!selectedJobId}
          style={{ display: 'none' }}
        />
        <div className="upload-content">
          <div className="upload-icon">📄</div>
          <p>Click to upload or drag and drop</p>
          <small>TXT, PDF, DOCX files</small>
        </div>
      </div>

      {!selectedJobId && (
        <p className="warning">Please select a job posting first</p>
      )}

      {uploadProgress && Object.keys(uploadProgress).length > 0 && (
        <div className="upload-progress">
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="progress-item">
              <p>{filename}</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <span>{progress}%</span>
            </div>
          ))}
        </div>
      )}

      {uploadedResumes.length > 0 && (
        <div className="resumes-list">
          <div className="list-header">
            <h3>{uploadedResumes.length} Resumes Uploaded</h3>
            <button 
              className="select-all-btn"
              onClick={handleSelectAll}
            >
              {selectedResumes.size === uploadedResumes.length && uploadedResumes.length > 0
                ? 'Deselect All'
                : 'Select All'}
            </button>
          </div>

          <div className="resumes">
            {uploadedResumes.map(resume => (
              <div 
                key={resume.id} 
                className={`resume-item ${selectedResumes.has(resume.id) ? 'selected' : ''}`}
                onClick={() => handleSelectResume(resume.id)}
              >
                <div className="checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectedResumes.has(resume.id)}
                    readOnly
                  />
                </div>
                <div className="resume-info">
                  <h4>{resume.filename}</h4>
                  {resume.skills && resume.skills.length > 0 && (
                    <div className="skills-preview">
                      {resume.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-badge">{skill}</span>
                      ))}
                      {resume.skills.length > 3 && (
                        <span className="skill-badge">+{resume.skills.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
