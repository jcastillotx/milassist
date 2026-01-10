import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const AssistantOverview = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Assistant Dashboard</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold">$2,450</p>
                    <p className="text-xs text-green-600 mt-1">Pending payout</p>
                </Card>
                <Card>
                    <p className="text-sm text-gray-500 mb-1">Active Clients</p>
                    <p className="text-2xl font-bold">2</p>
                </Card>
                <Card>
                    <p className="text-sm text-gray-500 mb-1">Profile Views</p>
                    <p className="text-2xl font-bold">14</p>
                </Card>
                <Card>
                    <p className="text-sm text-gray-500 mb-1">Job Matches</p>
                    <p className="text-2xl font-bold">5</p>
                </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <Card className="md:col-span-2">
                    <h3 className="text-lg font-bold mb-4">Recommended Jobs</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((job) => (
                            <div key={job} className="border border-gray-100 rounded p-4 hover:border-gray-200 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold">Executive Assistant needed</h4>
                                        <p className="text-sm text-gray-600 mb-2">Remote • 20hrs/week • EST</p>
                                        <div className="flex gap-2">
                                            <span className="bg-gray-100 text-xs px-2 py-1 rounded">Calendar</span>
                                            <span className="bg-gray-100 text-xs px-2 py-1 rounded">Travel</span>
                                        </div>
                                    </div>
                                    <Button variant="secondary" className="text-xs">Apply</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-bold mb-4">Profile Status</h3>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Completeness</span>
                        <span className="text-sm font-bold">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <ul className="text-sm space-y-2 text-gray-600 mb-6">
                        <li className="flex items-center gap-2 text-green-600">✓ Identity Verified</li>
                        <li className="flex items-center gap-2 text-green-600">✓ Skills Assessment</li>
                        <li className="flex items-center gap-2 text-gray-400">○ Video Intro (Pending)</li>
                    </ul>
                    <Button variant="secondary" className="w-full text-sm">Edit Profile</Button>
                </Card>
            </div>
        </div>
    );
};

export default AssistantOverview;
