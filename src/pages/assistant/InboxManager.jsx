import React, { useState, useEffect } from 'react';
import API_URL from "../../config/api";
import Card from '../../components/Card';
import Button from '../../components/Button';

const InboxManager = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [replyBody, setReplyBody] = useState('');

    useEffect(() => {
        // Fetch clients assigned to this assistant
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const token = localStorage.getItem('token');
            // This would be a new endpoint to get assigned clients
            // For now, mock it
            setClients([
                { id: '1', name: 'John Doe', email: 'john@example.com' },
                { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
            ]);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMessages = async (clientId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/email/messages/${clientId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
                setSelectedClient(data);
            } else {
                alert('Client has not connected their email yet');
                setMessages([]);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleSendReply = async () => {
        if (!replyBody.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/email/send/${selectedClient.userId || selectedClient.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    to: replyTo.from,
                    subject: `Re: ${replyTo.subject}`,
                    body: replyBody
                })
            });

            if (res.ok) {
                alert('Reply sent successfully');
                setReplyTo(null);
                setReplyBody('');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to send reply');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Inbox Manager</h2>
            <p className="text-gray-600">Manage your clients' email inboxes.</p>

            <div className="grid grid-cols-3 gap-6">
                {/* Client List */}
                <Card className="col-span-1">
                    <h3 className="font-bold mb-4">Clients</h3>
                    <div className="space-y-2">
                        {clients.map(client => (
                            <button
                                key={client.id}
                                onClick={() => fetchMessages(client.id)}
                                className={`w-full text-left p-3 rounded border transition-colors ${
                                    selectedClient?.id === client.id 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <div className="font-medium">{client.name}</div>
                                <div className="text-xs text-gray-500">{client.email}</div>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Message List */}
                <Card className="col-span-2">
                    {!selectedClient ? (
                        <div className="text-center text-gray-500 py-12">
                            Select a client to view their inbox
                        </div>
                    ) : loading ? (
                        <div className="text-center py-12">Loading messages...</div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold">
                                    {selectedClient.email} ({messages.length} messages)
                                </h3>
                                <span className="text-xs text-gray-500 capitalize">
                                    via {selectedClient.provider}
                                </span>
                            </div>

                            {messages.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No messages</p>
                            ) : (
                                <div className="space-y-2">
                                    {messages.map(msg => (
                                        <div 
                                            key={msg.id} 
                                            className={`p-4 border rounded cursor-pointer hover:bg-gray-50 ${
                                                !msg.isRead ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-medium">{msg.from}</div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(msg.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="font-medium text-sm mb-1">{msg.subject}</div>
                                            <div className="text-sm text-gray-600 mb-3">{msg.snippet}</div>
                                            <Button 
                                                variant="secondary" 
                                                className="text-xs py-1 px-3"
                                                onClick={() => setReplyTo(msg)}
                                            >
                                                Reply
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </Card>
            </div>

            {/* Reply Modal */}
            {replyTo && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-2xl">
                        <h3 className="text-lg font-bold mb-4">Reply to: {replyTo.from}</h3>
                        <div className="mb-4">
                            <div className="text-sm text-gray-600 mb-2">Subject: Re: {replyTo.subject}</div>
                            <textarea
                                className="w-full h-48 p-3 border border-gray-300 rounded"
                                placeholder="Type your reply..."
                                value={replyBody}
                                onChange={e => setReplyBody(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => { setReplyTo(null); setReplyBody(''); }}>
                                Cancel
                            </Button>
                            <Button onClick={handleSendReply}>Send Reply</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default InboxManager;
