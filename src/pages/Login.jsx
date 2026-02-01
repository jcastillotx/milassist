import React, { useState } from 'react';
import API_URL from "../config/api";
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@milassist.com'); // Pre-fill for demo
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect based on role
                if (data.user.role === 'admin') navigate('/admin');
                else if (data.user.role === 'client') navigate('/client');
                else navigate('/assistant');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error: Ensure backend is running');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Log In to MilAssist</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button className="w-full py-2">Sign In</Button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Demo: Use <b>admin@milassist.com</b> / <b>password123</b>
                </p>
            </Card>
        </div>
    );
};

export default Login;
