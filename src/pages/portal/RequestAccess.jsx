import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../../components/Icon';

const RequestAccess = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    serviceBranch: '',
    rank: '',
    location: '',
    needs: '',
    timeline: '',
    referral: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement actual API call to submit request
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitted(true);

      // In a real implementation, this would send to an API endpoint
      console.log('Access request submitted:', formData);

    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="portal-auth-page">
        <div className="portal-auth-container">
          {/* Left Side - Success Message */}
          <div className="portal-auth-branding">
            <div className="portal-auth-brand-content">
              <div className="portal-auth-logo-container">
                <div className="portal-auth-logo-icon">
                  <Icon name="checkCircle" size={28} color="#10B981" />
                </div>
                <div className="portal-auth-logo-text">
                  <span className="portal-auth-logo-mil">MIL</span>
                  <span className="portal-auth-logo-assist">ASSIST</span>
                </div>
              </div>

              <h1 className="portal-auth-headline">
                Request Submitted<br />Successfully!
              </h1>

              <p className="portal-auth-description">
                Thank you for your interest in MilAssist. Our team will review
                your request and get back to you within 24-48 hours with next steps.
              </p>

              <div className="portal-auth-features">
                <div className="portal-auth-feature">
                  <div className="portal-auth-feature-icon">
                    <Icon name="email" size={20} />
                  </div>
                  <div className="portal-auth-feature-content">
                    <h4>Check Your Email</h4>
                    <p>We'll send confirmation and next steps to {formData.email}</p>
                  </div>
                </div>
                <div className="portal-auth-feature">
                  <div className="portal-auth-feature-icon">
                    <Icon name="clock" size={20} />
                  </div>
                  <div className="portal-auth-feature-content">
                    <h4>Response Time</h4>
                    <p>Expect to hear from us within 24-48 business hours</p>
                  </div>
                </div>
                <div className="portal-auth-feature">
                  <div className="portal-auth-feature-icon">
                    <Icon name="headset" size={20} />
                  </div>
                  <div className="portal-auth-feature-content">
                    <h4>Questions?</h4>
                    <p>Contact our support team if you need immediate assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Next Steps */}
          <div className="portal-auth-form-section">
            <div className="portal-auth-form-wrapper">
              <Link to="/" className="portal-back-link">
                <Icon name="arrowLeft" size={16} />
                Back to Home
              </Link>

              <div className="portal-auth-header">
                <h2>What Happens Next?</h2>
                <p>Here's what to expect after submitting your request</p>
              </div>

              <div className="portal-success-steps">
                <div className="portal-success-step">
                  <div className="portal-step-number">1</div>
                  <div className="portal-step-content">
                    <h4>Review Process</h4>
                    <p>Our team reviews your information and verifies eligibility</p>
                  </div>
                </div>
                <div className="portal-success-step">
                  <div className="portal-step-number">2</div>
                  <div className="portal-step-content">
                    <h4>Account Setup</h4>
                    <p>We create your secure account and set up your profile</p>
                  </div>
                </div>
                <div className="portal-success-step">
                  <div className="portal-step-number">3</div>
                  <div className="portal-step-content">
                    <h4>Assistant Assignment</h4>
                    <p>You'll be matched with a dedicated assistant within 24 hours</p>
                  </div>
                </div>
                <div className="portal-success-step">
                  <div className="portal-step-number">4</div>
                  <div className="portal-step-content">
                    <h4>Welcome Call</h4>
                    <p>Schedule an introductory call to discuss your specific needs</p>
                  </div>
                </div>
              </div>

              <div className="portal-success-actions">
                <Link to="/" className="btn btn-secondary">
                  Return to Home
                </Link>
                <Link to="/contact" className="btn btn-primary">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-auth-page">
      <div className="portal-auth-container">
        {/* Left Side - Branding Panel */}
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
              Request Access to<br />MilAssist Platform
            </h1>

            <p className="portal-auth-description">
              Join thousands of military families who trust MilAssist
              to handle their administrative and personal support needs.
            </p>

            <div className="portal-auth-features">
              <div className="portal-auth-feature">
                <div className="portal-auth-feature-icon">
                  <Icon name="shield" size={20} />
                </div>
                <div className="portal-auth-feature-content">
                  <h4>Military-Focused</h4>
                  <p>Designed specifically for active duty, veterans, and their families</p>
                </div>
              </div>
              <div className="portal-auth-feature">
                <div className="portal-auth-feature-icon">
                  <Icon name="clock" size={20} />
                </div>
                <div className="portal-auth-feature-content">
                  <h4>24/7 Support</h4>
                  <p>Round-the-clock assistance for urgent and routine needs</p>
                </div>
              </div>
              <div className="portal-auth-feature">
                <div className="portal-auth-feature-icon">
                  <Icon name="users" size={20} />
                </div>
                <div className="portal-auth-feature-content">
                  <h4>Dedicated Team</h4>
                  <p>Personal assistant assigned to understand your unique situation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Request Form */}
        <div className="portal-auth-form-section">
          <div className="portal-auth-form-wrapper">
            <Link to="/" className="portal-back-link">
              <Icon name="arrowLeft" size={16} />
              Back to Home
            </Link>

            <div className="portal-auth-header">
              <h2>Request Platform Access</h2>
              <p>Tell us about yourself and we'll get you set up</p>
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
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="portal-form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="portal-form-row">
                <div className="portal-form-group">
                  <label htmlFor="email">Email Address *</label>
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
                      placeholder="john.doe@email.com"
                      required
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
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="portal-form-group">
                <label htmlFor="organization">Organization/Unit</label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="e.g., 1st Infantry Division, Naval Base San Diego"
                />
              </div>

              <div className="portal-form-row">
                <div className="portal-form-group">
                  <label htmlFor="serviceBranch">Service Branch</label>
                  <select
                    id="serviceBranch"
                    name="serviceBranch"
                    value={formData.serviceBranch}
                    onChange={handleChange}
                  >
                    <option value="">Select Branch</option>
                    <option value="army">Army</option>
                    <option value="navy">Navy</option>
                    <option value="air-force">Air Force</option>
                    <option value="marines">Marines</option>
                    <option value="coast-guard">Coast Guard</option>
                    <option value="space-force">Space Force</option>
                    <option value="civilian">Civilian/Dependent</option>
                  </select>
                </div>
                <div className="portal-form-group">
                  <label htmlFor="rank">Rank/Position</label>
                  <input
                    type="text"
                    id="rank"
                    name="rank"
                    value={formData.rank}
                    onChange={handleChange}
                    placeholder="e.g., Captain, Sergeant, Civilian"
                  />
                </div>
              </div>

              <div className="portal-form-group">
                <label htmlFor="location">Current Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State/Country"
                />
              </div>

              <div className="portal-form-group">
                <label htmlFor="needs">What support do you need? *</label>
                <textarea
                  id="needs"
                  name="needs"
                  value={formData.needs}
                  onChange={handleChange}
                  placeholder="Describe your specific needs and how we can help..."
                  rows={4}
                  required
                />
              </div>

              <div className="portal-form-row">
                <div className="portal-form-group">
                  <label htmlFor="timeline">When do you need assistance?</label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                  >
                    <option value="">Select Timeline</option>
                    <option value="asap">As soon as possible</option>
                    <option value="this-week">This week</option>
                    <option value="this-month">This month</option>
                    <option value="planning">Just planning ahead</option>
                  </select>
                </div>
                <div className="portal-form-group">
                  <label htmlFor="referral">How did you hear about us?</label>
                  <select
                    id="referral"
                    name="referral"
                    value={formData.referral}
                    onChange={handleChange}
                  >
                    <option value="">Select Source</option>
                    <option value="social-media">Social Media</option>
                    <option value="military-base">Military Base/Installation</option>
                    <option value="word-of-mouth">Word of Mouth</option>
                    <option value="online-search">Online Search</option>
                    <option value="other">Other</option>
                  </select>
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
                    Submitting Request...
                  </>
                ) : (
                  'Submit Access Request'
                )}
              </button>
            </form>

            <div className="portal-auth-footer">
              Already have an account?{' '}
              <Link to="/login" className="portal-auth-footer-link">Sign In</Link>
            </div>

            <div className="portal-auth-security">
              <span className="portal-security-badge">
                <Icon name="lock" size={14} />
                Secure Submission
              </span>
              <span className="portal-security-badge">
                <Icon name="shield" size={14} />
                Privacy Protected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestAccess;
