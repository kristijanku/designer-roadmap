import React, { useState } from 'react';
import { useAppContext } from '../../store';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';

export const DailyActions = () => {
    const { state, updateState } = useAppContext();
    const { daily } = state;
    const [newTask, setNewTask] = useState('');

    const completed = daily.tasks.filter(t => t.completed).length;
    const pct = daily.tasks.length > 0 ? Math.round((completed / daily.tasks.length) * 100) : 0;

    const toggleTask = (id) => {
        updateState(prev => {
            const newTasks = prev.daily.tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            return { daily: { ...prev.daily, tasks: newTasks } };
        });
    };

    const deleteTask = (id) => {
        updateState(prev => {
            const newTasks = prev.daily.tasks.filter(task => task.id !== id);
            return { daily: { ...prev.daily, tasks: newTasks } };
        });
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        updateState(prev => ({
            daily: {
                ...prev.daily,
                tasks: [
                    ...prev.daily.tasks,
                    {
                        id: 't_' + Date.now(),
                        text: newTask.trim(),
                        completed: false,
                        type: 'custom'
                    }
                ]
            }
        }));
        setNewTask('');
    };

    return (
        <div className="tab-content active">
            <div className="flex justify-between items-center mb-1">
                <h1>Daily Actions</h1>
                <div className="text-accent" style={{ fontWeight: 700, fontSize: '1.5rem' }}>{pct}%</div>
            </div>
            <p className="mb-4">Small, repeatable actions. This list regenerates daily based on your current stage.</p>

            <Card>
                <div>
                    {daily.tasks.map(t => (
                        <div key={t.id} className="flex justify-between items-start" style={{ gap: '1rem', borderBottom: '1px solid var(--border-color)', padding: '12px 0' }}>
                            <div style={{ width: '100%' }}>
                                <Checkbox
                                    label={t.text}
                                    checked={t.completed}
                                    onChange={() => toggleTask(t.id)}
                                />
                            </div>
                            {t.type === 'custom' && (
                                <button
                                    className="btn"
                                    style={{ padding: '2px 6px', border: 'none', background: 'none', color: 'var(--text-light)' }}
                                    onClick={() => deleteTask(t.id)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <form onSubmit={addTask} className="flex gap-2">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a custom task for today..."
                            style={{ marginBottom: 0 }}
                        />
                        <Button type="submit" variant="primary">Add</Button>
                    </form>
                </div>
            </Card>
        </div>
    );
};
