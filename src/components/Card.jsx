import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    const baseStyles = {
        background: '#ffffff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-xl)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease'
    };

    return (
        <div
            className={className}
            style={baseStyles}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
