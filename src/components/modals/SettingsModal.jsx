import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../supabase';
import { useAppContext } from '../../store';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';

export const SettingsModal = () => {
    const { state, updateState, activeModal, closeModal } = useAppContext();

    const [goal, setGoal] = useState(state.settings.revenueGoal);

    useEffect(() => {
        if (activeModal === 'settings') {
            setGoal(state.settings.revenueGoal);
        }
    }, [activeModal, state.settings]);

    if (activeModal !== 'settings') return null;

    const handleSave = () => {
        updateState(prev => ({
            settings: { ...prev.settings, revenueGoal: Number(goal) || 50000 }
        }));
        closeModal();
    };

    const handleToggleDarkMode = (e) => {
        const isDark = e.target.checked;
        updateState(prev => ({
            settings: { ...prev.settings, darkMode: isDark }
        }));
    };

    return (
        <div className="modal-overlay active">
            <div className="modal">
                <div className="flex justify-between items-center mb-3">
                    <h2 style={{ margin: 0 }}>Settings</h2>
                    <button className="btn" style={{ padding: '4px', border: 'none', background: 'none' }} onClick={closeModal}>
                        <X size={24} />
                    </button>
                </div>

                <label className="metric-label mb-1" style={{ display: 'block' }}>Revenue Goal ($)</label>
                <input
                    type="number"
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                />

                <div className="mt-3 mb-4">
                    <Toggle label="Dark Mode" checked={state.settings.darkMode} onChange={handleToggleDarkMode} />
                </div>

                <div className="mt-4 pt-4 text-center" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <Button
                        style={{ width: '100%', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}
                        onClick={async () => {
                            await supabase.auth.signOut();
                            closeModal();
                        }}
                    >
                        Sign Out
                    </Button>
                </div>

                <Button variant="primary" className="mt-4 w-full" onClick={handleSave}>
                    Save & Close
                </Button>
            </div>
        </div>
    );
};
