import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';

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
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(defaultState);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeModal, setActiveModal] = useState(null);

  const debounceTimer = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchInitialData(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setLoading(true);
        fetchInitialData(session.user.id);
      } else {
        setState(defaultState);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchInitialData = async (userId) => {
    try {
      const [profileRes, leadsRes, journalRes] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', userId).single(),
        supabase.from('leads').select('*').eq('user_id', userId),
        supabase.from('journals').select('*').eq('user_id', userId)
      ]);

      if (profileRes.error && profileRes.error.code !== 'PGRST116') throw profileRes.error;

      let newState = { ...defaultState };

      if (profileRes.data) {
        const p = profileRes.data;
        newState = {
          user: { name: p.name || "", onboarded: p.onboarded || false },
          settings: { revenueGoal: p.revenue_goal || 50000, darkMode: p.dark_mode || false },
          progress: { currentStage: p.current_stage || 1, streak: p.streak || 0, lastActiveDate: p.last_active_date || "" },
          stages: Object.keys(p.stages_data).length > 0 ? p.stages_data : defaultStages,
          daily: p.daily_data?.date ? p.daily_data : { date: "", tasks: [], history: {} },
          leads: leadsRes.data || [],
          journal: journalRes.data || []
        };
      }

      // Check daily logic
      const today = getToday();
      if (newState.progress.lastActiveDate !== today) {
        if (newState.progress.lastActiveDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yStr = yesterday.toISOString().split('T')[0];

          if (newState.progress.lastActiveDate === yStr) {
            const completedCount = newState.daily.tasks.filter(t => t.completed).length;
            if (completedCount > 0) newState.progress.streak++;
          } else {
            newState.progress.streak = 0;
          }

          if (newState.daily.tasks.length > 0) {
            const completed = newState.daily.tasks.filter(t => t.completed).length;
            newState.daily.history = {
              ...newState.daily.history,
              [newState.daily.date]: { completed, total: newState.daily.tasks.length }
            };
          }
        }

        newState.progress.lastActiveDate = today;
        newState.daily.date = today;

        const pool = TASK_POOL[newState.progress.currentStage] || TASK_POOL[1];
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        newState.daily.tasks = shuffled.slice(0, 3).map(text => ({
          id: 't_' + Date.now() + Math.random().toString(36).substring(2, 7),
          text,
          completed: false,
          type: 'generated'
        }));
      } else if (newState.daily.tasks.length === 0) {
        const pool = TASK_POOL[newState.progress.currentStage] || TASK_POOL[1];
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        newState.daily.tasks = shuffled.slice(0, 3).map(text => ({
          id: 't_' + Date.now() + Math.random().toString(36).substring(2, 7),
          text,
          completed: false,
          type: 'generated'
        }));
      }

      setState(newState);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncToSupabase = async (currentState) => {
    if (!session?.user?.id) return;
    const userId = session.user.id;

    try {
      // Upsert profile
      await supabase.from('user_profiles').upsert({
        id: userId,
        name: currentState.user.name,
        onboarded: currentState.user.onboarded,
        revenue_goal: currentState.settings.revenueGoal,
        dark_mode: currentState.settings.darkMode,
        current_stage: currentState.progress.currentStage,
        streak: currentState.progress.streak,
        last_active_date: currentState.progress.lastActiveDate,
        stages_data: currentState.stages,
        daily_data: currentState.daily
      });

      // Upsert leads
      if (currentState.leads.length > 0) {
        const mappedLeads = currentState.leads.map(l => ({
          ...l,
          user_id: userId,
          date_added: l.dateAdded || l.date_added,
          date_updated: l.dateUpdated || l.date_updated,
        }));
        // Remove old camelCase keys just in case but Supabase ignores them if not in schema usually
        await supabase.from('leads').upsert(mappedLeads.map(({ dateAdded, dateUpdated, ...rest }) => rest));
      }

      // Upsert journals
      if (currentState.journal.length > 0) {
        const mappedJournals = currentState.journal.map(j => ({
          ...j,
          user_id: userId
        }));
        await supabase.from('journals').upsert(mappedJournals);
      }
    } catch (e) {
      console.error("Failed to sync to Supabase", e);
    }
  };

  // Apply theme dynamically
  useEffect(() => {
    if (state.settings.darkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [state.settings.darkMode]);

  const updateState = (updater) => {
    setState(prev => {
      const partialState = typeof updater === 'function' ? updater(prev) : updater;
      const newState = { ...prev, ...partialState };

      // Debounce the sync so we don't spam the database on every keystroke
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        syncToSupabase(newState);
      }, 1000);

      return newState;
    });
  };

  const closeModal = () => setActiveModal(null);
  const openModal = (modalName) => setActiveModal(modalName);

  return (
    <AppContext.Provider value={{
      session,
      loading,
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
