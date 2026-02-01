import React, { useState, useEffect } from 'react';
import API_URL from "../config/api";
import Card from '../components/Card';
import Button from '../components/Button';

const PrivacyCenter = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/privacy`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setRequests(await res.json());
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const submitRequest = async (type) => {
        if (!window.confirm(`Are you sure you want to request data ${type}?`)) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/privacy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ type, reason: 'User requested via Privacy Center' })
            });

            if (res.ok) {
                alert('Request submitted successfully.');
                fetchRequests();
            } else {
                const err = await res.json();
                alert(err.error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Privacy Center</h1>
            <p className="text-gray-600">
                Manage your data privacy setting and exercise your rights under GDPR and CCPA.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-blue-500">
                    <h3 className="font-bold text-lg mb-2">Export Data</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Request a copy of all personal data we hold about you. You will receive an email with a download link once processed.
                    </p>
                    <Button onClick={() => submitRequest('EXPORT')}>Request Data Export</Button>
                </Card>

                <Card className="border-l-4 border-red-500">
                    <h3 className="font-bold text-lg mb-2 text-red-600">Delete Account</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="secondary" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => submitRequest('DELETE')}>Request Deletion</Button>
                </Card>
            </div>

            <Card>
                <h3 className="font-bold text-lg mb-4">Request History</h3>
                {loading ? <p>Loading...</p> : (
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 uppercase">
                                <th className="p-2">Type</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="p-4 text-center text-gray-400">No requests found.</td>
                                </tr>
                            )}
                            {requests.map(req => (
                                <tr key={req.id} className="border-b border-gray-50">
                                    <td className="p-2 font-medium">{req.type}</td>
                                    <td className="p-2 text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded text-xs ${req.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    );
};

export default PrivacyCenter;
