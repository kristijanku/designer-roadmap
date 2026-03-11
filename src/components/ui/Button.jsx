import React from 'react';

export const Button = ({ children, variant = 'default', className = '', ...props }) => {
    const baseClass = 'btn';
    const variantClass = variant === 'primary' ? 'btn-primary' : '';
    return (
        <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
            {children}
        </button>
    );
};
