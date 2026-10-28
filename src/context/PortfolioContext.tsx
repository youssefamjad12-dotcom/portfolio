import { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';
import type {
  PortfolioState,
  ProfileInfo,
  DesignConfig,
  ChatMessage,
  PortfolioDraft,
} from '../types';
import { createDefaultDesign, SPECIALIZATIONS } from '../data/specializations';

const DRAFT_STORAGE_KEY = 'portify_drafts';

interface ContextValue extends PortfolioState {
  messages: ChatMessage[];
  setStep: (step: PortfolioState['step']) => void;
  setProfile: (profile: ProfileInfo | null) => void;
  updateProfile: (updates: Partial<ProfileInfo>) => void;
  setAnalysis: (analysis: any) => void;
  setDesign: (design: DesignConfig | null) => void;
  setPreviewDesign: (design: DesignConfig | null) => void;
  pushHistory: (design: DesignConfig) => void;
  undo: () => void;
  redo: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDemoMode: (demo: boolean) => void;
  setApiKey: (key: string | null) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  saveDraft: () => void;
  loadDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
  reset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const initialDrafts: PortfolioDraft[] = [];

function initialState(): PortfolioState {
  return {
    step: 'landing',
    profile: null,
    analysis: null,
    design: null,
    previewDesign: null,
    history: [],
    historyIndex: -1,
    isLoading: false,
    error: null,
    demoMode: true,
    apiKey: null,
    drafts: initialDrafts,
  };
}

type Action =
  | { type: 'SET_STEP'; payload: PortfolioState['step'] }
  | { type: 'SET_PROFILE'; payload: ProfileInfo | null }
  | { type: 'UPDATE_PROFILE'; payload: Partial<ProfileInfo> }
  | { type: 'SET_ANALYSIS'; payload: any }
  | { type: 'SET_DESIGN'; payload: DesignConfig | null }
  | { type: 'SET_PREVIEW'; payload: DesignConfig | null }
  | { type: 'PUSH_HISTORY'; payload: DesignConfig }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DEMO_MODE'; payload: boolean }
  | { type: 'SET_API_KEY'; payload: string | null }
  | { type: 'SAVE_DRAFTS'; payload: PortfolioDraft[] }
  | { type: 'LOAD_DRAFT'; payload: PortfolioDraft }
  | { type: 'RESET' };

function reducer(state: PortfolioState, action: Action): PortfolioState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: state.profile ? { ...state.profile, ...action.payload } : null,
      };
    case 'SET_ANALYSIS':
      return { ...state, analysis: action.payload };
    case 'SET_DESIGN':
      return { ...state, design: action.payload };
    case 'SET_PREVIEW':
      return { ...state, previewDesign: action.payload };
    case 'PUSH_HISTORY': {
      const next = state.history.slice(0, state.historyIndex + 1);
      next.push(action.payload);
      return {
        ...state,
        history: next,
        historyIndex: next.length - 1,
        previewDesign: action.payload,
      };
    }
    case 'UNDO':
      if (state.historyIndex > 0) {
        const idx = state.historyIndex - 1;
        return { ...state, historyIndex: idx, previewDesign: state.history[idx] };
      }
      return state;
    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        const idx = state.historyIndex + 1;
        return { ...state, historyIndex: idx, previewDesign: state.history[idx] };
      }
      return state;
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DEMO_MODE':
      return { ...state, demoMode: action.payload };
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'SAVE_DRAFTS':
      return { ...state, drafts: action.payload };
    case 'LOAD_DRAFT': {
      const d = action.payload;
      return { ...state, profile: d.profile, design: d.design, previewDesign: d.design, step: 'preview' };
    }
    case 'RESET':
      return initialState();
    default:
      return state;
  }
}

const PortfolioContext = createContext<ContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState());
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Hydrate drafts from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) dispatch({ type: 'SAVE_DRAFTS', payload: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((drafts: PortfolioDraft[]) => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
    } catch {
      // ignore
    }
  }, []);

  const setStep = useCallback((s: PortfolioState['step']) => dispatch({ type: 'SET_STEP', payload: s }), []);
  const setProfile = useCallback((p: ProfileInfo | null) => dispatch({ type: 'SET_PROFILE', payload: p }), []);
  const updateProfile = useCallback((u: Partial<ProfileInfo>) => dispatch({ type: 'UPDATE_PROFILE', payload: u }), []);
  const setAnalysis = useCallback((a: any) => dispatch({ type: 'SET_ANALYSIS', payload: a }), []);
  const setDesign = useCallback((d: DesignConfig | null) => dispatch({ type: 'SET_DESIGN', payload: d }), []);
  const setPreviewDesign = useCallback((d: DesignConfig | null) => dispatch({ type: 'SET_PREVIEW', payload: d }), []);
  const pushHistory = useCallback((d: DesignConfig) => dispatch({ type: 'PUSH_HISTORY', payload: d }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
  const setLoading = useCallback((l: boolean) => dispatch({ type: 'SET_LOADING', payload: l }), []);
  const setError = useCallback((e: string | null) => dispatch({ type: 'SET_ERROR', payload: e }), []);
  const setDemoMode = useCallback((demo: boolean) => dispatch({ type: 'SET_DEMO_MODE', payload: demo }), []);
  const setApiKey = useCallback((key: string | null) => dispatch({ type: 'SET_API_KEY', payload: key }), []);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);
  const clearChat = useCallback(() => setMessages([]), []);

  const saveDraft = useCallback(() => {
    if (!state.profile || !state.design) return;
    const draft: PortfolioDraft = {
      id:
        state.drafts.find((d) => d.profile.fullName === state.profile?.fullName)?.id ||
        `draft-${Date.now()}`,
      name: state.profile.fullName || 'Untitled Portfolio',
      updatedAt: new Date().toISOString(),
      profile: state.profile,
      design: state.design,
    };
    const next =
      state.drafts.find((d) => d.id === draft.id)
        ? state.drafts.map((d) => (d.id === draft.id ? draft : d))
        : [draft, ...state.drafts].slice(0, 20);
    dispatch({ type: 'SAVE_DRAFTS', payload: next });
    persist(next);
  }, [state.profile, state.design, state.drafts, persist]);

  const loadDraft = useCallback((id: string) => {
    const d = state.drafts.find((x) => x.id === id);
    if (d) dispatch({ type: 'LOAD_DRAFT', payload: d });
  }, [state.drafts]);

  const deleteDraft = useCallback((id: string) => {
    const next = state.drafts.filter((d) => d.id !== id);
    dispatch({ type: 'SAVE_DRAFTS', payload: next });
    persist(next);
  }, [state.drafts, persist]);

  const reset = useCallback(() => {
    setMessages([]);
    dispatch({ type: 'RESET' });
  }, []);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const value: ContextValue = {
    ...state,
    messages,
    setStep,
    setProfile,
    updateProfile,
    setAnalysis,
    setDesign,
    setPreviewDesign,
    pushHistory,
    undo,
    redo,
    setLoading,
    setError,
    setDemoMode,
    setApiKey,
    addChatMessage,
    clearChat,
    saveDraft,
    loadDraft,
    deleteDraft,
    reset,
    canUndo,
    canRedo,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
