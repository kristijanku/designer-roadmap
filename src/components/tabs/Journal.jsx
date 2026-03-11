import React, { useState } from 'react';
import { useAppContext } from '../../store';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const JOURNAL_PROMPTS = [
    "What's one thing you learned about design today?",
    "What felt hard today? What does that tell you?",
    "Who did you reach out to, and how did it go?",
    "What's one thing you'd do differently this week?",
    "What win — no matter how small — can you celebrate today?"
];

export const Journal = () => {
    const { state, updateState } = useAppContext();
    const { journal } = state;
    const [text, setText] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const promptIndex = new Date().getDay() % JOURNAL_PROMPTS.length;
    const dailyPrompt = JOURNAL_PROMPTS[promptIndex];

    const tagsList = ['Win', 'Lesson', 'Frustration', 'Idea', 'Gratitude'];

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const saveEntry = () => {
        if (!text.trim()) return;

        const getToday = () => new Date().toISOString().split('T')[0];

        updateState(prev => ({
            journal: [
                {
                    id: 'j_' + Date.now(),
                    date: getToday(),
                    prompt: dailyPrompt,
                    content: text.trim(),
                    tags: [...selectedTags]
                },
                ...prev.journal
            ]
        }));

        setText('');
        setSelectedTags([]);
    };

    const term = searchQuery.toLowerCase();
    const filteredJournal = journal.filter(j =>
        j.content.toLowerCase().includes(term) ||
        j.tags.some(t => t.toLowerCase().includes(term))
    );

    return (
        <div className="tab-content active" id="journal">
            <h1 className="mb-1">Reflection</h1>
            <p className="mb-4">What gets measured gets managed. What gets reflected on gets improved.</p>

            <Card className="mb-4">
                <h3 className="text-sm text-muted mb-2 uppercase">Today's Prompt</h3>
                <div style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-main)', marginBottom: '1rem' }}>
                    {dailyPrompt}
                </div>
                <textarea
                    rows="4"
                    placeholder="Write your thoughts here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <div className="flex flex-wrap gap-2 mb-3">
                    {tagsList.map(tag => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                style={{
                                    backgroundColor: isSelected ? 'var(--text-main)' : 'var(--surface-color)',
                                    color: isSelected ? 'var(--surface-color)' : 'var(--text-muted)',
                                    borderColor: isSelected ? 'var(--text-main)' : 'var(--border-color)',
                                    borderWidth: '2px',
                                    borderStyle: 'solid',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '4px 12px',
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.1s'
                                }}
                            >
                                {tag}
                            </button>
                        )
                    })}
                </div>
                <Button variant="primary" onClick={saveEntry}>Save Entry</Button>
            </Card>

            <h3 className="mb-3">Past Entries</h3>
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <Card style={{ padding: '0 1.5rem' }}>
                <div>
                    {filteredJournal.length === 0 ? (
                        <p className="py-4">No entries found.</p>
                    ) : (
                        filteredJournal.map((j, i) => (
                            <div key={j.id} style={{ padding: '1.5rem 0', borderBottom: i === filteredJournal.length - 1 ? 'none' : '2px solid var(--border-color)' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>
                                    {j.date}
                                </div>
                                <div className="text-sm font-medium mb-1" style={{ fontStyle: 'italic' }}>{j.prompt}</div>
                                <p style={{ color: 'var(--text-main)', whiteSpace: 'pre-wrap' }} className="mb-2">{j.content}</p>
                                <div className="flex flex-wrap gap-2" style={{ margin: 0 }}>
                                    {j.tags.map(t => (
                                        <span key={t} style={{
                                            backgroundColor: 'var(--surface-color)',
                                            color: 'var(--text-muted)',
                                            borderColor: 'var(--border-color)',
                                            borderWidth: '2px',
                                            borderStyle: 'solid',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '2px 8px',
                                            fontSize: '0.65rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            fontWeight: 600,
                                            cursor: 'default'
                                        }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
};
