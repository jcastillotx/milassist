import React, { useState, useEffect } from 'react';
import API_URL from "../config/api";
import { useNavigate } from 'react-router-dom';
import API_URL from "../config/api";
import Card from '../components/Card';
import API_URL from "../config/api";
import Button from '../components/Button';
import API_URL from "../config/api";

const SetupWizard = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const navigate = useNavigate();

    const [adminData, setAdminData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [settings, setSettings] = useState({
        platformName: 'MilAssist',
        supportEmail: 'support@milassist.com',
        allowPublicRegistration: true
    });

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch(`${API_URL}/setup/status`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.initialized) {
                        setInitialized(true);
                    }
                }
            } catch (err) {
                console.error('Setup check failed', err);
            } finally {
                setLoading(false);
            }
        };
        checkStatus();
    }, []);

    const handleInit = async () => {
        if (adminData.password !== adminData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/setup/init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin: adminData, settings })
            });

            if (res.ok) {
                alert('Setup complete! You can now log in.');
                navigate('/login');
            } else {
                const error = await res.json();
                alert(error.error || 'Initialization failed');
            }
        } catch (err) {
            console.error(err);
            alert('Setup failed');
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    
    if (initialized) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
                <Card className="max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">System Initialized</h2>
                    <p className="text-gray-600 mb-6">The setup wizard is already completed and locked for security.</p>
                    <Button onClick={() => navigate('/login')}>Go to Login</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <Card className="max-w-2xl w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-indigo-600">Setup Wizard</h1>
                        <p className="text-gray-500">MilAssist Installation</p>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(s => (
                            <div 
                                key={s} 
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                    step === s ? 'bg-indigo-600 text-white' : 
                                    step > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                                }`}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center py-8">
                            <span className="text-6xl mb-4 block">🚀</span>
                            <h2 className="text-2xl font-bold">Welcome to MilAssist</h2>
                            <p className="text-gray-600 mt-2 max-w-md mx-auto">
                                We'll guide you through setting up your platform in just a few steps. 
                                Make sure your database is connected before proceeding.
                            </p>
                        </div>
                        <div className="flex justify-end mt-8">
                            <Button onClick={() => setStep(2)}>Get Started</Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">Step 2: Admin Account Setup</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label>Full Name</label>
                                <input 
                                    type="text" 
                                    value={adminData.name}
                                    onChange={e => setAdminData({...adminData, name: e.target.value})}
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    value={adminData.email}
                                    onChange={e => setAdminData({...adminData, email: e.target.value})}
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div>
                                <label>Password</label>
                                <input 
                                    type="password" 
                                    value={adminData.password}
                                    onChange={e => setAdminData({...adminData, password: e.target.value})}
                                    placeholder="Min 8 characters"
                                />
                            </div>
                            <div>
                                <label>Confirm Password</label>
                                <input 
                                    type="password" 
                                    value={adminData.confirmPassword}
                                    onChange={e => setAdminData({...adminData, confirmPassword: e.target.value})}
                                    placeholder="Repeat password"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between mt-8">
                            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                            <Button onClick={() => setStep(3)} disabled={!adminData.name || !adminData.email || !adminData.password}>Next Step</Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">Step 3: Platform Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label>Platform Name</label>
                                <input 
                                    type="text" 
                                    value={settings.platformName}
                                    onChange={e => setSettings({...settings, platformName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label>System Support Email</label>
                                <input 
                                    type="email" 
                                    value={settings.supportEmail}
                                    onChange={e => setSettings({...settings, supportEmail: e.target.value})}
                                />
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <input 
                                    type="checkbox" 
                                    id="allowReg"
                                    checked={settings.allowPublicRegistration}
                                    onChange={e => setSettings({...settings, allowPublicRegistration: e.target.checked})}
                                    className="w-5 h-5"
                                />
                                <label htmlFor="allowReg" className="mb-0">Enable Public Registration</label>
                            </div>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-6">
                            <p className="text-sm text-indigo-700">
                                <b>Important:</b> Upon clicking "Complete Setup", the system will be initialized and this wizard will be permanently disabled for security.
                            </p>
                        </div>
                        <div className="flex justify-between mt-8">
                            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                            <Button onClick={handleInit}>Complete Setup</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default SetupWizard;
