import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

const DataResearch = () => {
    const [activeTab, setActiveTab] = useState('analytics');

    // Mock Analysis Data
    const stats = [
        { label: 'Social Engagement', value: '+24%', color: 'text-green-600' },
        { label: 'Website Traffic', value: '12.5k', color: 'text-blue-600' },
        { label: 'Market Reach', value: '85/100', color: 'text-purple-600' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Data & Research</h2>
                <div className="flex bg-gray-100 rounded p-1">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Analytics
                    </button>
                    <button
                        onClick={() => setActiveTab('research')}
                        className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'research' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Research Hub
                    </button>
                </div>
            </div>

            {activeTab === 'analytics' ? (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        {stats.map((stat, i) => (
                            <Card key={i}>
                                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-current opacity-50 w-2/3" style={{ color: 'inherit' }}></div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card className="min-h-[300px] flex items-center justify-center bg-gray-50 border-dashed">
                        <div className="text-center text-gray-400">
                            <div className="mb-2"><Icon name="chart" size={40} /></div>
                            <p>Detailed Interactive Charts would render here (e.g. Recharts)</p>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-bold mb-2">Research Clipper</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <input placeholder="Source URL" className="p-2 border rounded w-full" />
                            <input placeholder="Tags (comma separated)" className="p-2 border rounded w-full" />
                        </div>
                        <textarea placeholder="Key Findings / Notes" className="p-2 border rounded w-full mt-4 h-24"></textarea>
                        <div className="mt-4 flex justify-end">
                            <Button>Save Finding</Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {[1, 2].map(i => (
                            <Card key={i}>
                                <h4 className="font-bold">Market Analysis: Q4 Trends</h4>
                                <a href="#" className="text-blue-600 text-sm hover:underline mb-2 block">https://example.com/report-q4</a>
                                <p className="text-gray-600 text-sm">Key insights regarding the shift in consumer behavior...</p>
                                <div className="mt-3 flex gap-2">
                                    <span className="bg-gray-100 text-xs px-2 py-1 rounded">#market</span>
                                    <span className="bg-gray-100 text-xs px-2 py-1 rounded">#trends</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataResearch;
