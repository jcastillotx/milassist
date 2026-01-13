import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Icon from '../components/Icon';

import AIAssistant from '../components/AIAssistant';
import Timer from '../components/Timer';

const DashboardLayout = ({ role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const navItems = {
        admin: [
            { label: 'Overview', path: '/admin', icon: 'overview' },
            { label: 'Users', path: '/admin/users', icon: 'users' },
            { label: 'Invoices', path: '/admin/invoices', icon: 'money' },
            { label: 'Forms', path: '/admin/forms', icon: 'form' },
            { label: 'Page Builder', path: '/admin/pages', icon: 'template' },
            { label: 'Integrations', path: '/admin/integrations', icon: 'integration' },
            { label: 'Privacy', path: '/admin/privacy', icon: 'lock' },
            { label: 'Legal Settings', path: '/admin/settings/nda', icon: 'scale' },
        ],
        client: [
            { label: 'My Assistant', path: '/client', icon: 'user' },
            { label: 'Tasks', path: '/client/tasks', icon: 'tasks' },
            { label: 'Travel', path: '/client/travel', icon: 'plane' },
            { label: 'Documents', path: '/client/documents', icon: 'document' },
            { label: 'Communication', path: '/client/communication', icon: 'phone' },
            { label: 'Messages', path: '/client/messages', icon: 'message' },
            { label: 'Research', path: '/client/research', icon: 'search' },
            { label: 'New Request', path: '/client/requests', icon: 'plus' },
            { label: 'Invoices', path: '/client/invoices', icon: 'creditCard' },
            { label: 'Calendar', path: '/client/calendar', icon: 'calendar' },
            { label: 'Email', path: '/client/email', icon: 'email' },
            { label: 'Privacy', path: '/client/privacy', icon: 'lock' },
        ],
        assistant: [
            { label: 'My Profile', path: '/assistant', icon: 'user' },
            { label: 'Tasks', path: '/assistant/tasks', icon: 'tasks' },
            { label: 'Time Logs', path: '/assistant/time', icon: 'clock' },
            { label: 'Inbox Manager', path: '/assistant/inbox', icon: 'inbox' },
            { label: 'Academy', path: '/assistant/resources', icon: 'book' },
            { label: 'Open Jobs', path: '/assistant/jobs', icon: 'briefcase' },
            { label: 'My Invoices', path: '/assistant/invoices', icon: 'money' },
            { label: 'Privacy', path: '/assistant/privacy', icon: 'lock' },
        ]
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
            {/* Sidebar */}
            <aside style={{
                width: '240px',
                backgroundColor: '#ffffff',
                borderRight: '1px solid var(--color-border)',
                padding: '1.5rem 0',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Logo */}
                <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Icon name="headset" size={22} color="#ffffff" />
                        </div>
                        <div>
                            <h1 style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                color: 'var(--color-text)',
                                margin: 0,
                                lineHeight: 1.2
                            }}>
                                MilAssist
                            </h1>
                            <p style={{
                                fontSize: '0.7rem',
                                color: 'var(--color-text-muted)',
                                margin: 0
                            }}>
                                {role.charAt(0).toUpperCase() + role.slice(1)} Portal
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '0 0.75rem' }}>
                    {navItems[role].map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.625rem 0.75rem',
                                marginBottom: '0.25rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: 'var(--color-text)',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <Icon name={item.icon} size={18} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div style={{ padding: '0 1.5rem', marginTop: 'auto' }}>
                    <Button 
                        onClick={handleLogout}
                        variant="secondary"
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            {/* AI Assistant Widget */}
            <AIAssistant />

            {/* Timer for Assistants */}
            {role === 'assistant' && <Timer />}
        </div>
    );
};

export default DashboardLayout;
