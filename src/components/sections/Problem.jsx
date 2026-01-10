import React from 'react';
import Card from '../Card';

const Problem = () => {
    return (
        <section id="problem" className="py-20 bg-white">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">The Challenge</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Connecting talented professionals with the businesses that need them, despite geographic barriers.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="h-full border-t-4" style={{ borderColor: 'var(--color-secondary)' }}>
                        <h3 className="text-2xl font-bold mb-4">For Military Spouses</h3>
                        <p className="text-gray-600 mb-4">
                            Chronic underemployment due to frequent relocations (PCS), time zone shifts, and credential portability issues makes it hard to build a sustained career.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Frequent career interruptions</li>
                            <li>Difficulty maintaining networks</li>
                            <li>Underutilization of skills</li>
                        </ul>
                    </Card>

                    <Card className="h-full border-t-4" style={{ borderColor: 'var(--color-primary)' }}>
                        <h3 className="text-2xl font-bold mb-4">For Businesses</h3>
                        <p className="text-gray-600 mb-4">
                            Struggling to find reliable, trusted virtual support that can operate asynchronously and at scale without the overhead of full-time hiring.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Inconsistent quality from freelancers</li>
                            <li>Time zone coordination headaches</li>
                            <li>Lack of continuity</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default Problem;
