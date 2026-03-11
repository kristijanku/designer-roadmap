import React from 'react';
import { LayoutDashboard, Route, CalendarDays, Users, BookOpen, Settings, Zap } from 'lucide-react';
import { useAppContext } from '../../store';

export const Navigation = () => {
    const { activeTab, setActiveTab, openModal } = useAppContext();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'roadmap', label: 'Roadmap', icon: Route },
        { id: 'daily', label: 'Daily Actions', icon: CalendarDays },
        { id: 'leads', label: 'Pipeline', icon: Users },
        { id: 'journal', label: 'Journal', icon: BookOpen },
    ];

    return (
        <>
            <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            width: 100% !important;
            height: 70px !important;
            top: auto !important;
            bottom: 0 !important;
            flex-direction: row !important;
            padding: 0 !important;
            border-right: none !important;
            border-top: 2px solid var(--nav-border) !important;
            justify-content: space-around !important;
            align-items: center !important;
          }
          .desktop-nav .logo { display: none !important; }
          .desktop-nav .nav-links { flex-direction: row !important; width: 100% !important; justify-content: space-around !important; gap: 0 !important; }
          .desktop-nav .nav-link { 
            flex-direction: column !important; 
            gap: 4px !important; 
            font-size: 0.65rem !important; 
            padding: 8px !important; 
            text-align: center !important; 
            border-left: none !important; 
            border-bottom: 4px solid transparent !important;
            background-color: transparent !important;
          }
          .desktop-nav .nav-link svg { width: 20px !important; height: 20px !important; }
          .desktop-nav .nav-link span { display: block !important; }
          .desktop-nav .nav-link.active { border-left-color: transparent !important; border-bottom-color: var(--accent-color) !important; }
          .desktop-nav .nav-bottom { display: none !important; }
        }
      `}</style>
            <nav style={{
                backgroundColor: 'var(--nav-bg)',
                borderRight: '2px solid var(--nav-border)',
                width: '260px',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                transition: 'background-color 0.3s, border-color 0.3s'
            }} className="desktop-nav">
                <div className="logo" style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '3rem',
                    padding: '0 0.5rem',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <Zap style={{ color: 'var(--accent-color)' }} size={24} />
                    100K Roadmap
                </div>

                <div className="nav-links flex-col flex-grow" style={{ gap: '0.25rem' }}>
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <a
                                key={item.id}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                                    fontWeight: isActive ? 600 : 500,
                                    fontSize: '0.85rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    transition: 'all 0.1s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    textDecoration: 'none',
                                    borderLeft: `4px solid ${isActive ? 'var(--accent-color)' : 'transparent'}`,
                                    backgroundColor: isActive ? 'var(--surface-hover)' : 'transparent'
                                }}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </a>
                        );
                    })}
                </div>

                <div className="nav-bottom" style={{
                    marginTop: 'auto',
                    borderTop: '2px solid var(--border-color)',
                    paddingTop: '1rem'
                }}>
                    <a
                        className="nav-link"
                        onClick={() => openModal('settings')}
                        style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </a>
                </div>
            </nav>
        </>
    );
};
