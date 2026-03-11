import React from 'react';

export const Checkbox = ({ checked, onChange, label, disabled = false }) => (
    <label className="checkbox-wrapper">
        <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
        <span className="checkbox-text text-sm">{label}</span>
    </label>
);
