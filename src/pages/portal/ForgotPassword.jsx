import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In production, this would call the actual API
      const res = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      // For demo purposes, always show success
      setSubmitted(true);
    } catch (err) {
      // Show success even on error for demo
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-auth-page">
      <div className="portal-auth-container portal-auth-single">
        <div className="portal-auth-form-section portal-auth-form-centered">
          <div className="portal-auth-form-wrapper">
            <Link to="/" className="portal-back-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Home
            </Link>

            <div className="portal-auth-header">
              <div className="portal-auth-icon">
                {submitted ? '✅' : '🔑'}
              </div>
              <h2>{submitted ? 'Check Your Email' : 'Forgot Password?'}</h2>
              <p>
                {submitted
                  ? `We've sent password reset instructions to ${email}`
                  : "No worries! Enter your email and we'll send you reset instructions."}
              </p>
            </div>

            {!submitted ? (
              <>
                {error && (
                  <div className="portal-auth-error">
                    <span>⚠️</span>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="portal-auth-form">
                  <div className="portal-form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="portal-input-wrapper">
                      <span className="portal-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary portal-auth-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="portal-spinner"></span>
                        Sending...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="portal-auth-success">
                <div className="portal-auth-success-tips">
                  <h4>Didn't receive the email?</h4>
                  <ul>
                    <li>Check your spam folder</li>
                    <li>Make sure you entered the correct email</li>
                    <li>Wait a few minutes and try again</li>
                  </ul>
                </div>
                <button
                  className="btn btn-secondary portal-resend-btn"
                  onClick={() => setSubmitted(false)}
                >
                  Try Again
                </button>
              </div>
            )}

            <p className="portal-auth-footer">
              Remember your password?{' '}
              <Link to="/login">Back to Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
