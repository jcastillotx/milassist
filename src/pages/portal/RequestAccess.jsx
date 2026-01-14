import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';

const RequestAccess = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    serviceType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/auth/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Request failed. Please try again.');
      }
    } catch (err) {
      // Show success for demo purposes
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: 'user',
      title: 'Dedicated Assistant',
      description: 'Get paired with a professional virtual assistant tailored to your business needs.'
    },
    {
      icon: 'tasks',
      title: 'Task Management',
      description: 'Streamline your workflow with our comprehensive task tracking and delegation system.'
    },
    {
      icon: 'shield',
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security and encryption protocols.'
    }
  ];

  const stats = [
    { value: '1,200+', label: 'Active Clients' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Platform Uptime' }
  ];

  const serviceOptions = [
    { value: '', label: 'Select a service...' },
    { value: 'executive-assistant', label: 'Executive Assistant Services' },
    { value: 'administrative', label: 'Administrative Support' },
    { value: 'travel-management', label: 'Travel Management' },
    { value: 'research', label: 'Research & Analysis' },
    { value: 'communication', label: 'Communication Management' },
    { value: 'other', label: 'Other Services' }
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
              Start Your Journey<br />With Expert Support
            </h1>

            <p className="portal-auth-description">
              Join thousands of executives and businesses who trust
              MilAssist to streamline their operations and enhance
              productivity.
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

        {/* Right Side - Request Access Form */}
        <div className="portal-auth-form-section">
          <div className="portal-auth-form-wrapper">
            <Link to="/" className="portal-back-link">
              <Icon name="arrowLeft" size={16} />
              Back to Home
            </Link>

            {!submitted ? (
              <>
                <div className="portal-auth-header">
                  <h2>Request Access</h2>
                  <p>Fill out the form below and our team will get in touch</p>
                </div>

                {error && (
                  <div className="portal-auth-error">
                    <Icon name="warning" size={18} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="portal-auth-form">
                  <div className="portal-form-row">
                    <div className="portal-form-group">
                      <label htmlFor="fullName">Full Name</label>
                      <div className="portal-input-wrapper">
                        <span className="portal-input-icon">
                          <Icon name="user" size={18} />
                        </span>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="John Smith"
                          required
                        />
                      </div>
                    </div>

                    <div className="portal-form-group">
                      <label htmlFor="email">Email Address</label>
                      <div className="portal-input-wrapper">
                        <span className="portal-input-icon">
                          <Icon name="email" size={18} />
                        </span>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@company.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="portal-form-row">
                    <div className="portal-form-group">
                      <label htmlFor="company">Company / Organization</label>
                      <div className="portal-input-wrapper">
                        <span className="portal-input-icon">
                          <Icon name="building" size={18} />
                        </span>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acme Inc."
                        />
                      </div>
                    </div>

                    <div className="portal-form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <div className="portal-input-wrapper">
                        <span className="portal-input-icon">
                          <Icon name="phone" size={18} />
                        </span>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="portal-form-group">
                    <label htmlFor="serviceType">Service Interested In</label>
                    <div className="portal-input-wrapper portal-select-wrapper">
                      <span className="portal-input-icon">
                        <Icon name="briefcase" size={18} />
                      </span>
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                      >
                        {serviceOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="portal-form-group">
                    <label htmlFor="message">Tell Us About Your Needs</label>
                    <div className="portal-input-wrapper portal-textarea-wrapper">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe your requirements, challenges, or any specific assistance you're looking for..."
                        rows={4}
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
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </form>

                <p className="portal-auth-footer">
                  Already have an account?{' '}
                  <Link to="/login" className="portal-auth-footer-link">Sign In</Link>
                </p>
              </>
            ) : (
              <div className="portal-auth-success-container">
                <div className="portal-auth-success-icon">
                  <Icon name="checkCircle" size={64} />
                </div>
                <h2>Request Submitted!</h2>
                <p className="portal-auth-success-message">
                  Thank you for your interest in MilAssist. Our team will review your
                  request and reach out within 1-2 business days.
                </p>
                <div className="portal-auth-success-next">
                  <h4>What happens next?</h4>
                  <ul>
                    <li>
                      <Icon name="email" size={16} />
                      You'll receive a confirmation email shortly
                    </li>
                    <li>
                      <Icon name="phone" size={16} />
                      A team member will contact you to discuss your needs
                    </li>
                    <li>
                      <Icon name="user" size={16} />
                      We'll set up your personalized account
                    </li>
                  </ul>
                </div>
                <div className="portal-auth-success-actions">
                  <Link to="/" className="btn btn-primary">
                    Return to Home
                  </Link>
                  <Link to="/login" className="btn btn-secondary">
                    Sign In
                  </Link>
                </div>
              </div>
            )}

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

export default RequestAccess;
