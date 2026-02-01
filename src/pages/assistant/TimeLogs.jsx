import React, { useState, useEffect } from 'react';
import API_URL from "../config/api";
import Card from '../../components/Card';
import API_URL from "../config/api";

const TimeLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/time`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setLogs(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Time Logs</h2>

            <Card>
                {loading ? <p>Loading...</p> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-500 uppercase">
                                    <th className="p-3">Client</th>
                                    <th className="p-3">Task / Description</th>
                                    <th className="p-3">Start Time</th>
                                    <th className="p-3">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-4 text-center text-gray-400">No time logs found.</td>
                                    </tr>
                                )}
                                {logs.map(log => (
                                    <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="p-3 font-medium">{log.client?.name || '-'}</td>
                                        <td className="p-3">
                                            {log.Task ? (
                                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mr-2">
                                                    {log.Task.title}
                                                </span>
                                            ) : null}
                                            {log.description || 'No description'}
                                        </td>
                                        <td className="p-3 text-gray-500">
                                            {new Date(log.startTime).toLocaleString()}
                                        </td>
                                        <td className="p-3 font-mono font-bold text-gray-700">
                                            {formatDuration(log.duration_seconds)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TimeLogs;
