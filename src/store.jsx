import { createContext, useContext, useState, useEffect } from 'react';

const STAGES_DATA = [
  {
    id: 1, name: "Survival", goal: "Get good at the craft",
    milestones: [
      "Proficient in Figma (primary tool for Web/UI)",
      "Familiar with Adobe Illustrator basics",
      "Read 'Stop Stealing Sheep' by Erik Spiekermann",
      "Read 'Typography: Form & Communication' by Meggs & Carter",
      "Read 'Pioneer of Swiss Graphic Design' (Müller-Brockmann)",
      "Read 'The Geometry of Design' by Kimberly Elam",
      "Read 'A Smile in the Mind'",
      "Completed 10+ design exercises (tracing/emulating masterwork)",
      "Can articulate basic typography and grid principles",
      "Have 3-5 portfolio-quality pieces with consistent style",
      "Started posting design process on social media"
    ],
    checkpoint: "Do I have 3-5 pieces that show a consistent level of thinking and aesthetic, with everything else edited out?"
  },
  {
    id: 2, name: "Stability", goal: "Find your people, get real clients",
    milestones: [
      "Defined my ICP (Ideal Client Profile) — who I serve & what excites them",
      "Identified 5 target companies/people to follow this month",
      "Turned on notifications and engaged consistently for 30+ days",
      "Sent first warm outreach DM",
      "Built a portfolio website (Squarespace, Framer, or equivalent)",
      "Website has 3-5 case studies targeting my ICP industry",
      "Each case study follows structure: Client → Problem → Process → Result",
      "Successfully got on a sales call with a real prospect",
      "Quoted my price confidently on a call ($500/day or $2,500 minimum)",
      "Landed first paid project from outreach"
    ],
    checkpoint: "Can I get on a call, assess needs, state my price, and handle their reaction without flinching?"
  },
  {
    id: 3, name: "Systems", goal: "Turn chaos into a repeatable machine",
    milestones: [
      "Created my 5-step design process (Discovery → Exploration → Final → Application → QA)",
      "Documented the 5-step process on my website",
      "Built client onboarding documentation template",
      "Set up file structure template for new clients",
      "Set up project management board (Trello or equivalent)",
      "Created invoicing system (50% upfront → 25% milestone → 25% delivery)",
      "Built mockup template library (at least 5 mockup sets)",
      "Created brand style guide template",
      "Moved to flat project fees (no more hourly billing)",
      "Hitting consistent $4,000-$6,000 months"
    ],
    checkpoint: "Does every project follow the same process? Do clients feel guided, not confused?"
  },
  {
    id: 4, name: "Scale", goal: "Multiply through referrals & delegation",
    milestones: [
      "Asked for my first referral at the right moment",
      "Got a client through a referral",
      "Hired or contracted someone to help with production",
      "Delegating at least one type of task consistently",
      "Creating content consistently (minimum 2x/week)",
      "Generating 8-10 leads per month",
      "Raised prices at least once due to demand",
      "Hit consistent $4,000+ months (scaled for $50K goal)"
    ],
    checkpoint: "Am I no longer the bottleneck? Is revenue consistent and growing?"
  },
  {
    id: 5, name: "Sustain", goal: "Protect your peace, play the long game",
    milestones: [
      "Saying no to poor-fit clients regularly",
      "Documented creative process for team members",
      "Hired or developing an art director / senior designer",
      "Delivering 'best work they paid for' not 'best work I can do'",
      "Investing in business training, strategy, or coaching",
      "Revenue exceeds initial target — time to set a new goal"
    ],
    checkpoint: "Am I protecting my peace while the business grows without me doing everything?"
  }
];

