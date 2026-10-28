import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowLeft, Sparkles, Layout, Bot, Play, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function Design() {
  const navigate = useNavigate();
  const { design, analysis, setDemoMode, demoMode, setStep, setDesign, apiKey, setLoading, setError } = usePortfolio();

  if (!design || !analysis) {
    navigate('/specialization');
    return null;
  }

  const [toggling, setToggling] = useState(false);

  const toggleMode = async () => {
    setToggling(true);
    setDemoMode(!demoMode);
    setToggling(false);
  };

  const regenerate = async () => {
    setLoading(true);
    try {
      const { analyzeProfile } = await import('../services/ai');
      // placeholder profile to re-run analysis - we just need a new design config
      const newDesign = {
        ...design,
        id: `design-${Date.now()}`,
        name: `${design.name} (regenerated)`,
      };
      setDesign(newDesign);
    } catch (err) {
      setError('Unable to regenerate design.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setStep('specialization'); navigate('/specialization'); }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="px-2 py-0.5 rounded text-xs text-muted-foreground">Generated design</span>
      </div>

      <h1 className="text-3xl font-display font-bold text-foreground mb-1">Your AI-generated design</h1>
      <p className="text-muted-foreground mb-6">
        Portify AI created a profession-specific layout for <span className="text-foreground font-medium">{analysis.specialization}</span>. Refine it in the AI assistant, or go straight to preview.
      </p>

      {/* Design summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DesignStat title="Specialization" value={analysis.specialization.replace(/-/g, ' ')} />
        <DesignStat title="Target role" value={analysis.targetRole} />
        <DesignStat title="Sections" value={design.sectionOrder.length.toString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Design details */}
        <Card>
          <CardHeader>
            <CardTitle>Design system</CardTitle>
            <CardDescription>Colors, typography, and layout chosen for your field.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Primary color</span>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full border" style={{ backgroundColor: design.colors.primary }} />
                  <span className="text-xs text-muted-foreground">{design.colors.primary}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Background</span>
                <span className="text-xs text-muted-foreground">{design.background.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Layout</span>
                <span className="text-xs text-muted-foreground">{design.layout.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Animations</span>
                <span className="text-xs text-muted-foreground">{design.animations.enabled ? 'On' : 'Off'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI analysis summary */}
        <Card>
          <CardHeader>
            <CardTitle>AI profile analysis</CardTitle>
            <CardDescription>What the AI identified from your information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Professional summary</div>
                <p className="text-sm text-muted-foreground">{analysis.professionalSummary}</p>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Key skills</div>
                <div className="flex flex-wrap gap-2">
                  {analysis.keySkills.slice(0, 6).map((s) => (
                    <span key={s} className="text-xs px-2 py-1 rounded border border-border/50 bg-muted/50 text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Branding opportunities</div>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                  {analysis.brandingOpportunities.slice(0, 3).map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mode toggle */}
      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>AI mode</CardTitle>
              <CardDescription>
                {demoMode ? 'Demo mode (offline AI simulation)' : 'Live LLM mode (your API key)'}
              </CardDescription>
            </div>
            <button
              onClick={toggleMode}
              disabled={toggling}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                demoMode ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-muted text-muted-foreground'
              }`}
            >
              {toggling ? 'Switching...' : demoMode ? 'Enable live AI' : 'Use demo mode'}
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            In demo mode, the AI assistant uses built-in responses so you can try the full workflow
            without an API key. To use a real LLM, add your key on the landing page.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button
          onClick={regenerate}
          className="px-4 py-3 rounded-xl border border-input text-sm font-medium hover:bg-accent transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Regenerate layout
        </button>
        <button
          onClick={() => { setStep('assistant'); navigate('/assistant'); }}
          className="px-8 py-3 rounded-xl font-display font-bold text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 flex items-center gap-2"
        >
          Open AI assistant <Bot className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => { setStep('preview'); navigate('/preview'); }}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
        >
          Skip to preview <Play className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function DesignStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border border-border/50 bg-card">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{title}</div>
      <div className="text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}
