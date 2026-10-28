import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { SPECIALIZATIONS, createDefaultDesign } from '../data/specializations';
import { ArrowLeft, Sparkles, Play } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

const ICONS: Record<string, any> = {
  cybersecurity: 'shield',
  'ai-engineer': 'cpu',
  'software-development': 'code',
  'web-development': 'globe',
  'ui-ux-design': 'pen-tool',
  'data-analysis': 'bar-chart',
  'cloud-devops': 'cloud',
};

export default function Specialization() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile, analysis, design, setAnalysis, setDesign, setStep, isLoading, setLoading } = usePortfolio();
  const [selected, setSelected] = useState<string | null>(searchParams.get('spec') || null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!selected && searchParams.get('spec')) setSelected(searchParams.get('spec')!);
  }, [searchParams, selected]);

  const handleSelect = async (spec: string) => {
    setSelected(spec);
    setAnalyzing(true);
    setLoading(true);
    try {
      const { analyzeProfile } = await import('../services/ai');
      const result = await analyzeProfile(profile!, null);
      setAnalysis(result.analysis);
      const design = createDefaultDesign(spec as any);
      setDesign(design);
      setStep('design');
      navigate('/design');
    } catch (err) {
      // fallback: still proceed with default design
      const design = createDefaultDesign(spec as any);
      setDesign(design);
      setStep('design');
      navigate('/design');
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  };

  if (!profile) {
    navigate('/import');
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setStep('review'); navigate('/review'); }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="px-2 py-0.5 rounded text-xs text-muted-foreground">Choose specialization</span>
      </div>

      <h1 className="text-3xl font-display font-bold text-foreground mb-1">Your specialization</h1>
      <p className="text-muted-foreground mb-6">
        This determines the design system AI uses for your portfolio. You can change it later in the AI assistant.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.values(SPECIALIZATIONS).map((s) => {
          const active = selected === s.id;
          return (
            <Card
              key={s.id}
              className={`
                cursor-pointer transition-all ${active
                  ? 'ring-2 ring-primary bg-primary/5 border-primary/30'
                  : 'border-border/50 hover:border-primary/50 hover:bg-accent/20'
              }`}
              onClick={() => handleSelect(s.id)}
            >
              <CardHeader className="p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                    active ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                  }`}>
                    <span className="text-[12px]">{ICONS[s.id][0].toUpperCase()}</span>
                  </div>
                  <div>
                    <CardTitle className="text-base">{s.name}</CardTitle>
                    <CardDescription className="text-[11px]">{s.tagline}</CardDescription>
                  </div>
                </div>
                {active && <Play className="h-5 w-5 text-primary" />}
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{s.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {s.sections.slice(0, 4).map((sec) => (
                    <span key={sec} className="text-[10px] px-2 py-1 rounded border border-border/50 text-muted-foreground">
                      {sec.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selected && (
        <div className="mt-8 flex justify-end">
          <button
            disabled={analyzing}
            onClick={() => handleSelect(selected!)}
            className={`px-8 py-3 rounded-xl font-display font-bold text-lg transition-colors flex items-center gap-2 ${
              analyzing
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25'
            }`}
          >
            {analyzing ? (
              <>Generating design...</>
            ) : (
              <>
                Continue <span className="text-primary">»</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
