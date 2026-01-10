import React from 'react';
import Button from '../Button';

const Hero = () => {
    return (
        <section id="hero" className="py-20 md:py-32 bg-gradient-to-br from-white to-gray-50">
            <div className="container text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight" style={{ color: 'var(--color-primary)' }}>
                    Empowering Military Spouses.<br />
                    <span style={{ color: 'var(--color-secondary)' }}>Reliable Support for Business.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                    MilAssist is a managed virtual assistance platform that matches vetted military spouses with clients to provide continuity, quality, and meaningful remote work.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="px-8 py-4 text-lg">Find a Virtual Assistant</Button>
                    <Button variant="secondary" className="px-8 py-4 text-lg">Apply as a VA</Button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
