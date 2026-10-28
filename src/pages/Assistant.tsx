import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import {
  ArrowLeft,
  Bot,
  Send,
  Undo,
  Redo,
  Smartphone,
  Check,
} from 'lucide-react';
import type { ChatMessage } from '../types';
import { PortfolioPreview } from '../components/preview/PortfolioPreview';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function Assistant() {
  const navigate = useNavigate();
  const {
    profile,
    design,
    previewDesign,
    messages,
    addChatMessage,
    clearChat,
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    setPreviewDesign,
    setDesign,
    setError,
    setLoading,
    apiKey,
    demoMode,
    step,
  } = usePortfolio();

  if (!design || !profile) {
    navigate('/design');
    return null;
  }

  const [input, setInput] = useState('');
  const [mobileView, setMobileView] = useState(false);
  const [pending, setPending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Redesign as a cybersecurity website',
    'Make it look like a premium SOC dashboard',
    'Add subtle animations and a terminal hero',
    'Make it more professional for recruiters',
    'Create a completely different design',
    'Make the project cards interactive',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    const currentInput = input;
    setInput('');
    setPending(true);

    try {
      const { chatReply } = await import('../services/ai');
      const { reply, change } = await chatReply(messages, previewDesign || design, profile, apiKey || null);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-1`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
        designChange: change,
      };
      addChatMessage(assistantMsg);

      if (change) {
        const next = {
          ...(previewDesign || design),
          ...change.config,
          id: `design-${Date.now()}`,
          version: (previewDesign || design).version + 1,
        };
        pushHistory(next);
        setPreviewDesign(next);
      }
    } catch (err) {
      setError('Assistant request failed. Try again.');
    } finally {
      setPending(false);
    }
  };

  const handleUndo = () => {
    undo();
  };
  const handleRedo = () => {
    redo();
  };

  const applyPreset = (prompt: string) => {
    setInput(prompt);
    handleSend({ preventDefault: () => {} } as React.FormEvent);
  };

  const acceptDesign = () => {
    if (previewDesign) {
      setDesign(previewDesign);
    }
    setStep('preview');
    navigate('/preview');
  };

  const resetDesign = () => {
    setPreviewDesign(design);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur p-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { navigate('/design'); }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div>
            <h1 className="font-display font-bold text-foreground">AI Design Assistant</h1>
            <p className="text-xs text-muted-foreground">Describe the changes you want.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={demoMode ? 'outline' : 'secondary'} className="text-xs">
            {demoMode ? 'Demo AI' : 'Live AI'}
          </Badge>
          <button
            onClick={() => { setMobileView(!mobileView); }}
            className={`p-2 rounded-md transition-colors ${mobileView ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
            title="Toggle mobile preview"
          >
            <Smartphone className="h-4 w-4" />
          </button>
          <button
            onClick={resetDesign}
            disabled={!previewDesign || (previewDesign && design && JSON.stringify(previewDesign) === JSON.stringify(design))}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            title="Restore original design"
          >
            Restore original
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: chat */}
        <div className="w-full md:w-1/3 border-r border-border/50 bg-background flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Bot className="h-10 w-10 mb-2 opacity-50" />
                <p>Start a design conversation</p>
              </div>
            ) : (
              <>
                {messages.map((m) => (
                  <Message key={m.id} message={m} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-border/50 bg-background/50">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Make it look like a premium SOC dashboard…"
                className="flex-1 h-10 rounded-xl border border-input bg-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className="rounded-xl px-4 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {pending ? (
                  <>Sending...</>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: live preview */}
        <div className="w-full md:w-2/3 flex flex-col bg-background/30 relative">
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className={`p-2 rounded-md transition-colors ${
                canUndo ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className={`p-2 rounded-md transition-colors ${
                canRedo ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </button>
            <button
              onClick={acceptDesign}
              className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              title="Accept this design"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6 md:p-10">
            <div className={`max-w-full mx-auto ${mobileView ? 'max-w-sm' : 'max-w-4xl'}`}>
              <PortfolioPreview mobile={mobileView} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: quick prompts */}
      <div className="border-t border-border/50 bg-background p-4">
        <p className="text-xs text-muted-foreground mb-3">Try saying:</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-md text-xs border border-input text-muted-foreground hover:bg-accent hover:text-primary-foreground transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[85%] rounded-2xl p-3 ${
        isUser
          ? 'bg-primary text-primary-foreground'
          : 'bg-card border border-border/50 text-foreground'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        {message.designChange && (
          <div className="mt-2 p-2 rounded-md bg-accent/10 text-xs text-primary-foreground border border-accent/20">
            <span className="font-semibold">Design change applied:</span> {message.designChange.description}
          </div>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground mt-1 {isUser ? 'ml-auto' : ''}">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
