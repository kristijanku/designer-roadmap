import React from 'react';

export const Metric = ({ label, value, valueClass = '', valueStyle = {} }) => (
    <div className="metric flex-col" style={{ gap: '0.25rem' }}>
        <span className="metric-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            {label}
        </span>
        <span className={`metric-value ${valueClass}`} style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-main)', letterSpacing: '0.02em', ...valueStyle }}>
            {value}
        </span>
    </div>
);
