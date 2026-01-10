import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const DocumentReview = () => {
    const [documents, setDocuments] = useState([]);

    // Mock Data for now
    useEffect(() => {
        setDocuments([
            { id: 1, title: 'Q3 Financial Report', type: 'report', status: 'review_pending', url: '#' },
            { id: 2, title: 'Service Agreement', type: 'contract', status: 'approved', url: '#' },
        ]);
    }, []);

    const handleUpload = () => {
        // Mock upload
        alert('Upload feature would open file picker here.');
        const newDoc = { id: Date.now(), title: 'New Document.pdf', type: 'other', status: 'draft', url: '#' };
        setDocuments([...documents, newDoc]);
    };

    const handleAnalyze = async (docId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/ai/analyze-doc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ docId })
            });
            const data = await res.json();
            alert(`AI Analysis:\n\nSummary: ${data.summary}\n\nRisks: ${data.risks.join(', ')}`);
        } catch (err) {
            alert('Analysis failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Document Hub</h2>
                <Button onClick={handleUpload}>Upload Document</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-100 rounded text-2xl">
                                {doc.type === 'contract' ? '📝' : doc.type === 'report' ? '📊' : '📄'}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase
                ${doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    doc.status === 'review_pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                                {doc.status.replace('_', ' ')}
                            </span>
                        </div>

                        <h3 className="font-bold text-lg mb-1 truncate">{doc.title}</h3>
                        <p className="text-sm text-gray-500 mb-4 capitalize">{doc.type}</p>

                        <div className="flex gap-2">
                            <Button variant="secondary" className="w-full text-sm">Download</Button>
                            <Button
                                variant="secondary"
                                className="w-full text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200"
                                onClick={() => handleAnalyze(doc.id)}
                            >
                                ✨ Analyze
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default DocumentReview;
