import React, { useState, useEffect } from 'react';
import API_URL from "../config/api";
import Card from '../../components/Card';
import API_URL from "../config/api";
import Button from '../../components/Button';
import API_URL from "../config/api";

const NDAEditor = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNDA = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/settings/nda_content', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setContent(data.value);
                } else {
                    // Default fallback if not set
                    setContent('MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis Agreement is made between MilAssist ("Company") and the undersigned ("Recipient")...');
                }
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchNDA();
    }, []);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/settings/nda_content', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ value: content })
            });

            if (res.ok) {
                alert('NDA Content updated successfully.');
            } else {
                alert('Failed to update.');
            }
        } catch (err) { console.error(err); }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">NDA Management</h1>
            <p className="text-gray-600">Edit the Non-Disclosure Agreement presented to assistants during onboarding.</p>

            <Card>
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700">Agreement Text</label>
                    <textarea
                        className="w-full h-96 p-4 border border-gray-300 rounded font-mono text-sm"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default NDAEditor;
