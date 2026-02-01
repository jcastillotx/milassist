import React, { useState, useEffect } from 'react';
import API_URL from "../../config/api";
import Card from '../../components/Card';
import Button from '../../components/Button';

const EmailSettings = () => {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/email/connections`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setConnections(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (provider) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/email/auth/${provider}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const { authUrl } = await res.json();
                // Redirect to OAuth provider
                window.location.href = authUrl;
            }
        } catch (err) {
            console.error(err);
            alert('Failed to initiate connection');
        }
    };

    const handleDisconnect = async (connectionId) => {
        if (!confirm('Are you sure you want to disconnect this email?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/email/connections/${connectionId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchConnections();
                alert('Email disconnected successfully');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to disconnect');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Email Settings</h2>
            <p className="text-gray-600">Connect your email account to allow your assistant to manage your inbox.</p>

            <Card>
                <h3 className="text-lg font-bold mb-4">Connected Accounts</h3>
                {connections.length === 0 ? (
                    <p className="text-gray-500 mb-4">No email accounts connected.</p>
                ) : (
                    <div className="space-y-3 mb-6">
                        {connections.map(conn => (
                            <div key={conn.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                                <div>
                                    <div className="font-medium">{conn.email}</div>
                                    <div className="text-sm text-gray-500 capitalize">{conn.provider}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        conn.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {conn.status}
                                    </span>
                                    <Button 
                                        variant="secondary" 
                                        className="text-xs py-1 px-3"
                                        onClick={() => handleDisconnect(conn.id)}
                                    >
                                        Disconnect
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Connect New Account</h4>
                    <div className="flex gap-3">
                        <Button onClick={() => handleConnect('gmail')}>
                            <span className="mr-2">📧</span> Connect Gmail
                        </Button>
                        <Button onClick={() => handleConnect('outlook')} variant="secondary">
                            <span className="mr-2">📨</span> Connect Outlook
                        </Button>
                    </div>
                </div>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
                <h4 className="font-bold mb-2">🔒 Privacy & Security</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Your assistant can only read and send emails on your behalf</li>
                    <li>• You can disconnect access at any time</li>
                    <li>• We never store your email password</li>
                    <li>• All connections use secure OAuth2 authentication</li>
                </ul>
            </Card>
        </div>
    );
};

export default EmailSettings;
