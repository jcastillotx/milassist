import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';

const FormBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            const token = localStorage.getItem('token');
            fetch(`http://localhost:3000/forms/templates/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    setTitle(data.title);
                    setFields(data.fields || []);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const addField = () => {
        setFields([...fields, { label: '', type: 'text', required: false, options: '' }]);
    };

    const updateField = (index, key, value) => {
        const newFields = [...fields];
        newFields[index][key] = value;
        setFields(newFields);
    };

    const removeField = (index) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = id
                ? `http://localhost:3000/forms/templates/${id}`
                : 'http://localhost:3000/forms/templates';

            const method = id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, fields, is_active: true })
            });

            if (res.ok) {
                alert('Form Template Saved!');
                navigate('/admin/forms');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Button variant="secondary" onClick={() => navigate('/admin/forms')}>&larr; Back</Button>
                <h2 className="text-2xl font-bold">{id ? 'Edit Form' : 'New Form'}</h2>
                <Button onClick={handleSave}>Save Template</Button>
            </div>

            <Card>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="e.g. Travel Request"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={index} className="p-4 border border-gray-100 rounded bg-gray-50 flex gap-4 items-start">
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    placeholder="Field Label"
                                    value={field.label}
                                    onChange={(e) => updateField(index, 'label', e.target.value)}
                                />
                                <div className="flex gap-4">
                                    <select
                                        className="p-2 border border-gray-300 rounded text-sm w-1/3"
                                        value={field.type}
                                        onChange={(e) => updateField(index, 'type', e.target.value)}
                                    >
                                        <option value="text">Text Input</option>
                                        <option value="textarea">Text Area</option>
                                        <option value="date">Date</option>
                                        <option value="select">Dropdown</option>
                                    </select>
                                    <label className="flex items-center gap-2 text-sm text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={field.required}
                                            onChange={(e) => updateField(index, 'required', e.target.checked)}
                                        />
                                        Required
                                    </label>
                                </div>
                            </div>
                            <button
                                onClick={() => removeField(index)}
                                className="text-red-500 hover:text-red-700 font-bold"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <Button variant="secondary" onClick={addField} className="w-full mt-4 border-dashed">
                    + Add Field
                </Button>
            </Card>
        </div>
    );
};

export default FormBuilder;
