import React from 'react';

export const Toggle = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between">
        {label && <label className="metric-label">{label}</label>}
        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
            <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: checked ? 'var(--accent-color)' : 'var(--border-color)', transition: '.4s', borderRadius: '24px' }}></span>
            <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: checked ? '26px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
        </label>
    </div>
);
