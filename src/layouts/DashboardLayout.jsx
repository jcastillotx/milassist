import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import AIAssistant from '../components/AIAssistant';

const DashboardLayout = ({ role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // In real app: clear token
        navigate('/');
    };

    const navItems = {
        admin: [
            { label: 'Overview', path: '/admin' },
            { label: 'Users', path: '/admin/users' },
            { label: 'Invoices', path: '/admin/invoices' },
            { label: 'Forms', path: '/admin/forms' },
            { label: 'Page Builder', path: '/admin/pages' },
            { label: 'Integrations', path: '/admin/integrations' },
        ],
        client: [
            { label: 'My Assistant', path: '/client' },
            { label: 'Tasks', path: '/client/tasks' },
            { label: 'Travel', path: '/client/travel' },
            { label: 'Documents', path: '/client/documents' },
            { label: 'Communication center', path: '/client/communication' },
            { label: 'Messages', path: '/client/messages' },
            { label: 'Data & Research', path: '/client/research' },
            { label: 'New Request', path: '/client/requests' },
            { label: 'Invoices', path: '/client/invoices' },
        ],
        assistant: [
            { label: 'My Profile', path: '/assistant' },
            { label: 'Tasks', path: '/assistant/tasks' },
            { label: 'Academy', path: '/assistant/resources' },
            { label: 'Open Jobs', path: '/assistant/jobs' },
            { label: 'My Invoices', path: '/assistant/invoices' },
        ]
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
                <div className="p-6">
                    <h1 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>MilAssist</h1>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{role} View</span>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    {navItems[role]?.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-100">
                    <Button variant="secondary" onClick={handleLogout} className="w-full text-sm">Log Out</Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8 md:hidden">
                    <h1 className="text-xl font-bold">MilAssist</h1>
                    <button onClick={handleLogout} className="text-sm text-gray-600">Log Out</button>
                </header>
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* AI Assistant Widget */}
            <AIAssistant />
        </div>
    );
};

export default DashboardLayout;
