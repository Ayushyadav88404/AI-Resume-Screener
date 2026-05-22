import React, { useState } from 'react';
import axios from 'axios';
import './ScreeningButton.css';

const ScreeningButton = ({ jobId, resumeIds, onScreeningComplete }) => {
  const [loading, setLoading] = useState(false);
  const [screeningResult, setScreeningResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleScreen = async () => {
    if (!jobId) {
      alert('Please select a job first');
      return;
    }

    setLoading(true);
    setShowResult(false);

    try {
      const response = await axios.post('/api/screen', {
        job_id: jobId,
        resume_ids: resumeIds && resumeIds.length > 0 ? Array.from(resumeIds) : null
      });

      if (response.data.success) {
        setScreeningResult(response.data);
        setShowResult(true);
        onScreeningComplete();
      }
    } catch (error) {
      alert('Error screening resumes: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screening-section">
      <button 
        className="screen-btn"
        onClick={handleScreen}
        disabled={loading || !jobId}
      >
        {loading ? '⏳ Screening...' : '🚀 Start Screening'}
      </button>

      {showResult && screeningResult && (
        <div className="screening-modal-overlay" onClick={() => setShowResult(false)}>
          <div className="screening-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Screening Complete!</h3>
              <button className="close-btn" onClick={() => setShowResult(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="result-summary">
                <div className="summary-item">
                  <span className="label">Job Title:</span>
                  <span className="value">{screeningResult.job_title}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Resumes Screened:</span>
                  <span className="value">{screeningResult.total_resumes_scored}</span>
                </div>
              </div>

              <div className="top-matches">
                <h4>Top 3 Matches</h4>
                {screeningResult.results.slice(0, 3).map((result, idx) => (
                  <div key={idx} className="match-row">
                    <span className="match-rank">#{idx + 1}</span>
                    <span className="match-name">{result.filename}</span>
                    <span className="match-score" style={{ 
                      color: result.score >= 80 ? '#4CAF50' : result.score >= 60 ? '#FF9800' : '#d32f2f'
                    }}>
                      {result.score.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                className="view-all-btn"
                onClick={() => setShowResult(false)}
              >
                View All Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreeningButton;
