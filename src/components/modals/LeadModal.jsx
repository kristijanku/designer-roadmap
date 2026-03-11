import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../../store';
import { Button } from '../ui/Button';

export const LeadModal = () => {
    const { state, updateState, activeModal, closeModal } = useAppContext();
    const { leads } = state;

    const isOpen = activeModal?.type === 'lead';
    const editingId = activeModal?.leadId;

    const [formData, setFormData] = useState({
        name: '',
        company: '',
        platform: 'LinkedIn',
        status: 'Following',
        notes: '',
        revenue: 0
    });

    useEffect(() => {
        if (isOpen) {
            if (editingId) {
                const lead = leads.find(l => l.id === editingId);
                if (lead) {
                    setFormData({
                        name: lead.name,
                        company: lead.company || '',
                        platform: lead.platform,
                        status: lead.status,
                        notes: lead.notes || '',
                        revenue: lead.revenue || 0
                    });
                }
            } else {
                setFormData({
                    name: '',
                    company: '',
                    platform: 'LinkedIn',
                    status: 'Following',
                    notes: '',
                    revenue: 0
                });
            }
        }
    }, [isOpen, editingId, leads]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.name.trim()) return alert('Name is required');

        const getToday = () => new Date().toISOString().split('T')[0];

        updateState(prev => {
            let newLeads = [...prev.leads];
            const dataToSave = {
                ...formData,
                revenue: formData.status === 'Won' ? Number(formData.revenue) : 0,
                dateUpdated: getToday()
            };

            if (editingId) {
                newLeads = newLeads.map(l => l.id === editingId ? { ...l, ...dataToSave } : l);
            } else {
                newLeads.push({
                    id: 'l_' + Date.now(),
                    dateAdded: getToday(),
                    ...dataToSave
                });
            }

            return { leads: newLeads };
        });

        closeModal();
    };

    const handleDelete = () => {
        if (!window.confirm("Delete this lead?")) return;
        updateState(prev => ({
            leads: prev.leads.filter(l => l.id !== editingId)
        }));
        closeModal();
    };

    return (
        <div className="modal-overlay active">
            <div className="modal">
                <div className="flex justify-between items-center mb-3">
                    <h2 style={{ margin: 0 }}>{editingId ? 'Edit Lead' : 'Add Lead'}</h2>
                    <button className="btn" style={{ padding: '4px', border: 'none', background: 'none' }} onClick={closeModal}>
                        <X size={24} />
                    </button>
                </div>

                <input
                    type="text"
                    name="name"
                    placeholder="Contact Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="company"
                    placeholder="Company/Project"
                    value={formData.company}
                    onChange={handleChange}
                />
                <select name="platform" value={formData.platform} onChange={handleChange}>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Email">Email</option>
                    <option value="Referral">Referral</option>
                    <option value="Other">Other</option>
                </select>
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Following">Following</option>
                    <option value="Engaging">Engaging</option>
                    <option value="DM Sent">DM Sent</option>
                    <option value="Call Scheduled">Call Scheduled</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                </select>

                {formData.status === 'Won' && (
                    <div>
                        <label className="metric-label mb-1" style={{ display: 'block' }}>Project Revenue ($)</label>
                        <input
                            type="number"
                            name="revenue"
                            placeholder="e.g. 2500"
                            value={formData.revenue}
                            onChange={handleChange}
                        />
                    </div>
                )}

                <textarea
                    name="notes"
                    rows="3"
                    placeholder="Notes..."
                    value={formData.notes}
                    onChange={handleChange}
                ></textarea>

                <div className="flex justify-between mt-2">
                    {editingId ? (
                        <Button style={{ color: 'red', borderColor: 'red' }} onClick={handleDelete}>Delete</Button>
                    ) : <span></span>}
                    <Button variant="primary" onClick={handleSave}>Save Lead</Button>
                </div>
            </div>
        </div>
    );
};
