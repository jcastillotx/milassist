import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Integrations = () => {
    // Mock data - in real app, fetch from /api/integrations
    const [integrations, setIntegrations] = useState([
        { id: 1, provider: 'Zapier', status: 'active', settings: { webhookUrl: 'https://hooks.zapier.com/...' } },
        { id: 2, provider: 'Gmail', status: 'inactive', settings: {} },
        { id: 3, provider: 'Zoom', status: 'active', settings: { clientId: '...' } },
    ]);

    const toggleStatus = (id) => {
        setIntegrations(integrations.map(ing =>
            ing.id === id ? { ...ing, status: ing.status === 'active' ? 'inactive' : 'active' } : ing
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Integrations</h2>
                <Button>Add New Integration</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {integrations.map((ing) => (
                    <Card key={ing.id} className="flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold">{ing.provider}</h3>
                                <p className="text-sm text-gray-500 capitalize">Status:
                                    <span className={`ml-2 font-medium ${ing.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                                        {ing.status}
                                    </span>
                                </p>
                            </div>
                            {/* Icon placeholder */}
                            <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                        </div>

                        {ing.provider === 'Zapier' && (
                            <div className="bg-gray-50 p-3 rounded text-sm font-mono break-all mb-4">
                                {ing.settings.webhookUrl || 'No Webhook URL configured'}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-auto">
                            <Button variant="secondary" className="text-xs py-1 px-3">Configure</Button>
                            <Button
                                variant={ing.status === 'active' ? 'secondary' : 'primary'}
                                className="text-xs py-1 px-3"
                                onClick={() => toggleStatus(ing.id)}
                            >
                                {ing.status === 'active' ? 'Disconnect' : 'Connect'}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Integrations;
