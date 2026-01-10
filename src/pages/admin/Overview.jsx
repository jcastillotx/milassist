import React from 'react';
import Card from '../../components/Card';

const AdminOverview = () => {
    const stats = [
        { label: 'Total Revenue', value: '$12,450', change: '+12%' },
        { label: 'Active Assistants', value: '45', change: '+3' },
        { label: 'Pending Invoices', value: '8', change: '-2' },
        { label: 'Active Clients', value: '38', change: '+5' },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6">
                        <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>{stat.value}</p>
                        <p className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                            {stat.change} vs last month
                        </p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="min-h-[300px]">
                    <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                    <ul className="space-y-4">
                        <li className="flex justify-between text-sm">
                            <span>New application from Jane Doe</span>
                            <span className="text-gray-400">2h ago</span>
                        </li>
                        <li className="flex justify-between text-sm">
                            <span>Invoice #1023 paid by Acme Corp</span>
                            <span className="text-gray-400">4h ago</span>
                        </li>
                        <li className="flex justify-between text-sm">
                            <span>System alert: Zapier connection restored</span>
                            <span className="text-gray-400">5h ago</span>
                        </li>
                    </ul>
                </Card>

                <Card className="min-h-[300px]">
                    <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-gray-50 rounded hover:bg-gray-100 font-medium text-sm text-center">Create Invoice</button>
                        <button className="p-4 bg-gray-50 rounded hover:bg-gray-100 font-medium text-sm text-center">Add User</button>
                        <button className="p-4 bg-gray-50 rounded hover:bg-gray-100 font-medium text-sm text-center">New Page</button>
                        <button className="p-4 bg-gray-50 rounded hover:bg-gray-100 font-medium text-sm text-center">View Reports</button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminOverview;
