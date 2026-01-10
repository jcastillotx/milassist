import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import Card from './Card';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hi! I am MilAssist Intelligence. I can see what you see. Upload a receipt or ask me anything.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMsg.text })
            });

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    // Mock Image Upload
    const handleImageUpload = () => {
        const userMsg = { role: 'user', text: '[Uploaded Image: receipt.jpg]' };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: 'I see a receipt from "OfficeDepot" for $45.20. Would you like me to add this to your expenses?' }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <Card className="w-80 h-96 mb-4 flex flex-col shadow-2xl border border-blue-100 p-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white flex justify-between items-center">
                        <h3 className="font-bold text-sm">MilAssist Intelligence</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">×</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-2 text-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && <div className="text-xs text-gray-500 italic ml-2">Thinking...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <button
                            type="button"
                            onClick={handleImageUpload}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Upload Image"
                        >
                            📷
                        </button>
                        <input
                            className="flex-1 text-sm outline-none"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                        <button type="submit" className="text-blue-600 font-bold text-sm">Send</button>
                    </form>
                </Card>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg flex items-center justify-center text-2xl hover:scale-105 transition-transform"
            >
                ✨
            </button>
        </div>
    );
};

export default AIAssistant;
