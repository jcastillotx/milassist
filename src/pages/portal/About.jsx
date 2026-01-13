import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former military spouse with 15+ years supporting service families.',
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      bio: 'Veteran software architect passionate about accessible technology.',
      avatar: 'MC',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Operations',
      bio: 'Dedicated to streamlining support services for military families.',
      avatar: 'ER',
    },
  ];

  const milestones = [
    { year: '2022', event: 'Founded with a mission to support military families' },
    { year: '2023', event: 'Launched AI-powered assistant platform' },
    { year: '2024', event: 'Expanded services to 50 states' },
    { year: '2025', event: 'Serving over 10,000 military families' },
  ];

  return (
    <div className="portal-page">
      {/* Hero Section */}
      <div className="portal-page-hero">
        <span className="portal-page-badge">About Us</span>
        <h1 className="portal-page-title">Empowering Military Families</h1>
        <p className="portal-page-subtitle">
          MilAssist was born from a simple belief: military families deserve the best support possible.
          Our AI-powered platform connects you with dedicated assistants who understand your unique needs.
        </p>
      </div>

      {/* Mission Section */}
      <div className="portal-content-section">
        <div className="portal-feature-grid">
          <div className="portal-feature-card card">
            <span className="portal-feature-icon">🎯</span>
            <h3>Our Mission</h3>
            <p>
              To provide comprehensive, compassionate support that empowers military families
              to thrive during times of service and transition.
            </p>
          </div>
          <div className="portal-feature-card card">
            <span className="portal-feature-icon">👁️</span>
            <h3>Our Vision</h3>
            <p>
              A world where every military family has access to personalized assistance,
              enabling them to focus on what matters most.
            </p>
          </div>
          <div className="portal-feature-card card">
            <span className="portal-feature-icon">💜</span>
            <h3>Our Values</h3>
            <p>
              Integrity, dedication, and understanding guide everything we do.
              We treat every family like our own.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="portal-content-section">
        <div className="portal-story-card card">
          <h2>Our Story</h2>
          <p>
            MilAssist began when our founder, a military spouse herself, recognized the overwhelming
            challenges families face during deployments, relocations, and transitions. What started
            as a small network of volunteers has grown into a comprehensive platform powered by
            cutting-edge AI technology and a team of dedicated professionals.
          </p>
          <p>
            Today, we serve thousands of military families across the country, providing everything
            from administrative support to travel coordination, research assistance, and more. Our
            human assistants, many of whom are military spouses themselves, work alongside our AI
            technology to deliver personalized, empathetic service.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="portal-content-section">
        <h2 className="portal-section-heading">Our Journey</h2>
        <div className="portal-timeline">
          {milestones.map((milestone, index) => (
            <div key={index} className="portal-timeline-item">
              <div className="portal-timeline-marker"></div>
              <div className="portal-timeline-content">
                <span className="portal-timeline-year">{milestone.year}</span>
                <p className="portal-timeline-event">{milestone.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="portal-content-section">
        <h2 className="portal-section-heading">Meet Our Team</h2>
        <div className="portal-team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="portal-team-card card">
              <div className="portal-team-avatar">{member.avatar}</div>
              <h3 className="portal-team-name">{member.name}</h3>
              <span className="portal-team-role">{member.role}</span>
              <p className="portal-team-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="portal-cta-section">
        <div className="portal-cta-card card">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of military families who trust MilAssist for their support needs.</p>
          <div className="portal-cta-buttons">
            <Link to="/portal/services" className="btn btn-primary">
              View Services
            </Link>
            <Link to="/portal/contact" className="btn btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
