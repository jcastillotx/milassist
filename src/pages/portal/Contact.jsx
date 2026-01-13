import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Us',
      description: 'support@milassist.com',
      subtitle: 'We respond within 24 hours',
    },
    {
      icon: '📞',
      title: 'Call Us',
      description: '1-800-MIL-ASST',
      subtitle: 'Mon-Fri, 9am-5pm EST',
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our team',
      subtitle: 'Available 24/7',
    },
  ];

  return (
    <div className="portal-page">
      {/* Hero Section */}
      <div className="portal-page-hero">
        <span className="portal-page-badge">Contact</span>
        <h1 className="portal-page-title">Get in Touch</h1>
        <p className="portal-page-subtitle">
          Have questions or need assistance? We're here to help.
          Reach out to our team and we'll get back to you as soon as possible.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="portal-content-section">
        <div className="portal-contact-methods">
          {contactInfo.map((info, index) => (
            <div key={index} className="portal-contact-card card">
              <span className="portal-contact-icon">{info.icon}</span>
              <h3 className="portal-contact-title">{info.title}</h3>
              <p className="portal-contact-description">{info.description}</p>
              <span className="portal-contact-subtitle">{info.subtitle}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="portal-content-section">
        <div className="portal-contact-grid">
          <div className="portal-contact-form-wrapper">
            <h2 className="portal-section-heading">Send Us a Message</h2>

            {submitted ? (
              <div className="portal-success-message card">
                <span className="portal-success-icon">✅</span>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="portal-contact-form card">
                <div className="portal-form-row">
                  <div className="portal-form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="portal-form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="portal-form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div className="portal-form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    rows="5"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary portal-submit-btn">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Office Info */}
          <div className="portal-office-info">
            <div className="portal-office-card card">
              <h3>Our Office</h3>
              <div className="portal-office-details">
                <div className="portal-office-item">
                  <span className="portal-office-icon">📍</span>
                  <div>
                    <strong>Address</strong>
                    <p>123 Military Way<br />Washington, DC 20001</p>
                  </div>
                </div>
                <div className="portal-office-item">
                  <span className="portal-office-icon">🕐</span>
                  <div>
                    <strong>Business Hours</strong>
                    <p>Monday - Friday<br />9:00 AM - 5:00 PM EST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="portal-social-card card">
              <h3>Follow Us</h3>
              <div className="portal-social-links">
                <a href="#" className="portal-social-link">
                  <span>📘</span> Facebook
                </a>
                <a href="#" className="portal-social-link">
                  <span>🐦</span> Twitter
                </a>
                <a href="#" className="portal-social-link">
                  <span>💼</span> LinkedIn
                </a>
                <a href="#" className="portal-social-link">
                  <span>📸</span> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
