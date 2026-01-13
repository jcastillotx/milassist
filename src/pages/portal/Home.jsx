import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';

const Home = () => {
  const { user } = useOutletContext();
  const [meetingCode, setMeetingCode] = useState('');
  const userName = user?.firstName || 'Guest';

  const gettingStartedItems = [
    { id: 1, text: 'Install the MilAssist Chrome Extension', completed: true },
    { id: 2, text: 'Check your audio', completed: true },
    { id: 3, text: 'Record your first conversation', completed: true },
  ];

  const completedCount = gettingStartedItems.filter(item => item.completed).length;
  const progressPercent = (completedCount / gettingStartedItems.length) * 100;

  const quickAccessItems = [
    {
      icon: '🔗',
      title: 'Quick Links',
      description: 'No items found',
      action: 'Add Links',
      path: '#',
    },
    {
      icon: '📹',
      title: 'My Meetings',
      description: 'No items found',
      action: 'Connect Your Calendar',
      path: '/portal/services',
    },
    {
      icon: '📝',
      title: 'Notes',
      description: 'No items found',
      action: 'Add Notes',
      path: '#',
    },
  ];

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (meetingCode) {
      // Handle meeting join logic
      console.log('Joining meeting:', meetingCode);
    }
  };

  return (
    <div className="portal-home">
      {/* Promo Banner */}
      <div className="portal-promo-banner">
        <span className="portal-promo-badge">LIMITED</span>
        <span className="portal-promo-text">
          Get 1 month FREE by paying annually
        </span>
        <Link to="/portal/services" className="portal-promo-link">
          View Discount →
        </Link>
        <button className="portal-promo-close">×</button>
      </div>

      {/* Greeting Section */}
      <div className="portal-greeting">
        <h1 className="portal-greeting-title">Hello, {userName}</h1>
        <p className="portal-greeting-subtitle">
          How can <span className="portal-assistant-name">
            <span className="portal-assistant-icon">🤖</span> MilAssist
          </span> help you?
        </p>
      </div>

      {/* Getting Started Card */}
      <div className="portal-getting-started card">
        <h3 className="portal-card-title">
          <span>🎉</span> Getting Started with MilAssist – Your AI Assistant
        </h3>
        <div className="portal-progress-bar">
          <div
            className="portal-progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="portal-checklist">
          {gettingStartedItems.map((item) => (
            <div key={item.id} className="portal-checklist-item">
              <span className="portal-checklist-text">{item.text}</span>
              <span className={`portal-checklist-icon ${item.completed ? 'completed' : ''}`}>
                {item.completed ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Join Meetings Section */}
      <div className="portal-join-meeting">
        <h3 className="portal-section-title">Join Meetings</h3>
        <form onSubmit={handleJoinMeeting} className="portal-join-form">
          <div className="portal-join-input-wrapper">
            <span className="portal-join-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Enter code or link"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              className="portal-join-input"
            />
          </div>
          <button type="submit" className="btn btn-primary portal-join-btn">
            Join
          </button>
        </form>
      </div>

      {/* Quick Access Section */}
      <div className="portal-quick-access">
        <h3 className="portal-section-title">Quick Access</h3>
        <div className="portal-quick-access-grid">
          {quickAccessItems.map((item, index) => (
            <div key={index} className="portal-quick-card card">
              <span className="portal-quick-icon">{item.icon}</span>
              <h4 className="portal-quick-title">{item.title}</h4>
              <p className="portal-quick-description">{item.description}</p>
              <Link to={item.path} className="portal-quick-action">
                <span>+</span> {item.action}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
