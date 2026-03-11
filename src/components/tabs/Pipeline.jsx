import React from 'react';
import { useAppContext } from '../../store';
import { Card } from '../ui/Card';
import { Metric } from '../ui/Metric';
import { Button } from '../ui/Button';

const PIPELINE_STATUSES = ["Following", "Engaging", "DM Sent", "Call Scheduled", "Proposal Sent", "Won", "Lost"];

export const Pipeline = () => {
    const { state, openModal } = useAppContext();
    const { leads } = state;

    const activeStatuses = ["Following", "Engaging", "DM Sent", "Call Scheduled", "Proposal Sent"];
    const activeCount = leads.filter(l => activeStatuses.includes(l.status)).length;

    const won = leads.filter(l => l.status === 'Won').length;
    const lost = leads.filter(l => l.status === 'Lost').length;
    const resolved = won + lost;
    const rate = resolved > 0 ? Math.round((won / resolved) * 100) : 0;

    const wonRev = leads.filter(l => l.status === 'Won').reduce((sum, l) => sum + (Number(l.revenue) || 0), 0);
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

    return (
        <div className="tab-content active" id="leads">
            <div className="flex justify-between items-center mb-1">
                <h1>Pipeline</h1>
                <Button variant="primary" onClick={() => openModal({ type: 'lead', leadId: null })}>+ New Lead</Button>
            </div>
            <p className="mb-4">Track conversations. Follow up. Close deals.</p>

            <div className="grid-4 mb-4">
                <Card style={{ marginBottom: 0, padding: '1rem' }}>
                    <Metric label="Total Contacts" value={leads.length} />
                </Card>
                <Card style={{ marginBottom: 0, padding: '1rem' }}>
                    <Metric label="Active Leads" value={activeCount} />
                </Card>
                <Card style={{ marginBottom: 0, padding: '1rem' }}>
                    <Metric label="Conversion" value={`${rate}%`} />
                </Card>
                <Card style={{ marginBottom: 0, padding: '1rem' }}>
                    <Metric label="Revenue Won" value={formatter.format(wonRev)} />
                </Card>
            </div>

            <div className="pipeline">
                {PIPELINE_STATUSES.map(status => {
                    const colLeads = leads.filter(l => l.status === status);
                    return (
                        <div key={status} className="pipeline-col">
                            <div className="col-header">
                                <span>{status}</span>
                                <span>{colLeads.length}</span>
                            </div>
                            {colLeads.map(lead => {
                                let reminderHtml = null;
                                if (status === 'DM Sent') {
                                    const dUpdated = new Date(lead.dateUpdated || lead.dateAdded);
                                    const daysSince = Math.floor((new Date() - dUpdated) / (1000 * 60 * 60 * 24));
                                    if (daysSince >= 7) {
                                        reminderHtml = <div className="mt-2 inline-block font-semibold px-2 py-1 uppercase text-[0.7rem] bg-[var(--text-main)] text-[var(--surface-color)]">Follow up? ({daysSince}d)</div>;
                                    }
                                }

                                return (
                                    <div
                                        key={lead.id}
                                        className="card"
                                        onClick={() => openModal({ type: 'lead', leadId: lead.id })}
                                        style={{ padding: '1rem', marginBottom: 0, cursor: 'pointer' }}
                                    >
                                        <span className="inline-block text-[0.65rem] uppercase tracking-wider px-1.5 py-0.5 border border-[var(--border-color)] text-[var(--text-muted)] mb-2">
                                            {lead.platform}
                                        </span>
                                        <h4 style={{ margin: 0, textTransform: 'none', letterSpacing: 'normal' }}>{lead.name}</h4>
                                        <p className="text-sm mt-1">{lead.company || 'No company'}</p>
                                        {status === 'Won' && lead.revenue && (
                                            <p className="text-sm mt-1 text-success font-medium">${lead.revenue}</p>
                                        )}
                                        {reminderHtml}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
