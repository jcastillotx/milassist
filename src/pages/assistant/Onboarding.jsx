import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        location: '',
        bio: '',
        phone: ''
    });

    // Verification State
    const [showSheerID, setShowSheerID] = useState(false);
    const [verified, setVerified] = useState(false);
    const [verificationLoading, setVerificationLoading] = useState(false);

    const handleVerifyParams = () => {
        setVerificationLoading(true);
        // Simulate SheerID API delay
        setTimeout(() => {
            setVerificationLoading(false);
            setVerified(true);
            setShowSheerID(false);
            alert('Military Status Verified Successfully!');
        }, 2000);
    };

    const handleSubmit = async () => {
        if (!verified) return alert('Please complete military verification.');

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/users/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    verificationData: { verified: true, date: new Date(), provider: 'SheerID' }
                })
            });

            if (res.ok) {
                alert('Onboarding Complete!');
                navigate('/assistant'); // Go to dashboard
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-xl w-full">
                <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--color-primary)' }}>
                    Complete Your Profile
                </h1>

                <Card className="p-8">
                    {/* Progress Indicator */}
                    <div className="flex gap-2 mb-8">
                        <div className={`h-2 flex-1 rounded ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        <div className={`h-2 flex-1 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    </div>

                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Personal Details</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location (City, State)</label>
                                <input
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="San Diego, CA"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
                                <textarea
                                    rows="4"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell us about your experience..."
                                />
                            </div>
                            <Button onClick={() => setStep(2)} className="w-full">Next Step &rarr;</Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Military Verification</h2>
                            <p className="text-gray-600 text-sm">
                                We use SheerID to verify your status as a military spouse. This is required to access the platform.
                            </p>

                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                                {verified ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl">✓</div>
                                        <span className="font-bold text-green-700">Verification Successful</span>
                                        <p className="text-xs text-gray-500">Verified via SheerID on {new Date().toLocaleDateString()}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="text-gray-400 font-bold text-xl mb-2">SheerID</div>
                                        <Button onClick={() => setShowSheerID(true)} className="w-full bg-[#1e7fb2]">Verify Military Status</Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
                                <Button onClick={handleSubmit} disabled={!verified} className="flex-1">
                                    {loading ? 'Saving...' : 'Complete Profile'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Simulated SheerID Modal */}
            {showSheerID && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 bg-[#1e7fb2] text-white flex justify-between items-center">
                            <h3 className="font-bold">SheerID Verification</h3>
                            <button onClick={() => setShowSheerID(false)} className="text-white/80 hover:text-white">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-600">Please confirm your sponsor's details.</p>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Branch of Service</label>
                                <select className="w-full p-2 border border-gray-300 rounded">
                                    <option>Army</option>
                                    <option>Navy</option>
                                    <option>Air Force</option>
                                    <option>Marines</option>
                                    <option>Space Force</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Status</label>
                                <select className="w-full p-2 border border-gray-300 rounded">
                                    <option>Active Duty</option>
                                    <option>Veteran</option>
                                    <option>Retired</option>
                                </select>
                            </div>

                            <button
                                onClick={handleVerifyParams}
                                disabled={verificationLoading}
                                className="w-full py-3 bg-black text-white font-bold rounded mt-4"
                            >
                                {verificationLoading ? 'Verifying...' : 'Submit to SheerID'}
                            </button>

                            <p className="text-[10px] text-center text-gray-400 mt-2">
                                By clicking submit, you agree to SheerID's Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Onboarding;
