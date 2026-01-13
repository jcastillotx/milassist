import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import CalendarSidebar from '../components/CalendarSidebar';
import Icon from '../components/Icon';

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
    navigate('/login');
  };

  const publicNavItems = [
    { path: '/', icon: 'home', label: 'Home', exact: true },
    { path: '/about', icon: 'about', label: 'About' },
    { path: '/services', icon: 'services', label: 'Services' },
    { path: '/contact', icon: 'chat', label: 'Contact' },
  ];

  const legalNavItems = [
    { path: '/privacy', icon: 'lock', label: 'Privacy' },
    { path: '/data-protection', icon: 'shield', label: 'Data Protection' },
  ];

  const authNavItems = user ? [
    { action: handleLogout, icon: 'logout', label: 'Logout' },
  ] : [
    { path: '/login', icon: 'key', label: 'Login' },
  ];

  const isHomePage = location.pathname === '/' || location.pathname === '';

  return (
    <div className="portal-layout">
      {/* Left Sidebar */}
      <aside className="portal-sidebar">
        <div className="portal-sidebar-header">
          <div className="portal-logo">
            <div className="portal-logo-icon">
              <Icon name="robot" size={24} />
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
                <span className="portal-nav-icon"><Icon name={item.icon} size={18} /></span>
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
                <span className="portal-nav-icon"><Icon name={item.icon} size={18} /></span>
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
                  <span className="portal-nav-icon"><Icon name={item.icon} size={18} /></span>
                  <span className="portal-nav-label">{item.label}</span>
                </NavLink>
              ) : (
                <button
                  key={index}
                  onClick={item.action}
                  className="portal-nav-item portal-nav-button"
                >
                  <span className="portal-nav-icon"><Icon name={item.icon} size={18} /></span>
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
            <Icon name="settings" size={18} />
          </button>
          <button className="portal-help-btn" title="Help">
            <Icon name="headphones" size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="portal-main">
        {/* Top Bar */}
        <header className="portal-topbar">
          <div className="portal-topbar-left">
            <button className="portal-sidebar-toggle">
              <Icon name="menu" size={20} />
            </button>
            <div className="portal-search">
              <Icon name="search" size={16} />
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
                <Icon name="sidebar" size={16} />
                Right Sidebar
              </button>
            )}
            <button className="portal-topbar-btn">
              <Icon name="upload" size={16} />
              Import
            </button>
            <button className="portal-topbar-btn portal-topbar-btn-primary">
              <Icon name="calendar" size={16} />
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
