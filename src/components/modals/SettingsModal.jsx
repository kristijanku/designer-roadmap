import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../../store';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';

export const SettingsModal = () => {
    const { state, updateState, activeModal, closeModal } = useAppContext();

    const [goal, setGoal] = useState(state.settings.revenueGoal);
    const [darkMode, setDarkMode] = useState(state.settings.darkMode);

    useEffect(() => {
        if (activeModal === 'settings') {
            setGoal(state.settings.revenueGoal);
            setDarkMode(state.settings.darkMode);
        }
    }, [activeModal, state.settings]);

    if (activeModal !== 'settings') return null;

    const handleSave = () => {
        updateState(prev => ({
            settings: { ...prev.settings, revenueGoal: Number(goal) || 50000, darkMode }
        }));
        closeModal();
    };

    const exportData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "roadmap_backup_" + new Date().toISOString().split('T')[0] + ".json");
        dlAnchorElem.click();
    };

    const importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (imported.user && imported.settings) {
                    updateState(imported);
                    alert("Data imported successfully!");
                    closeModal();
                } else {
                    alert("Invalid backup file.");
                }
            } catch (err) {
                alert("Error parsing JSON file.");
            }
        };
        reader.readAsText(file);
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
                    <Toggle label="Dark Mode" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
                </div>

                <div className="grid-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <Button onClick={exportData}>Export JSON</Button>
                    <Button onClick={() => document.getElementById('importFile').click()}>Import JSON</Button>
                    <input type="file" id="importFile" style={{ display: 'none' }} accept=".json" onChange={importData} />
                </div>

                <Button variant="primary" className="mt-4 w-full" onClick={handleSave}>
                    Save & Close
                </Button>
            </div>
        </div>
    );
};
