import React, { useState } from 'react';
import API_URL from "../config/api";
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../../components/Icon';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'admin') navigate('/admin');
        else if (data.user.role === 'client') navigate('/client');
        else if (data.user.role === 'assistant') navigate('/assistant');
        else navigate('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error: Please check your connection');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: 'shield',
      title: 'Enterprise-Grade Security',
      description: 'Multi-factor authentication and encrypted connections protect your data.'
    },
    {
      icon: 'clock',
      title: '24/7 Access',
      description: 'Monitor progress and communicate with your team anytime, anywhere.'
    },
    {
      icon: 'headset',
      title: 'Support Available',
      description: 'Need assistance? Our team is ready to help you navigate the platform.'
    }
  ];

  const stats = [
    { value: '1,200+', label: 'Active Clients' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Platform Uptime' }
  ];

  return (
    <div className="portal-auth-page">
      <div className="portal-auth-container">
        {/* Left Side - Dark Branding Panel */}
        <div className="portal-auth-branding">
          <div className="portal-auth-brand-content">
            <div className="portal-auth-logo-container">
              <div className="portal-auth-logo-icon">
                <Icon name="headset" size={28} color="#ffffff" />
              </div>
              <div className="portal-auth-logo-text">
                <span className="portal-auth-logo-mil">MIL</span>
                <span className="portal-auth-logo-assist">ASSIST</span>
              </div>
            </div>

            <h1 className="portal-auth-headline">
              Welcome Back to<br />Your Operations Hub
            </h1>

            <p className="portal-auth-description">
              Access your secure client portal to manage tasks,
              communicate with your assistant, and track all
              ongoing projects.
            </p>

            <div className="portal-auth-features">
              {features.map((feature, index) => (
                <div key={index} className="portal-auth-feature">
                  <div className="portal-auth-feature-icon">
                    <Icon name={feature.icon} size={20} />
                  </div>
                  <div className="portal-auth-feature-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="portal-auth-stats">
              {stats.map((stat, index) => (
                <div key={index} className="portal-auth-stat">
                  <span className="portal-auth-stat-value">{stat.value}</span>
                  <span className="portal-auth-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="portal-auth-form-section">
          <div className="portal-auth-form-wrapper">
            <Link to="/" className="portal-back-link">
              <Icon name="arrowLeft" size={16} />
              Back to Home
            </Link>

            <div className="portal-auth-header">
              <h2>Sign In to Your Account</h2>
              <p>Enter your credentials to access your secure portal</p>
            </div>

            {error && (
              <div className="portal-auth-error">
                <Icon name="warning" size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="portal-auth-form">
              <div className="portal-form-group">
                <label htmlFor="email">Email Address</label>
                <div className="portal-input-wrapper">
                  <span className="portal-input-icon">
                    <Icon name="email" size={18} />
                  </span>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div className="portal-form-group">
                <label htmlFor="password">Password</label>
                <div className="portal-input-wrapper">
                  <span className="portal-input-icon">
                    <Icon name="lock" size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="portal-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Icon name={showPassword ? 'eye' : 'eye'} size={18} />
                  </button>
                </div>
              </div>

              <div className="portal-form-options">
                <label className="portal-checkbox-label">
                  <input type="checkbox" />
                  <span className="portal-checkbox-custom"></span>
                  Remember me
                </label>
                <Link to="/forgot-password" className="portal-forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary portal-auth-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="portal-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="portal-auth-divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <div className="portal-social-auth">
              <button className="portal-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <button className="portal-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                  <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                  <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                  <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                </svg>
                Continue with Microsoft
              </button>
              <button className="portal-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            <p className="portal-auth-footer">
              Don't have an account?{' '}
              <Link to="/request-access" className="portal-auth-footer-link">Request Access</Link>
            </p>

            <div className="portal-auth-security">
              <span className="portal-security-badge">
                <Icon name="lock" size={14} />
                256-bit SSL Encryption
              </span>
              <span className="portal-security-badge">
                <Icon name="shield" size={14} />
                SOC 2 Compliant
              </span>
            </div>

            <div className="portal-auth-legal">
              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/contact">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