const TASK_POOL = {
  1: ["Spend 30 min on a typography exercise", "Study one page of Müller-Brockmann and sketch what you see", "Post one piece of process work on social media", "Recreate a Dribbble shot you admire in Figma", "Read 10 pages from your current design book"],
  2: ["Engage with 3 posts from your ICP target list", "Work on a portfolio case study for 45 min", "Research one company that matches your ICP", "Send one thoughtful DM to a potential connection", "Update one piece of copy on your portfolio website"],
  3: ["Review and refine one step of your 5-step process", "Create or improve one mockup in your template library", "Check in with a past client to say hi", "Organize your project files/folders for 15 mins", "Draft an onboarding welcome packet"],
  4: ["Ask a happy recent client for a referral or testimonial", "Draft two pieces of content for this week", "Review your delegable tasks and prep a brief", "Follow up with all active leads in pipeline", "Analyze last month's conversion rate"],
  5: ["Review your boundaries: did you overwork yesterday?", "Read 15 mins of a business strategy book", "Praise or mentor a team member/contractor", "Review finances and profit margins for the quarter", "Take 30 mins for unstructured creative play"]
};

const getToday = () => new Date().toISOString().split('T')[0];

const defaultStages = STAGES_DATA.reduce((acc, stage) => {
  acc[stage.id] = { milestones: new Array(stage.milestones.length).fill(false), completed: false };
  return acc;
}, {});

const defaultState = {
  user: { name: "", onboarded: false },
  settings: { revenueGoal: 50000, darkMode: false },
  progress: { currentStage: 1, streak: 0, lastActiveDate: "" },
  stages: defaultStages,
  daily: { date: "", tasks: [], history: {} },
  leads: [],
  journal: []
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('designerRoadmap');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          settings: { ...defaultState.settings, ...(parsed.settings || {}) },
          stages: { ...defaultState.stages, ...(parsed.stages || {}) },
          daily: { ...defaultState.daily, ...(parsed.daily || {}) }
        };
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeModal, setActiveModal] = useState(null);

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem('designerRoadmap', JSON.stringify(state));
    // Apply theme
    if (state.settings.darkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [state]);

  // Initial setup per day
  useEffect(() => {
    const today = getToday();

    setState(prev => {
      const newState = { ...prev, progress: { ...prev.progress }, daily: { ...prev.daily } };

      if (prev.progress.lastActiveDate !== today) {
        if (prev.progress.lastActiveDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yStr = yesterday.toISOString().split('T')[0];

          if (prev.progress.lastActiveDate === yStr) {
            const completedCount = prev.daily.tasks.filter(t => t.completed).length;
            if (completedCount > 0) newState.progress.streak++;
          } else {
            newState.progress.streak = 0;
          }

          if (prev.daily.tasks.length > 0) {
            const completed = prev.daily.tasks.filter(t => t.completed).length;
            newState.daily.history = {
              ...prev.daily.history,
              [prev.daily.date]: { completed, total: prev.daily.tasks.length }
            };
          }
        }

        newState.progress.lastActiveDate = today;
        newState.daily.date = today;

        // Generate new tasks
        const pool = TASK_POOL[newState.progress.currentStage] || TASK_POOL[1];
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        newState.daily.tasks = shuffled.slice(0, 3).map(text => ({
          id: 't_' + Date.now() + Math.random().toString(36).substring(2, 7),
          text,
          completed: false,
          type: 'generated'
        }));
      } else if (prev.daily.tasks.length === 0) {
        // Same day but no tasks exist
        const pool = TASK_POOL[newState.progress.currentStage] || TASK_POOL[1];
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        newState.daily.tasks = shuffled.slice(0, 3).map(text => ({
          id: 't_' + Date.now() + Math.random().toString(36).substring(2, 7),
          text,
          completed: false,
          type: 'generated'
        }));
      }

      return newState;
    });

  }, []);

  const updateState = (updater) => {
    setState(prev => {
      const partialState = typeof updater === 'function' ? updater(prev) : updater;
      return { ...prev, ...partialState };
    });
  };

  const closeModal = () => setActiveModal(null);
  const openModal = (modalName) => setActiveModal(modalName);

  return (
    <AppContext.Provider value={{
      state,
      updateState,
      activeTab,
      setActiveTab,
      activeModal,
      openModal,
      closeModal,
      STAGES_DATA
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
