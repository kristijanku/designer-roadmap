import React, { useState } from 'react';
import { useAppContext } from '../../store';
import { Button } from '../ui/Button';

export const OnboardingModal = () => {
    const { state, updateState } = useAppContext();

    const [name, setName] = useState('');
    const [goal, setGoal] = useState('50000');
    const [stage, setStage] = useState('1');

    if (state.user.onboarded) return null;

    const handleStart = () => {
        updateState(prev => ({
            user: { ...prev.user, name: name || 'Designer', onboarded: true },
            settings: { ...prev.settings, revenueGoal: Number(goal) || 50000 },
            progress: { ...prev.progress, currentStage: Number(stage) }
        }));
    };

    return (
        <div className="modal-overlay active">
            <div className="modal">
                <h2 className="mb-2">Welcome to the Journey</h2>
                <p className="mb-4">Let's set up your roadmap to a stable, profitable design business.</p>

                <label className="metric-label mb-1" style={{ display: 'block' }}>What should we call you?</label>
                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <label className="metric-label mb-1 mt-3" style={{ display: 'block' }}>Starting Revenue Target ($)</label>
                <p className="text-sm mb-2">Aim for a baseline (e.g., $50,000 to replace a job). You can scale this later.</p>
                <input
                    type="number"
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                />

                <label className="metric-label mb-1 mt-3" style={{ display: 'block' }}>Where are you starting?</label>
                <select value={stage} onChange={e => setStage(e.target.value)}>
                    <option value="1">Stage 1: Survival (Just starting, building skills)</option>
                    <option value="2">Stage 2: Stability (Have skills, need real clients)</option>
                    <option value="3">Stage 3: Systems (Have clients, need repeatable processes)</option>
                </select>

                <Button variant="primary" className="mt-4 w-full" onClick={handleStart}>
                    Start Building
                </Button>
            </div>
        </div>
    );
};
