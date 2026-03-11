import React from 'react';
import { useAppContext } from './store';

import { Navigation } from './components/layout/Navigation';
import { MobileHeader } from './components/layout/MobileHeader';

import { Dashboard } from './components/tabs/Dashboard';
import { Roadmap } from './components/tabs/Roadmap';
import { DailyActions } from './components/tabs/DailyActions';
import { Pipeline } from './components/tabs/Pipeline';
import { Journal } from './components/tabs/Journal';

import { OnboardingModal } from './components/modals/OnboardingModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { LeadModal } from './components/modals/LeadModal';

function App() {
  const { activeTab } = useAppContext();

  return (
    <>
      <Navigation />

      <main style={{
        marginLeft: '260px',
        padding: '3rem',
        width: 'calc(100% - 260px)',
        maxWidth: '1200px' // from the html 
      }} className="main-content">
        <style>{`
          @media (max-width: 768px) {
            .main-content {
              margin-left: 0 !important;
              padding: 1.5rem !important;
              width: 100% !important;
              margin-bottom: 70px !important; /* space for bottom nav */
            }
          }
        `}</style>

        <MobileHeader />

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'roadmap' && <Roadmap />}
        {activeTab === 'daily' && <DailyActions />}
        {activeTab === 'leads' && <Pipeline />}
        {activeTab === 'journal' && <Journal />}
      </main>

      <OnboardingModal />
      <SettingsModal />
      <LeadModal />
    </>
  );
}

export default App;
