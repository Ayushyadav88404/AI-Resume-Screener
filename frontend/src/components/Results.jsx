import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Results.css';

const Results = ({ jobId, triggerRefresh }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedResult, setExpandedResult] = useState(null);
  const [sortBy, setSortBy] = useState('score');

  useEffect(() => {
    if (jobId) {
      fetchResults();
    }
  }, [jobId, triggerRefresh]);

  const fetchResults = async () => {
    if (!jobId) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/rankings/${jobId}`);
      if (response.data.success) {
        setResults(response.data.rankings || []);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortResults = (resultsToSort) => {
    const sorted = [...resultsToSort];
    if (sortBy === 'score') {
      sorted.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'match') {
      sorted.sort((a, b) => b.match_percentage - a.match_percentage);
    } else if (sortBy === 'date') {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return sorted;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    if (score >= 40) return '#FF6B6B';
    return '#d32f2f';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const sortedResults = sortResults(results);

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Screening Results</h2>
        {results.length > 0 && (
          <div className="results-stats">
            <span className="stat">Total: {results.length}</span>
            <span className="stat">
              Excellent: {results.filter(r => r.score >= 80).length}
            </span>
            <span className="stat">
              Good: {results.filter(r => r.score >= 60 && r.score < 80).length}
            </span>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="sort-controls">
          <label htmlFor="sort-by">Sort by:</label>
          <select 
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="score">Overall Score</option>
            <option value="match">Skill Match %</option>
            <option value="date">Most Recent</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading results...</div>
      ) : results.length === 0 ? (
        <div className="no-results">
          <p>No screening results yet. Screen some resumes to see results.</p>
        </div>
      ) : (
        <div className="results-list">
          {sortedResults.map((result, index) => (
            <div key={result.id} className="result-card">
              <div className="result-header" onClick={() => setExpandedResult(expandedResult === result.id ? null : result.id)}>
                <div className="rank-and-name">
                  <span className="rank">#{index + 1}</span>
                  <h3>{result.filename}</h3>
                </div>
                <div className="score-display" style={{ borderColor: getScoreColor(result.score) }}>
                  <div className="score-value" style={{ color: getScoreColor(result.score) }}>
                    {result.score.toFixed(1)}
                  </div>
                  <div className="score-label">{getScoreLabel(result.score)}</div>
                </div>
              </div>

              {expandedResult === result.id && (
                <div className="result-details">
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Skill Match</label>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${result.match_percentage || 0}%` }}
                        ></div>
                      </div>
                      <span>{(result.match_percentage || 0).toFixed(1)}%</span>
                    </div>

                    {result.matched_skills && (
                      <div className="detail-item full-width">
                        <label>Matched Skills</label>
                        <div className="skills">
                          {result.matched_skills.split(',').map((skill, idx) => (
                            <span key={idx} className="skill-match-tag">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="detail-item">
                      <label>Overall Score</label>
                      <div className="score-breakdown">
                        {result.score.toFixed(1)}/100
                      </div>
                    </div>

                    <div className="detail-item">
                      <label>Date Screened</label>
                      <p>{new Date(result.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <button className="export-btn">📥 Export Details</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;
