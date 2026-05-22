import React, { useState } from 'react';
import JobForm from './components/JobForm';
import ResumeUpload from './components/ResumeUpload';
import ScreeningButton from './components/ScreeningButton';
import Results from './components/Results';
import LandingPage from './components/LandingPage';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedResumeIds, setSelectedResumeIds] = useState(new Set());
  const [refreshResults, setRefreshResults] = useState(0);
  const [showLanding, setShowLanding] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearMessage, setClearMessage] = useState('');

  const handleJobCreated = (jobId) => {
    setSelectedJobId(jobId);
  };

  const handleJobSelected = (jobId) => {
    setSelectedJobId(jobId);
    setSelectedResumeIds(new Set());
  };

  const handleScreeningComplete = () => {
    setRefreshResults(prev => prev + 1);
  };

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleClearDatabase = async () => {
    setIsClearing(true);
    try {
      const response = await axios.post('http://localhost:8000/api/clear-db');
      setClearMessage(`✅ ${response.data.message}\nCleared ${response.data.total_records_cleared} records from ${response.data.tables_cleared.length} tables`);
      
      // Reset app state
      setSelectedJobId(null);
      setSelectedResumeIds(new Set());
      setRefreshResults(prev => prev + 1);
      
      // Auto-close confirmation after 2 seconds
      setTimeout(() => {
        setShowClearConfirm(false);
        setClearMessage('');
      }, 2000);
    } catch (error) {
      setClearMessage(`❌ Error: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsClearing(false);
    }
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-top">
            <h1>🤖 AI-Powered Resume Screener</h1>
            <div className="header-buttons">
              <button className="back-btn" onClick={() => setShowLanding(true)} title="Back to home">
                ← Home
              </button>
              <button 
                className="admin-btn" 
                onClick={() => setShowClearConfirm(true)}
                title="Clear database (admin)"
              >
                🗑️ Clear DB
              </button>
            </div>
          </div>
          <p>Automate recruitment with intelligent resume ranking</p>
        </div>
      </header>

      {/* Clear Database Confirmation Dialog */}
      {showClearConfirm && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <h2>⚠️ Clear Database?</h2>
            <p>This will permanently delete all jobs, resumes, and screening results.</p>
            <p><strong>This action cannot be undone!</strong></p>
            {clearMessage && (
              <div className={`message ${clearMessage.includes('✅') ? 'success' : 'error'}`}>
                {clearMessage}
              </div>
            )}
            <div className="modal-buttons">
              <button 
                className="btn-cancel"
                onClick={() => {
                  setShowClearConfirm(false);
                  setClearMessage('');
                }}
                disabled={isClearing}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={handleClearDatabase}
                disabled={isClearing}
              >
                {isClearing ? 'Clearing...' : 'Yes, Clear Database'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="app-main">
        <div className="container">
          {/* Job and Resumes Setup Section */}
          <section className="setup-section">
            <h2 className="section-title">Setup</h2>
            <JobForm 
              onJobCreated={handleJobCreated}
              onJobSelected={handleJobSelected}
            />
            <ResumeUpload 
              selectedJobId={selectedJobId}
              onResumesUploaded={() => {}}
            />
          </section>

          {/* Screening and Results Section */}
          <section className="screening-section">
            <h2 className="section-title">Screening</h2>
            <ScreeningButton
              jobId={selectedJobId}
              resumeIds={selectedResumeIds}
              onScreeningComplete={handleScreeningComplete}
            />
            <Results 
              jobId={selectedJobId}
              triggerRefresh={refreshResults}
            />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>AI Resume Screener v1.0 | Powered by Python, BERT, and FastAPI</p>
      </footer>
    </div>
  );
}

export default App;
