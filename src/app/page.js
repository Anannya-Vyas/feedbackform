'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({ rating: '', feedback: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Track if the user has interacted with the rating to show the expanded form
  const [isExpanded, setIsExpanded] = useState(false);

  const ratings = [
    { value: 'bad', label: 'Bad', emoji: '😞' },
    { value: 'decent', label: 'Decent', emoji: '😊' },
    { value: 'love_it', label: 'Love it', emoji: '😍', className: 'love-it' },
  ];

  const handleRatingClick = (value) => {
    setFormData(prev => ({ ...prev, rating: value }));
    setErrorMessage('');

    // Automatically expand the form when a rating is selected for the first time
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rating) {
      setErrorMessage('Please select a rating before submitting.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit feedback');
      }

      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({ rating: '', feedback: '' });
    setStatus('idle');
    setIsExpanded(false);
  };

  return (
    <main>
      <img src="/unicorn.svg" alt="Magical Decoration" className="decoration" />
      <div className="container">

        {/* The entire card is wrapped here. Height will naturally adjust based on contents */}
        <div className={`form-card ${isExpanded ? 'state-expanded' : 'state-initial'}`}>

          {status === 'success' ? (
            /* BOX 3: Success Screen */
            <div className="success-screen">
              <div className="success-icon">
                {/* Magical star/sparkle icon */}
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                </svg>
              </div>
              <h2>Thank you ✨</h2>
              <p>Your magical feedback helps us improve. We appreciate the time you took to send this to us!</p>
              <button className="submit-btn" onClick={handleReset}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              {/* BOX 1: Initial State (Always visible until success) */}
              <div className="header-section">
                <h1>Rate your experience</h1>
                <button type="button" className="close-btn" onClick={handleReset} title="Reset">✕</button>
              </div>

              {status === 'error' && <div className="error-message">{errorMessage}</div>}

              <div className="rating-section">
                <div className="ratings-group">
                  {ratings.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`rating-btn ${formData.rating === opt.value ? 'active' : ''} ${opt.className || ''}`}
                      onClick={() => handleRatingClick(opt.value)}
                    >
                      <span className="emoji">{opt.emoji}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* BOX 2: Expanded State (Hidden initially) */}
              {isExpanded && (
                <div className="expanded-form">
                  <textarea
                    id="feedback"
                    name="feedback"
                    placeholder="Tell us more (optional)..."
                    value={formData.feedback}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                  />

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? <div className="spinner"></div> : 'Submit your feedback'}
                  </button>
                </div>
              )}
            </form>
          )}

        </div>
      </div>
    </main>
  );
}
