import React from 'react';
import { Zap, Settings } from 'lucide-react';
import { useAppContext } from '../../store';

export const MobileHeader = () => {
    const { openModal } = useAppContext();

    return (
        <>
            <style>{`
        .mobile-header { display: none; }
        @media (max-width: 768px) {
          .mobile-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 1rem;
            margin-bottom: 1rem;
            border-bottom: 2px solid var(--border-color);
          }
        }
      `}</style>
            <div className="mobile-header">
                <div style={{ fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap style={{ color: 'var(--accent-color)' }} size={20} />
                    100K Roadmap
                </div>
                <button
                    className="btn"
                    onClick={() => openModal('settings')}
                    style={{ padding: '6px', border: 'none', background: 'none' }}
                >
                    <Settings size={24} />
                </button>
            </div>
        </>
    );
};
