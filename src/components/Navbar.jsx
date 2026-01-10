import React from 'react';
import Button from './Button';

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="container h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Logo Placeholder - Text for now */}
                    <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                        MilAssist
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#mission" className="text-sm font-medium hover:text-primary transition-colors">Mission</a>
                    <a href="#problem" className="text-sm font-medium hover:text-primary transition-colors">Why Us</a>
                    <a href="#solution" className="text-sm font-medium hover:text-primary transition-colors">Solutions</a>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="secondary" className="text-sm py-2 px-4">Log In</Button>
                    <Button className="text-sm py-2 px-4">Get Started</Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
