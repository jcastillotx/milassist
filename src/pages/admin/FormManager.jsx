import React, { useState, useEffect } from 'react';
import API_URL from "../config/api";
import { useNavigate } from 'react-router-dom';
import API_URL from "../config/api";
import Button from '../../components/Button';
import API_URL from "../config/api";
import Card from '../../components/Card';
import API_URL from "../config/api";

const FormManager = () => {
    const [templates, setTemplates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/forms/templates`)
            .then(res => res.json())
            .then(data => setTemplates(data))
            .catch(err => console.error(err));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this form?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/forms/templates/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setTemplates(templates.filter(t => t.id !== id));
            }
        } catch (err) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Form Manager</h2>
                <Button onClick={() => navigate('/admin/forms/new')}>+ New Form</Button>
            </div>

            <Card>
                <div className="space-y-4">
                    {templates.length === 0 && <p className="text-gray-500 text-center">No forms created yet.</p>}
                    {templates.map(template => (
                        <div key={template.id} className="flex justify-between items-center p-4 border border-gray-100 rounded bg-gray-50 hover:bg-white transition-colors">
                            <div>
                                <h3 className="font-bold">{template.title}</h3>
                                <p className="text-xs text-gray-500">{template.fields?.length || 0} Fields</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" className="text-sm" onClick={() => navigate(`/admin/forms/edit/${template.id}`)}>Edit</Button>
                                <button onClick={() => handleDelete(template.id)} className="text-red-500 hover:text-red-700 text-sm px-3">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default FormManager;
