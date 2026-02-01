import React, { useState, useEffect, useRef } from 'react';
import API_URL from "../config/api";
import Card from '../../components/Card';
import Button from '../../components/Button';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(prev => {
                    if (prev.length !== data.length) return data;
                    return prev;
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Optimistic UI update
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const tempMsg = {
            id: Date.now(),
            content: input,
            senderId: user.id || 'me',
            createdAt: new Date(),
            sender: { name: 'Me' } // Mock
        };
        setMessages([...messages, tempMsg]);
        setInput('');

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: tempMsg.content,
                    receiverId: 'mock-assistant-id' // In real app, select user
                })
            });
            fetchMessages();
        } catch (err) {
            console.error('Send failed');
        }
    };

    return (
        <Card className="flex flex-col h-[calc(100vh-140px)] p-0">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center rounded-t-lg">
                <div>
                    <h2 className="font-bold text-lg">My Assistant</h2>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <p>No messages yet.</p>
                        <p className="text-sm">Start a conversation with your assistant.</p>
                    </div>
                )}
                {messages.map((msg) => {
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    const isMe = msg.senderId === user.id || msg.senderId === 'me';

                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                }`}>
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 rounded-b-lg flex gap-2">
                <input
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <Button type="submit" className="px-6">Send</Button>
            </form>
        </Card>
    );
};

export default Chat;
