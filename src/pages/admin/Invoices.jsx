import React, { useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Invoices = () => {
    const [invoices] = useState([
        { id: 'INV-001', client: 'Acme Corp', amount: 1500.00, status: 'paid', date: '2023-11-01' },
        { id: 'INV-002', client: 'Globex Inc', amount: 850.50, status: 'sent', date: '2023-11-05' },
        { id: 'INV-003', client: 'Acme Corp', amount: 2100.00, status: 'draft', date: '2023-11-10' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Invoices</h2>
                <Button>Create Invoice</Button>
            </div>

            <Card className="overflow-hidden p-0">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-gray-900">{inv.id}</td>
                                <td className="px-6 py-4 text-gray-900 font-medium">{inv.client}</td>
                                <td className="px-6 py-4 text-gray-600 text-sm">{inv.date}</td>
                                <td className="px-6 py-4 text-gray-900 font-medium">${inv.amount.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${inv.status === 'paid' ? 'bg-green-100 text-green-800' :
                                            inv.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-sm text-gray-500 hover:text-primary font-medium">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Invoices;
