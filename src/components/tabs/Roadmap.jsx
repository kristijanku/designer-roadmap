import React, { useState } from 'react';
import { useAppContext } from '../../store';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';

export const Roadmap = () => {
    const { state, updateState, STAGES_DATA } = useAppContext();
    const { stages, progress } = state;
    const [openCards, setOpenCards] = useState({ [progress.currentStage]: true });

    const toggleCard = (id) => {
        setOpenCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleMilestone = (stageId, milestoneIdx, isChecked) => {
        updateState(prev => {
            const newStages = { ...prev.stages };
            newStages[stageId] = { ...newStages[stageId], milestones: [...newStages[stageId].milestones] };
            newStages[stageId].milestones[milestoneIdx] = isChecked;
            return { stages: newStages };
        });
    };

    const advanceStage = (currentStageId) => {
        if (currentStageId >= 5) return;

        updateState(prev => {
            const newStages = { ...prev.stages };
            newStages[currentStageId].completed = true;
            return {
                stages: newStages,
                progress: { ...prev.progress, currentStage: currentStageId + 1 }
            };
        });
        setOpenCards({ [currentStageId + 1]: true });

        // Trigger celebration effect
        const container = document.getElementById('roadmapContainer');
        if (container) {
            container.classList.add('celebrate');
            setTimeout(() => container.classList.remove('celebrate'), 2000);
        }
    };

    return (
        <div className="tab-content active" id="roadmapContainer">
            <h1 className="mb-1">Stage Roadmap</h1>
            <p className="mb-4">One-time achievements that unlock the next level of your business.</p>

            <div>
                {STAGES_DATA.map(s => {
                    const sData = stages[s.id] || { milestones: [], completed: false };
                    const isCurrent = progress.currentStage === s.id;
                    const isLocked = progress.currentStage < s.id;

                    const completedCount = sData.milestones.filter(Boolean).length;
                    const allMilestonesDone = completedCount === s.milestones.length;
                    const isOpen = openCards[s.id];

                    let statusText = isLocked ? 'Locked' : (sData.completed ? 'Completed' : 'In Progress');

                    return (
                        <div
                            key={s.id}
                            className={`stage-card ${sData.completed ? 'completed' : ''} ${isOpen ? 'open' : ''}`}
                            style={{
                                border: '2px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1rem',
                                backgroundColor: 'var(--surface-color)',
                                overflow: 'hidden',
                                opacity: isLocked ? 0.6 : 1
                            }}
                        >
                            <div
                                className="stage-header"
                                onClick={() => !isLocked && toggleCard(s.id)}
                                style={{
                                    padding: '1.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: isLocked ? 'not-allowed' : 'pointer',
                                    backgroundColor: 'var(--surface-color)'
                                }}
                            >
                                <div>
                                    <h3 style={{ margin: 0 }}>Stage {s.id}: {s.name}</h3>
                                    <p className="text-sm" style={{ marginTop: '4px' }}>{s.goal}</p>
                                </div>
                                <span className="stage-status" style={{
                                    fontSize: '0.7rem',
                                    padding: '4px 8px',
                                    border: '2px solid var(--border-color)',
                                    backgroundColor: sData.completed ? 'var(--text-main)' : 'var(--bg-color)',
                                    color: sData.completed ? 'var(--surface-color)' : 'var(--text-main)',
                                    fontWeight: 600,
                                    textTransform: 'uppercase'
                                }}>
                                    {statusText}
                                </span>
                            </div>

                            {isOpen && !isLocked && (
                                <div className="stage-body" style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '2px solid var(--border-color)' }}>
                                    <div className="mt-3">
                                        {s.milestones.map((mText, idx) => (
                                            <Checkbox
                                                key={idx}
                                                label={mText}
                                                checked={sData.milestones[idx] || false}
                                                disabled={isLocked}
                                                onChange={(e) => toggleMilestone(s.id, idx, e.target.checked)}
                                            />
                                        ))}
                                    </div>

                                    {isCurrent && allMilestonesDone ? (
                                        <div className="checkpoint-box" style={{
                                            backgroundColor: 'var(--surface-hover)',
                                            padding: '1.5rem',
                                            border: '2px solid var(--border-color)',
                                            borderRadius: 'var(--radius-sm)',
                                            marginTop: '1.5rem'
                                        }}>
                                            <p style={{ color: 'var(--text-main)', fontWeight: 500, fontStyle: 'normal', marginBottom: '1rem' }}>
                                                "{s.checkpoint}"
                                            </p>
                                            <Button variant="primary" onClick={() => advanceStage(s.id)}>
                                                Yes, I'm Ready for Stage {s.id + 1}
                                            </Button>
                                        </div>
                                    ) : isCurrent ? (
                                        <div className="checkpoint-box" style={{
                                            backgroundColor: 'var(--surface-hover)',
                                            padding: '1.5rem',
                                            border: '2px solid var(--border-color)',
                                            borderRadius: 'var(--radius-sm)',
                                            marginTop: '1.5rem',
                                            opacity: 0.5,
                                            filter: 'grayscale(1)'
                                        }}>
                                            <p style={{ margin: 0, fontSize: '0.875rem' }}>Complete all milestones to unlock checkpoint.</p>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
