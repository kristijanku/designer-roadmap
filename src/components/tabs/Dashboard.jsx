import React from 'react';
import { useAppContext } from '../../store';
import { Card } from '../ui/Card';
import { Metric } from '../ui/Metric';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';

const QUOTES = [
    "Clients don't choose the best option. They choose the least risky one.",
    "Patterns = Leverage = Power, Money, Value.",
    "Stop selling your time. Sell outcomes.",
    "Edit, curate, be judicious.",
    "What got you here won't get you there.",
    "You can make more money, but you can't make more time.",
    "Close the imagination gap.",
    "Give them the best work they paid for, not the best work you can do."
];

export const Dashboard = () => {
    const { state, updateState, setActiveTab, openModal, STAGES_DATA } = useAppContext();
    const { settings, progress, daily, leads, journal } = state;
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

    const goal = settings.revenueGoal;
    const monthly = goal / 10;
    const minProj = monthly / 4;
    const wonRev = leads.filter(l => l.status === 'Won').reduce((sum, l) => sum + (Number(l.revenue) || 0), 0);

    let streakStr = `${progress.streak} Days Streak`;
    if (progress.streak >= 7) streakStr += ' 🔥';
    else if (progress.streak === 0) streakStr = "Start your streak today.";

    const progressPct = ((progress.currentStage - 1) / 4) * 100;

    const uncompletedTasks = daily.tasks.filter(t => !t.completed).slice(0, 3);

    // Weekly Pulse Logic
    const get7DaysAgo = () => {
        let d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().split('T')[0];
    };
    const weekAgoStr = get7DaysAgo();

    let totalDays = 0; let totalPct = 0;
    for (const [date, data] of Object.entries(daily.history)) {
        if (date >= weekAgoStr) {
            totalDays++;
            totalPct += (data.completed / data.total) * 100;
        }
    }
    if (daily.tasks.length > 0) {
        totalDays++;
        const tdComp = daily.tasks.filter(t => t.completed).length;
        totalPct += (tdComp / daily.tasks.length) * 100;
    }
    const avgPct = totalDays > 0 ? Math.round(totalPct / totalDays) : 0;
    const recentLeads = leads.filter(l => l.dateAdded >= weekAgoStr).length;
    const recentJournals = journal.filter(j => j.date >= weekAgoStr).length;

    // Memoize random quote so it doesn't change every render, or just rely on a hash of date if I wanted.
    // We'll just randomly pick it per mount for simplicity as in original HTML.
    const [quote] = React.useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    return (
        <div className="tab-content active" id="dashboard">
            <h1 className="mb-1">Morning, {state.user.name || 'Designer'}.</h1>
            <p className="mb-4">Let's build the machine today.</p>

            <Card>
                <div className="flex justify-between items-center mb-2">
                    <h3>The Journey</h3>
                    <div className="text-sm font-medium text-muted">
                        {streakStr}
                    </div>
                </div>
                <div className="mountain-tracker mt-3">
                    <style>{`
            .mountain-tracker {
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: relative;
              padding: 2.5rem 0 1rem 0;
            }
            .mountain-tracker::before {
              content: ''; position: absolute; top: 50%; left: 0; right: 0;
              height: 4px; background: var(--border-color); z-index: 1; transform: translateY(-50%);
            }
            .mountain-tracker::after {
              content: ''; position: absolute; top: 50%; left: 0; height: 4px;
              background: var(--accent-color); z-index: 1; transform: translateY(-50%);
              transition: width 0.5s ease; width: ${progressPct}%;
            }
            .stage-node {
              width: 24px; height: 24px; border-radius: 0; background-color: var(--surface-color);
              border: 4px solid var(--border-color); z-index: 2; display: flex; align-items: center; justify-content: center;
              font-weight: bold; font-size: 0; position: relative; transition: all 0.3s;
            }
            .stage-node.active { border-color: var(--accent-color); }
            .stage-node.active::after { content: ''; position: absolute; width: 8px; height: 8px; background-color: var(--accent-color); }
            .stage-node.completed { background-color: var(--text-main); border-color: var(--text-main); }
            .stage-label {
              position: absolute; top: 30px; white-space: nowrap; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
              letter-spacing: 0.05em; color: var(--text-muted); text-align: center;
            }
            .stage-node.active .stage-label { color: var(--accent-color); }
          `}</style>
                    {STAGES_DATA.map(s => (
                        <div key={s.id} className={`stage-node ${s.id < progress.currentStage ? 'completed' : ''} ${s.id === progress.currentStage ? 'active' : ''}`}>
                            <div className="stage-label">{s.name}</div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid-2 mb-4">
                <Card>
                    <div className="flex justify-between items-center mb-3">
                        <h3>Revenue Engine</h3>
                        <Button style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => openModal('settings')}>Edit Goal</Button>
                    </div>
                    <div className="metric mb-3">
                        <span className="metric-label">Annual Target</span>
                        <span className="metric-value text-accent">{formatter.format(goal)}</span>
                    </div>
                    <div className="grid-2" style={{ gap: '1rem' }}>
                        <Metric label="Monthly Target" value={formatter.format(monthly)} valueStyle={{ fontSize: '1.25rem' }} />
                        <Metric label="Min. Project" value={formatter.format(minProj)} valueStyle={{ fontSize: '1.25rem' }} />
                        <Metric label="Leads Needed" value="8-10/mo" valueStyle={{ fontSize: '1.25rem' }} />
                        <Metric label="Won YTD" value={formatter.format(wonRev)} valueStyle={{ fontSize: '1.25rem' }} valueClass="text-success" />
                    </div>
                </Card>

                <Card className="flex flex-col">
                    <h3 className="mb-3">Today's Focus</h3>
                    <div className="flex-grow">
                        {uncompletedTasks.length === 0 ? (
                            <p className="text-sm">All done for today. Great work.</p>
                        ) : (
                            uncompletedTasks.map(t => (
                                <Checkbox
                                    key={t.id}
                                    label={t.text}
                                    checked={t.completed}
                                    onChange={() => {
                                        updateState(prev => {
                                            const newTasks = prev.daily.tasks.map(task =>
                                                task.id === t.id ? { ...task, completed: !task.completed } : task
                                            );
                                            return { daily: { ...prev.daily, tasks: newTasks } };
                                        });
                                    }}
                                />
                            ))
                        )}
                    </div>
                    <p className="text-sm mt-3 text-right">
                        <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('daily'); }} style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                            View all daily actions →
                        </a>
                    </p>
                </Card>
            </div>

            <Card>
                <h3 className="mb-3">Weekly Pulse (Last 7 Days)</h3>
                <div className="grid-3">
                    <Metric label="Checklist Avg" value={`${avgPct}%`} />
                    <Metric label="New Leads" value={recentLeads} />
                    <Metric label="Journal Entries" value={recentJournals} />
                </div>
            </Card>

            <div className="quote-box">
                "{quote}"
            </div>
        </div>
    );
};
