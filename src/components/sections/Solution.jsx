import React from 'react';
import Card from '../Card';

const Solution = () => {
    const features = [
        {
            title: "Vetted Talent",
            description: "We rigorously screen and train military spouses, ensuring top-tier professionalism and reliability."
        },
        {
            title: "Managed Continuity",
            description: "Our platform ensures that if a VA moves or takes leave, a backup is ready. Quality is systemic, not heroic."
        },
        {
            title: "Time Zone Mastery",
            description: "Leverage our distributed work force to get work done around the clock, or in your specific time zone."
        },
        {
            title: "Meaningful Income",
            description: "We provide portable careers that move with the military family, stabilizing household finances."
        }
    ];

    return (
        <section id="solution" className="py-20" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Solution</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        MilAssist bridges the gap with a managed platform that enforces operational quality.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="hover:bg-white transition-colors">
                            <h4 className="text-xl font-bold mb-3" style={{ color: 'var(--color-primary)' }}>{feature.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Solution;
