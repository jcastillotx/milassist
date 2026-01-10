import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const ClientOverview = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Client Dashboard</h2>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Assistant Profile */}
                <Card className="md:col-span-2">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Your Virtual Assistant</h3>
                            <p className="text-gray-500 text-sm">Dedicated support since Nov 2023</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Active</span>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                            JA
                        </div>
                        <div>
                            <p className="font-bold text-lg">Jane Assistant</p>
                            <p className="text-gray-600">jane@milassist.com</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded">
                            <p className="text-xs text-gray-500 uppercase">Primary Skill</p>
                            <p className="font-medium">Calendar Management</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                            <p className="text-xs text-gray-500 uppercase">Time Zone</p>
                            <p className="font-medium">EST (UTC-5)</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button>Message Jane</Button>
                        <Button variant="secondary">Book Sync Call</Button>
                    </div>
                </Card>

                {/* Quick Stats / Action */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-bold mb-2">Hours Used</h3>
                        <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>12.5 <span className="text-sm font-normal text-gray-500">/ 40 hrs</span></p>
                        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '30%', backgroundColor: 'var(--color-primary)' }}></div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold mb-4">Unpaid Invoices</h3>
                        <div className="flex justify-between items-center mb-4">
                            <span>Nov Retainer</span>
                            <span className="font-bold">$1,500.00</span>
                        </div>
                        <Button className="w-full text-sm">Pay Now</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ClientOverview;
