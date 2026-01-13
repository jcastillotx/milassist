import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DataProtection = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'rights', label: 'Your Rights' },
    { id: 'security', label: 'Security Measures' },
    { id: 'compliance', label: 'Compliance' },
  ];

  const securityMeasures = [
    {
      icon: '🔐',
      title: 'Encryption',
      description: 'All data is encrypted using AES-256 bit encryption, both in transit and at rest.',
    },
    {
      icon: '🔒',
      title: 'Access Control',
      description: 'Role-based access ensures only authorized personnel can access your data.',
    },
    {
      icon: '📊',
      title: 'Monitoring',
      description: '24/7 security monitoring and anomaly detection to prevent unauthorized access.',
    },
    {
      icon: '💾',
      title: 'Backups',
      description: 'Regular encrypted backups with geo-redundancy ensure your data is never lost.',
    },
    {
      icon: '🔍',
      title: 'Auditing',
      description: 'Comprehensive audit logs track all access and changes to your data.',
    },
    {
      icon: '🛡️',
      title: 'Penetration Testing',
      description: 'Regular security assessments by third-party experts to identify vulnerabilities.',
    },
  ];

  const dataRights = [
    {
      right: 'Right to Access',
      description: 'You can request a copy of all personal data we hold about you.',
      action: 'Request Data Export',
    },
    {
      right: 'Right to Rectification',
      description: 'You can request correction of any inaccurate personal data.',
      action: 'Update Profile',
    },
    {
      right: 'Right to Erasure',
      description: 'You can request deletion of your personal data (subject to legal requirements).',
      action: 'Request Deletion',
    },
    {
      right: 'Right to Portability',
      description: 'You can receive your data in a machine-readable format.',
      action: 'Download Data',
    },
    {
      right: 'Right to Object',
      description: 'You can object to certain types of data processing.',
      action: 'Manage Preferences',
    },
  ];

  const complianceStandards = [
    { name: 'GDPR', description: 'General Data Protection Regulation (EU)', status: 'Compliant' },
    { name: 'CCPA', description: 'California Consumer Privacy Act', status: 'Compliant' },
    { name: 'SOC 2', description: 'Service Organization Control', status: 'Certified' },
    { name: 'HIPAA', description: 'Health Insurance Portability and Accountability Act', status: 'Ready' },
    { name: 'ISO 27001', description: 'Information Security Management', status: 'In Progress' },
  ];

  return (
    <div className="portal-page portal-legal-page">
      {/* Hero Section */}
      <div className="portal-page-hero">
        <span className="portal-page-badge">Security</span>
        <h1 className="portal-page-title">Data Protection</h1>
        <p className="portal-page-subtitle">
          Learn how we protect your data and uphold your rights.
          Your security and privacy are our top priorities.
        </p>
      </div>

      {/* Tabs */}
      <div className="portal-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`portal-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="portal-content-section">
        {activeTab === 'overview' && (
          <div className="portal-tab-content">
            <div className="portal-data-overview card">
              <h2>Our Commitment to Data Protection</h2>
              <p>
                At MilAssist, we understand that you're entrusting us with sensitive information
                about your family and personal life. We take this responsibility seriously and
                have implemented comprehensive measures to protect your data.
              </p>
              <div className="portal-data-stats">
                <div className="portal-data-stat">
                  <span className="portal-stat-number">256-bit</span>
                  <span className="portal-stat-label">Encryption</span>
                </div>
                <div className="portal-data-stat">
                  <span className="portal-stat-number">99.9%</span>
                  <span className="portal-stat-label">Uptime</span>
                </div>
                <div className="portal-data-stat">
                  <span className="portal-stat-number">24/7</span>
                  <span className="portal-stat-label">Monitoring</span>
                </div>
                <div className="portal-data-stat">
                  <span className="portal-stat-number">0</span>
                  <span className="portal-stat-label">Data Breaches</span>
                </div>
              </div>
            </div>

            <div className="portal-data-principles">
              <h3>Our Data Protection Principles</h3>
              <div className="portal-principles-grid">
                <div className="portal-principle-card card">
                  <span>📌</span>
                  <h4>Data Minimization</h4>
                  <p>We only collect the data necessary to provide our services.</p>
                </div>
                <div className="portal-principle-card card">
                  <span>🎯</span>
                  <h4>Purpose Limitation</h4>
                  <p>Your data is only used for the purposes you've agreed to.</p>
                </div>
                <div className="portal-principle-card card">
                  <span>⏱️</span>
                  <h4>Storage Limitation</h4>
                  <p>We retain data only as long as necessary.</p>
                </div>
                <div className="portal-principle-card card">
                  <span>✅</span>
                  <h4>Accuracy</h4>
                  <p>We keep your data accurate and up-to-date.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rights' && (
          <div className="portal-tab-content">
            <div className="portal-rights-intro card">
              <h2>Your Data Rights</h2>
              <p>
                You have comprehensive rights over your personal data. We make it easy
                for you to exercise these rights at any time.
              </p>
            </div>

            <div className="portal-rights-list">
              {dataRights.map((item, index) => (
                <div key={index} className="portal-right-card card">
                  <div className="portal-right-info">
                    <h3>{item.right}</h3>
                    <p>{item.description}</p>
                  </div>
                  <button className="btn btn-secondary portal-right-btn">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>

            <div className="portal-rights-note card">
              <span>ℹ️</span>
              <p>
                To exercise any of these rights, please log in to your account or contact our
                Data Protection Officer at <a href="mailto:dpo@milassist.com">dpo@milassist.com</a>.
                We will respond to your request within 30 days.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="portal-tab-content">
            <div className="portal-security-intro card">
              <h2>Security Measures</h2>
              <p>
                We employ industry-leading security measures to protect your data
                from unauthorized access, disclosure, alteration, or destruction.
              </p>
            </div>

            <div className="portal-security-grid">
              {securityMeasures.map((measure, index) => (
                <div key={index} className="portal-security-card card">
                  <span className="portal-security-icon">{measure.icon}</span>
                  <h3>{measure.title}</h3>
                  <p>{measure.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="portal-tab-content">
            <div className="portal-compliance-intro card">
              <h2>Compliance Standards</h2>
              <p>
                We adhere to the highest standards of data protection and privacy
                regulations worldwide.
              </p>
            </div>

            <div className="portal-compliance-table card">
              <table>
                <thead>
                  <tr>
                    <th>Standard</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceStandards.map((standard, index) => (
                    <tr key={index}>
                      <td><strong>{standard.name}</strong></td>
                      <td>{standard.description}</td>
                      <td>
                        <span className={`badge ${
                          standard.status === 'Compliant' || standard.status === 'Certified'
                            ? 'badge-success'
                            : 'badge-warning'
                        }`}>
                          {standard.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Related Links */}
      <div className="portal-content-section">
        <div className="portal-legal-links">
          <Link to="/portal/privacy" className="portal-legal-link card">
            <span>🔒</span>
            <div>
              <h4>Privacy Policy</h4>
              <p>Read our full privacy policy</p>
            </div>
          </Link>
          <Link to="/portal/contact" className="portal-legal-link card">
            <span>💬</span>
            <div>
              <h4>Contact DPO</h4>
              <p>Reach our Data Protection Officer</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DataProtection;
