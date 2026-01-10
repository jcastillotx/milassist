import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = {
        padding: '0.625rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        fontWeight: '500',
        fontSize: '0.875rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        fontFamily: 'inherit'
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff'
        },
        secondary: {
            backgroundColor: 'transparent',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)'
        }
    };

    return (
        <button
            className={className}
            style={{ ...baseStyles, ...variants[variant] }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
