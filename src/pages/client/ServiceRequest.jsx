import React, { useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';

const ServiceRequest = () => {
    // Mock Templates
    const templates = [
        { id: 1, title: 'Travel Booking' },
        { id: 2, title: 'Research Project' },
    ];

    const [selectedTemplate, setSelectedTemplate] = useState('');

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">New Service Request</h2>

            <div className="max-w-2xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Request Type</label>
                <select
                    className="w-full p-3 border border-gray-300 rounded mb-6"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                    <option value="">-- Choose a template --</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>

                {selectedTemplate && (
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Request Details</h3>
                        {/* Dynamic Form Render Placeholder */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea className="w-full p-2 border border-gray-300 rounded h-32"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input type="date" className="w-full p-2 border border-gray-300 rounded" />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button>Submit Request</Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ServiceRequest;
