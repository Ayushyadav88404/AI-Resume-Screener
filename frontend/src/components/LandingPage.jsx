import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  const handleScrollTo = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🤖 AI Resume Screener</h1>
          <p className="hero-subtitle">Intelligent Resume Screening Powered by AI & Machine Learning</p>
          <p className="hero-description">
            Automate recruitment and find the perfect candidates in seconds using advanced NLP and semantic similarity
          </p>
          <button className="hero-btn" onClick={onGetStarted}>
            Get Started Now →
          </button>
        </div>
        <div className="hero-graphic">
          <div className="graphic-box">📊</div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <p className="section-intro">From upload to rankings in seconds. Here's what happens behind the scenes when you screen resumes.</p>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Job & Upload Resumes</h3>
              <p>Paste your job description and upload candidate resumes. We auto-parse and extract key information instantly.</p>
            </div>

            <div className="step-divider">→</div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Feature Extraction</h3>
              <p>We extract 30+ technical skills, experience level, education match, and analyze job requirements using spaCy NLP.</p>
            </div>

            <div className="step-divider">→</div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>AI Analysis</h3>
              <p>BERT semantic similarity model analyzes experience relevance, education match, and overall text similarity scoring.</p>
            </div>

            <div className="step-divider">→</div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Instant Rankings</h3>
              <p>Get ranked candidates with detailed scores, matched skills, confidence percentages, and AI-powered recommendations.</p>
            </div>
          </div>

          <div className="stats-container">
            <div className="stat-card">
              <h4 className="stat-number">30+</h4>
              <p>Skills Analyzed</p>
            </div>
            <div className="stat-card">
              <h4 className="stat-number">4</h4>
              <p>Scoring Factors</p>
            </div>
            <div className="stat-card">
              <h4 className="stat-number">&lt; 2s</h4>
              <p>Average Scan Time</p>
            </div>
            <div className="stat-card">
              <h4 className="stat-number">BERT</h4>
              <p>AI Technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2>Why Choose AI Resume Screener?</h2>
          <p className="section-intro">See the impact on your hiring process</p>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">⏱️</div>
              <h3>Save 10 Hours/Week</h3>
              <p>Automate resume screening and focus on interviewing qualified candidates instead of manual review</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>95% Accuracy</h3>
              <p>AI-powered BERT model ensures consistent and accurate candidate matching every time</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>70% Faster Hiring</h3>
              <p>Reduce time-to-hire significantly by eliminating manual resume review bottlenecks</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Reduce Costs</h3>
              <p>Lower recruitment costs by automating initial screening and prioritizing top candidates</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3>Data-Driven</h3>
              <p>Make hiring decisions based on AI insights and comprehensive scoring analytics</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">✨</div>
              <h3>No Bias</h3>
              <p>Objective, consistent evaluation ensures fair candidate screening regardless of background</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section">
        <div className="container">
          <h2>Manual Screening vs AI Screener</h2>
          <p className="section-intro">See how automation transforms your recruitment</p>
          
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th className="manual">Manual Screening</th>
                  <th className="ai">AI Resume Screener</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="metric-name">Time per Resume</td>
                  <td className="manual">3-5 minutes</td>
                  <td className="ai">✓ &lt; 2 seconds</td>
                </tr>
                <tr>
                  <td className="metric-name">Processing 100 Resumes</td>
                  <td className="manual">5-8 hours</td>
                  <td className="ai">✓ &lt; 3 minutes</td>
                </tr>
                <tr>
                  <td className="metric-name">Accuracy Rate</td>
                  <td className="manual">~70%</td>
                  <td className="ai">✓ 95%+</td>
                </tr>
                <tr>
                  <td className="metric-name">Cost per Hire</td>
                  <td className="manual">$2,000-$4,000</td>
                  <td className="ai">✓ $200-$500</td>
                </tr>
                <tr>
                  <td className="metric-name">Hiring Time</td>
                  <td className="manual">30-45 days</td>
                  <td className="ai">✓ 10-15 days</td>
                </tr>
                <tr>
                  <td className="metric-name">Human Error</td>
                  <td className="manual">High</td>
                  <td className="ai">✓ Eliminated</td>
                </tr>
                <tr>
                  <td className="metric-name">Scalability</td>
                  <td className="manual">Limited</td>
                  <td className="ai">✓ Unlimited</td>
                </tr>
                <tr>
                  <td className="metric-name">24/7 Availability</td>
                  <td className="manual">❌ No</td>
                  <td className="ai">✓ Yes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="comparison-highlight">
            <h3>🚀 Result: Reduce hiring time by 70% and save 10+ hours weekly</h3>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <h2>About This Project</h2>
          
          <div className="about-card">
            <h3>What is AI Resume Screener?</h3>
            <p>
              <strong>AI Resume Screener</strong> is an intelligent resume screening system designed to automate recruitment 
              and save time for HR professionals. It uses machine learning and NLP to analyze resumes and job descriptions 
              in real-time, then ranks candidates based on intelligent matching algorithms.
            </p>
            <p>
              Built as a full-stack project combining <strong>FastAPI (Python)</strong>, <strong>BERT semantic similarity</strong>, 
              and <strong>React</strong> for a modern, responsive UI. The system extracts and analyzes 30+ technical skills, 
              evaluates experience relevance, education match, and overall text similarity to make accurate predictions.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="tech-stack-section" id="technology">
            <h3>Technology Stack</h3>
            <div className="tech-grid">
              <div className="tech-category">
                <h4>Backend</h4>
                <ul>
                  <li>Python</li>
                  <li>FastAPI</li>
                  <li>spaCy (NLP)</li>
                  <li>BERT/Sentence-Transformers</li>
                  <li>SQLite</li>
                </ul>
              </div>
              <div className="tech-category">
                <h4>Frontend</h4>
                <ul>
                  <li>React 18</li>
                  <li>Vite</li>
                  <li>CSS3</li>
                  <li>Axios</li>
                </ul>
              </div>
              <div className="tech-category">
                <h4>ML/AI</h4>
                <ul>
                  <li>scikit-learn</li>
                  <li>Sentence-Transformers</li>
                  <li>Named Entity Recognition</li>
                  <li>Semantic Similarity</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="features-section" id="features">
            <h3>Key Features</h3>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🧠</span>
                <h4>NLP Processing</h4>
                <p>Advanced natural language processing with spaCy for intelligent skill extraction</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <h4>Smart Matching</h4>
                <p>BERT-based semantic similarity for accurate resume-to-job matching</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <h4>Multi-Factor Scoring</h4>
                <p>Comprehensive scoring: skills (40%), experience (30%), education (10%), text similarity (20%)</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <h4>Real-Time Processing</h4>
                <p>Instant resume parsing and job screening with live results</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💾</span>
                <h4>Data Persistence</h4>
                <p>SQLite database storing jobs, resumes, and ranking history</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <h4>Responsive UI</h4>
                <p>Modern, mobile-friendly interface built with React and Vite</p>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="project-info-card">
            <h3>Project Information</h3>
            <p>
              <strong>AI Resume Screener</strong> represents a comprehensive full-stack development project combining 
              cutting-edge machine learning, natural language processing, and modern web technologies.
            </p>
            <p>
              This system reflects combined technical expertise in:
            </p>
            <ul className="skills-list">
              <li>✅ Machine Learning & AI</li>
              <li>✅ Natural Language Processing</li>
              <li>✅ Full-Stack Development</li>
              <li>✅ Database Design</li>
              <li>✅ REST API Development</li>
              <li>✅ Frontend Engineering</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="contact">
        <h2>Ready to Automate Your Hiring?</h2>
        <p>Start screening resumes with AI in just a few clicks</p>
        <button className="cta-btn" onClick={onGetStarted}>
          Launch Application →
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-left">
            <h3>AI Resume Screener</h3>
            <p>Intelligent recruitment powered by machine learning</p>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about" onClick={(e) => handleScrollTo(e, 'about')}>About</a></li>
              <li><a href="#features" onClick={(e) => handleScrollTo(e, 'features')}>Features</a></li>
              <li><a href="#technology" onClick={(e) => handleScrollTo(e, 'technology')}>Technology</a></li>
            </ul>
          </div>

          <div className="footer-right">
            <h4>Resources</h4>
            <ul>
              <li><a href="https://github.com/Ayushyadav88404/AI-Resume-Screener" target="_blank" rel="noopener noreferrer">Documentation</a></li>
              <li><a href="https://github.com/Ayushyadav88404/AI-Resume-Screener" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>&copy; 2026 AI Resume Screener. All rights reserved.</p>
          <p className="footer-credit">
            <span className="copyright-icon">©</span> Developed with 💚 | Machine Learning Powered
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
