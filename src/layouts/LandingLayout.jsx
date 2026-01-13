import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

const LandingLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Home', exact: true },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="landing-layout">
      {/* Top Navigation */}
      <header className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-navbar-container">
          {/* Logo */}
          <Link to="/" className="landing-logo">
            <div className="landing-logo-icon">
              <Icon name="headset" size={22} color="#ffffff" />
            </div>
            <span className="landing-logo-text">
              <span className="landing-logo-mil">MIL</span>
              <span className="landing-logo-assist">ASSIST</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="landing-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `landing-nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="landing-nav-actions">
            {user ? (
              <>
                <Link to={`/${user.role || 'client'}`} className="landing-nav-link">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="landing-nav-link">
                  Sign In
                </Link>
                <Link to="/contact" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="landing-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="landing-mobile-menu">
            <nav className="landing-mobile-nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `landing-mobile-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="landing-mobile-actions">
                {user ? (
                  <>
                    <Link
                      to={`/${user.role || 'client'}`}
                      className="btn btn-secondary btn-block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="btn btn-primary btn-block"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn btn-secondary btn-block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/contact"
                      className="btn btn-primary btn-block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="landing-main">
        <Outlet context={{ user }} />
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="landing-footer-grid">
            {/* Brand Column */}
            <div className="landing-footer-brand">
              <Link to="/" className="landing-logo">
                <div className="landing-logo-icon">
                  <Icon name="headset" size={20} color="#ffffff" />
                </div>
                <span className="landing-logo-text">
                  <span className="landing-logo-mil">MIL</span>
                  <span className="landing-logo-assist">ASSIST</span>
                </span>
              </Link>
              <p className="landing-footer-tagline">
                Professional virtual support powered by military spouses.
              </p>
            </div>

            {/* Company Links */}
            <div className="landing-footer-column">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div className="landing-footer-column">
              <h4>Resources</h4>
              <ul>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/data-protection">Data Protection</Link></li>
                <li><Link to="/contact">Support</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="landing-footer-column">
              <h4>Contact</h4>
              <ul>
                <li>info@milassist.com</li>
                <li>1-800-MIL-ASST</li>
              </ul>
            </div>
          </div>

          <div className="landing-footer-bottom">
            <p>&copy; {new Date().getFullYear()} MilAssist. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
