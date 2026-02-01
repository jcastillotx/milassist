import React, { useState, useEffect } from 'react';
import API_URL from "../../config/api";
import Card from '../../components/Card';
import Button from '../../components/Button';

const CommunicationCenter = () => {
    const [activeTab, setActiveTab] = useState('logs');
    const [logs, setLogs] = useState([]);
    const [rule, setRule] = useState({
        strategy: 'forward_to_assistant',
        business_hours_start: '09:00',
        business_hours_end: '17:00'
    });
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                const [logsRes, rulesRes] = await Promise.all([
                    fetch(`${API_URL}/communication/logs`, { headers }),
                    fetch(`${API_URL}/communication/rules`, { headers })
                ]);

                if (logsRes.ok) setLogs(await logsRes.json());
                if (rulesRes.ok) {
                    const rulesData = await rulesRes.json();
                    if (rulesData.id) setRule(rulesData);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const saveRule = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/communication/rules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(rule)
            });
            if (res.ok) alert('Routing rules updated!');
        } catch (err) {
            alert('Failed to update rules');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Communication Center</h2>
                <div className="flex bg-gray-100 rounded p-1">
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'logs' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Call Logs
                    </button>
                    <button
                        onClick={() => setActiveTab('rules')}
                        className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'rules' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Routing Rules
                    </button>
                </div>
            </div>

            {activeTab === 'logs' ? (
                <Card>
                    <h3 className="font-bold mb-4">Recent Calls</h3>
                    {logs.length === 0 ? (
                        <p className="text-gray-500 text-sm">No call history found.</p>
                    ) : (
                        <div className="space-y-3">
                            {logs.map(call => (
                                <div key={call.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xl ${call.direction === 'inbound' ? 'text-blue-500' : 'text-green-500'}`}>
                                            {call.direction === 'inbound' ? '↙' : '↗'}
                                        </span>
                                        <div>
                                            <p className="font-medium">{call.caller_number}</p>
                                            <p className="text-xs text-gray-400">{new Date(call.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs px-2 py-1 rounded capitalize ${call.status === 'missed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {call.status}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">{call.duration_seconds}s</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            ) : (
                <Card>
                    <h3 className="font-bold mb-4 w-full">Call Handling Strategy</h3>
                    <div className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium mb-1">When a call comes in:</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={rule.strategy}
                                onChange={e => setRule({ ...rule, strategy: e.target.value })}
                            >
                                <option value="forward_to_assistant">Forward to My Assistant</option>
                                <option value="voicemail">Send to Voicemail</option>
                                <option value="forward_to_external">Forward to External Number</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Business Hours Start</label>
                                <input
                                    type="time"
                                    className="w-full p-2 border rounded"
                                    value={rule.business_hours_start}
                                    onChange={e => setRule({ ...rule, business_hours_start: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Business Hours End</label>
                                <input
                                    type="time"
                                    className="w-full p-2 border rounded"
                                    value={rule.business_hours_end}
                                    onChange={e => setRule({ ...rule, business_hours_end: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button onClick={saveRule}>Save Configuration</Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default CommunicationCenter;
