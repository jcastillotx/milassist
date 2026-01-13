import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import CalendarSidebar from '../components/CalendarSidebar';

const PortalLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/portal/login');
  };

  const publicNavItems = [
    { path: '/portal', icon: '🏠', label: 'Home', exact: true },
    { path: '/portal/about', icon: '📖', label: 'About' },
    { path: '/portal/services', icon: '⚡', label: 'Services' },
    { path: '/portal/contact', icon: '💬', label: 'Contact' },
  ];

  const legalNavItems = [
    { path: '/portal/privacy', icon: '🔒', label: 'Privacy' },
    { path: '/portal/data-protection', icon: '🛡️', label: 'Data Protection' },
  ];

  const authNavItems = user ? [
    { action: handleLogout, icon: '🚪', label: 'Logout' },
  ] : [
    { path: '/portal/login', icon: '🔑', label: 'Login' },
  ];

  const isHomePage = location.pathname === '/portal' || location.pathname === '/portal/';

  return (
    <div className="portal-layout">
      {/* Left Sidebar */}
      <aside className="portal-sidebar">
        <div className="portal-sidebar-header">
          <div className="portal-logo">
            <div className="portal-logo-icon">
              <span>🤖</span>
            </div>
          </div>
        </div>

        <nav className="portal-nav">
          <div className="portal-nav-section">
            {publicNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `portal-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="portal-nav-icon">{item.icon}</span>
                <span className="portal-nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="portal-nav-divider"></div>

          <div className="portal-nav-section">
            {legalNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `portal-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="portal-nav-icon">{item.icon}</span>
                <span className="portal-nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="portal-nav-divider"></div>

          <div className="portal-nav-section">
            {authNavItems.map((item, index) =>
              item.path ? (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `portal-nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="portal-nav-icon">{item.icon}</span>
                  <span className="portal-nav-label">{item.label}</span>
                </NavLink>
              ) : (
                <button
                  key={index}
                  onClick={item.action}
                  className="portal-nav-item portal-nav-button"
                >
                  <span className="portal-nav-icon">{item.icon}</span>
                  <span className="portal-nav-label">{item.label}</span>
                </button>
              )
            )}
          </div>
        </nav>

        {/* User Profile Section */}
        {user && (
          <div className="portal-user-section">
            <div className="portal-user-avatar">
              {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        )}

        {/* Settings Icon */}
        <div className="portal-sidebar-footer">
          <button className="portal-settings-btn" title="Settings">
            ⚙️
          </button>
          <button className="portal-help-btn" title="Help">
            🎧
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="portal-main">
        {/* Top Bar */}
        <header className="portal-topbar">
          <div className="portal-topbar-left">
            <button className="portal-sidebar-toggle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <div className="portal-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Search" />
              <span className="portal-search-shortcut">⌘ K</span>
            </div>
          </div>
          <div className="portal-topbar-right">
            {isHomePage && (
              <button
                className="portal-topbar-btn portal-right-sidebar-toggle"
                onClick={() => setShowRightSidebar(!showRightSidebar)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M15 3v18" />
                </svg>
                Right Sidebar
              </button>
            )}
            <button className="portal-topbar-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Import
            </button>
            <button className="portal-topbar-btn portal-topbar-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              New Meeting
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className={`portal-content ${isHomePage && showRightSidebar ? 'with-right-sidebar' : ''}`}>
          <div className="portal-content-inner">
            <Outlet context={{ user }} />
          </div>

          {/* Right Sidebar - Only on Home */}
          {isHomePage && showRightSidebar && (
            <aside className="portal-right-sidebar">
              <CalendarSidebar />
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

export default PortalLayout;
