import React, { useState, useEffect } from 'react';
import API_URL from "../config/api";
import Button from '../components/Button';
import API_URL from "../config/api";
import Card from '../components/Card';
import API_URL from "../config/api";

const TaskHandoffModal = ({ task, onClose, onSuccess }) => {
    const [assistants, setAssistants] = useState([]);
    const [selectedAssistant, setSelectedAssistant] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAssistants();
    }, []);

    const fetchAssistants = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/tasks/assistants/available`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Filter out current assistant
                const filtered = data.filter(a => a.id !== task.assistantId);
                setAssistants(filtered);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAssistant) {
            alert('Please select an assistant');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/tasks/${task.id}/handoff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    toAssistantId: selectedAssistant,
                    notes
                })
            });

            if (res.ok) {
                alert('Task handed off successfully!');
                onSuccess();
                onClose();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to hand off task');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to hand off task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Hand Off Task</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
                        ×
                    </button>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Transfer to Assistant *
                        </label>
                        <select
                            required
                            className="w-full p-3 border border-gray-300 rounded"
                            value={selectedAssistant}
                            onChange={e => setSelectedAssistant(e.target.value)}
                        >
                            <option value="">-- Select Assistant --</option>
                            {assistants.map(assistant => (
                                <option key={assistant.id} value={assistant.id}>
                                    {assistant.name} ({assistant.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Internal Notes
                        </label>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded h-32"
                            placeholder="Add context, current status, or special instructions for the new assistant..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            These notes are only visible to assistants, not clients.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Handing Off...' : 'Hand Off Task'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default TaskHandoffModal;
