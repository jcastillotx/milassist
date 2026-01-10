import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const MeetingScheduler = () => {
    const [videoConnections, setVideoConnections] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        provider: 'zoom'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/video/connections', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setVideoConnections(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/meetings/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const meeting = await res.json();
                alert(`Meeting created! Join URL: ${meeting.meetingUrl}`);
                window.location.href = '/client/calendar';
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to create meeting');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to create meeting');
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (provider) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/video/auth/${provider}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const { authUrl } = await res.json();
                window.location.href = authUrl;
            }
        } catch (err) {
            console.error(err);
            alert('Failed to initiate connection');
        }
    };

    const activeConnection = videoConnections.find(c => c.provider === formData.provider && c.status === 'active');

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Schedule Meeting</h2>

            {!activeConnection ? (
                <Card className="bg-yellow-50 border-yellow-200">
                    <h3 className="font-bold mb-2">⚠️ No Video Provider Connected</h3>
                    <p className="text-sm text-gray-700 mb-4">
                        Connect a video conferencing platform to create meetings.
                    </p>
                    <div className="flex gap-3">
                        <Button onClick={() => handleConnect('zoom')}>Connect Zoom</Button>
                        <Button onClick={() => handleConnect('meet')} variant="secondary">Connect Google Meet</Button>
                        <Button onClick={() => handleConnect('teams')} variant="secondary">Connect Teams</Button>
                        <Button onClick={() => handleConnect('webex')} variant="secondary">Connect Webex</Button>
                    </div>
                </Card>
            ) : (
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meeting Title *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border border-gray-300 rounded"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Weekly Team Sync"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded h-24"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Meeting agenda or notes..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded"
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded"
                                    value={formData.endTime}
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Video Platform *
                            </label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded"
                                value={formData.provider}
                                onChange={e => setFormData({ ...formData, provider: e.target.value })}
                            >
                                {videoConnections.filter(c => c.status === 'active').map(conn => (
                                    <option key={conn.id} value={conn.provider}>
                                        {conn.provider.charAt(0).toUpperCase() + conn.provider.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Meeting'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};

export default MeetingScheduler;
