import React, { useState, useEffect } from 'react';
import API_URL from "../config/api";
import { useNavigate } from 'react-router-dom';
import API_URL from "../config/api";
import Card from '../../components/Card';
import API_URL from "../config/api";
import Button from '../../components/Button';
import API_URL from "../config/api";

const ClientInvoices = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/invoices`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setInvoices(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const handlePay = (invoiceId) => {
        navigate(`/client/payment/${invoiceId}`);
    };

    if (loading) return <div>Loading invoices...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Invoices</h2>

            <Card className="overflow-hidden p-0">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {invoices.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-4 text-center text-gray-500">No invoices found.</td>
                            </tr>
                        )}
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{inv.description || 'Service Invoice'}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">${inv.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                        ${inv.status === 'paid' ? 'bg-green-100 text-green-800' :
                                            inv.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {inv.status === 'sent' && (
                                        <Button
                                            variant="primary"
                                            className="text-xs py-1 px-3"
                                            onClick={() => handlePay(inv.id)}
                                        >
                                            Pay Now
                                        </Button>
                                    )}
                                    {inv.status === 'paid' && (
                                        <span className="text-xs text-green-600 font-bold">PAID</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default ClientInvoices;
