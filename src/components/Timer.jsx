import React, { useState, useEffect } from 'react';

const Timer = () => {
    const [running, setRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [description, setDescription] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check for active timer on mount
        const fetchCurrent = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/time/current', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const entry = await res.json();
                    if (entry) {
                        setRunning(true);
                        setDescription(entry.description || '');
                        const start = new Date(entry.startTime).getTime();
                        setSeconds(Math.floor((Date.now() - start) / 1000));
                    }
                }
            } catch (err) { console.error(err); }
        };
        fetchCurrent();
    }, []);

    useEffect(() => {
        let interval = null;
        if (running) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running]);

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const toggleTimer = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = running ? 'http://localhost:3000/time/stop' : 'http://localhost:3000/time/start';
            const method = 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ description })
            });

            if (res.ok) {
                if (running) {
                    setRunning(false);
                    setSeconds(0);
                    setDescription('');
                    alert('Timer stopped and logged.');
                } else {
                    setRunning(true);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 left-6 z-50 rounded-full shadow-lg h-14 w-14 flex items-center justify-center text-white transition-all hover:scale-105 ${running ? 'bg-red-500 animate-pulse' : 'bg-gray-800'}`}
                title="Time Tracker"
            >
                ⏱
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 left-6 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Time Tracker</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="text-center mb-4">
                <div className="text-3xl font-mono font-bold text-gray-800 tracking-wider">
                    {formatTime(seconds)}
                </div>
                <div className="text-xs text-gray-500 mt-1">{running ? 'Recording...' : 'Ready to start'}</div>
            </div>

            <div className="space-y-3">
                <input
                    className="w-full text-sm border-b border-gray-300 py-1 outline-none focus:border-blue-500 disabled:opacity-50"
                    placeholder="What are you working on?"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    disabled={running}
                />

                <button
                    onClick={toggleTimer}
                    className={`w-full py-2 rounded font-bold text-white transition-colors ${running ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {running ? 'Stop Timer' : 'Start Timer'}
                </button>
            </div>
        </div>
    );
};

export default Timer;
