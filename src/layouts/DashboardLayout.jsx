import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';

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
            { label: 'Overview', path: '/admin', icon: '📊' },
            { label: 'Users', path: '/admin/users', icon: '👥' },
            { label: 'Invoices', path: '/admin/invoices', icon: '💰' },
            { label: 'Forms', path: '/admin/forms', icon: '📝' },
            { label: 'Page Builder', path: '/admin/pages', icon: '🎨' },
            { label: 'Integrations', path: '/admin/integrations', icon: '🔗' },
            { label: 'Privacy', path: '/admin/privacy', icon: '🔒' },
            { label: 'Legal Settings', path: '/admin/settings/nda', icon: '⚖️' },
        ],
        client: [
            { label: 'My Assistant', path: '/client', icon: '👤' },
            { label: 'Tasks', path: '/client/tasks', icon: '✓' },
            { label: 'Travel', path: '/client/travel', icon: '✈️' },
            { label: 'Documents', path: '/client/documents', icon: '📄' },
            { label: 'Communication', path: '/client/communication', icon: '📞' },
            { label: 'Messages', path: '/client/messages', icon: '💬' },
            { label: 'Research', path: '/client/research', icon: '🔍' },
            { label: 'New Request', path: '/client/requests', icon: '➕' },
            { label: 'Invoices', path: '/client/invoices', icon: '💳' },
            { label: 'Calendar', path: '/client/calendar', icon: '📅' },
            { label: 'Email', path: '/client/email', icon: '📧' },
            { label: 'Privacy', path: '/client/privacy', icon: '🔐' },
        ],
        assistant: [
            { label: 'My Profile', path: '/assistant', icon: '👤' },
            { label: 'Tasks', path: '/assistant/tasks', icon: '✓' },
            { label: 'Time Logs', path: '/assistant/time', icon: '⏱️' },
            { label: 'Inbox Manager', path: '/assistant/inbox', icon: '📥' },
            { label: 'Academy', path: '/assistant/resources', icon: '📚' },
            { label: 'Open Jobs', path: '/assistant/jobs', icon: '💼' },
            { label: 'My Invoices', path: '/assistant/invoices', icon: '💰' },
            { label: 'Privacy', path: '/assistant/privacy', icon: '🔐' },
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
                    <h1 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '700',
                        color: 'var(--color-primary)',
                        margin: 0
                    }}>
                        MilAssist
                    </h1>
                    <p style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--color-text-muted)',
                        marginTop: '0.25rem'
                    }}>
                        {role.charAt(0).toUpperCase() + role.slice(1)} Portal
                    </p>
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
                            <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
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
