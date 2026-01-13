import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  const lastUpdated = 'January 1, 2025';

  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account,
        request services, contact us, or otherwise communicate with us. This information may include:

        • Name, email address, and contact information
        • Account credentials and authentication data
        • Service requests and communication history
        • Payment and billing information
        • Device and usage information when you use our services`,
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the information we collect to:

        • Provide, maintain, and improve our services
        • Process transactions and send related information
        • Send you technical notices, updates, and support messages
        • Respond to your comments, questions, and requests
        • Monitor and analyze trends, usage, and activities
        • Detect, investigate, and prevent fraudulent transactions`,
    },
    {
      title: '3. Information Sharing',
      content: `We do not sell, trade, or otherwise transfer your personal information to outside parties
        except in the following circumstances:

        • With your consent or at your direction
        • With service providers who perform services on our behalf
        • To comply with legal obligations
        • To protect our rights and prevent fraud
        • In connection with a merger or acquisition`,
    },
    {
      title: '4. Data Security',
      content: `We take reasonable measures to help protect your personal information from loss, theft,
        misuse, unauthorized access, disclosure, alteration, and destruction. This includes:

        • Industry-standard encryption for data in transit and at rest
        • Regular security assessments and audits
        • Employee training on data protection
        • Access controls and authentication requirements`,
    },
    {
      title: '5. Your Rights and Choices',
      content: `You have certain rights regarding your personal information:

        • Access: You can request a copy of your personal data
        • Correction: You can update or correct your information
        • Deletion: You can request deletion of your data
        • Portability: You can receive your data in a portable format
        • Opt-out: You can opt out of marketing communications`,
    },
    {
      title: '6. Cookies and Tracking',
      content: `We use cookies and similar tracking technologies to track activity on our service and
        hold certain information. You can instruct your browser to refuse all cookies or to indicate
        when a cookie is being sent.`,
    },
    {
      title: '7. Children\'s Privacy',
      content: `Our services are not directed to children under 13. We do not knowingly collect
        personal information from children under 13. If we learn we have collected such information,
        we will take steps to delete it.`,
    },
    {
      title: '8. Changes to This Policy',
      content: `We may update this privacy policy from time to time. We will notify you of any changes
        by posting the new policy on this page and updating the "Last Updated" date.`,
    },
  ];

  return (
    <div className="portal-page portal-legal-page">
      {/* Hero Section */}
      <div className="portal-page-hero">
        <span className="portal-page-badge">Legal</span>
        <h1 className="portal-page-title">Privacy Policy</h1>
        <p className="portal-page-subtitle">
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
        </p>
        <p className="portal-legal-updated">Last Updated: {lastUpdated}</p>
      </div>

      {/* Content */}
      <div className="portal-content-section">
        <div className="portal-legal-content card">
          <div className="portal-legal-intro">
            <p>
              MilAssist ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our
              services. Please read this policy carefully.
            </p>
          </div>

          {sections.map((section, index) => (
            <div key={index} className="portal-legal-section">
              <h2>{section.title}</h2>
              <div className="portal-legal-text">
                {section.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="portal-legal-section">
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="portal-legal-contact">
              <p><strong>Email:</strong> privacy@milassist.com</p>
              <p><strong>Address:</strong> 123 Military Way, Washington, DC 20001</p>
              <p><strong>Phone:</strong> 1-800-MIL-ASST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="portal-content-section">
        <div className="portal-legal-links">
          <Link to="/portal/data-protection" className="portal-legal-link card">
            <span>🛡️</span>
            <div>
              <h4>Data Protection</h4>
              <p>Learn about how we protect your data</p>
            </div>
          </Link>
          <Link to="/portal/contact" className="portal-legal-link card">
            <span>💬</span>
            <div>
              <h4>Contact Us</h4>
              <p>Have questions? Get in touch</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
