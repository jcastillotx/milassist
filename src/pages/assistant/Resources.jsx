import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

const Resources = () => {
    // Mock Data
    const [resources] = useState([
        { id: 1, title: 'Onboarding Checklist', type: 'checklist', category: 'Onboarding' },
        { id: 2, title: 'Email Etiquette Guide', type: 'guide', category: 'Communication' },
        { id: 3, title: 'Time Tracking Standard', type: 'guide', category: 'Tools' },
        { id: 4, title: 'Travel Booking Template', type: 'template', category: 'Travel' },
    ]);

    const getIconName = (type) => {
        switch (type) {
            case 'checklist': return 'checklist';
            case 'guide': return 'guide';
            case 'template': return 'template';
            default: return 'pin';
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Assistant Academy & Resources</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((res) => (
                    <Card key={res.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                            <Icon name={getIconName(res.type)} size={24} />
                            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase">
                                {res.category}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{res.title}</h3>
                        <p className="text-sm text-gray-500 capitalize mb-4">{res.type}</p>
                        <Button variant="secondary" className="w-full text-sm">View Resource</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Resources;
