import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowLeft, Monitor, Smartphone, Edit, Eye, EyeOff, MoveHorizontal, Trash2, Download, Save } from 'lucide-react';
import { PortfolioPreview } from '../components/preview/PortfolioPreview';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  about: 'About Me',
  'security-skills': 'Security Skills',
  'ai-skills': 'AI Skills',
  'tech-skills': 'Technical Skills',
  'web-skills': 'Web Skills',
  'design-skills': 'Design Skills',
  'data-skills': 'Data Skills',
  'cloud-skills': 'Cloud Skills',
  projects: 'Projects',
  'soc-projects': 'SOC Projects',
  'security-labs': 'Security Labs',
  'model-showcase': 'Model Showcase',
  research: 'Research',
  datasets: 'Datasets',
  'case-studies': 'Case Studies',
  visualizations: 'Visualizations',
  architecture: 'Architecture',
  'incident-response': 'Incident Response',
  'write-ups': 'Technical Write-ups',
  experience: 'Experience',
  education: 'Education',
  certifications: 'Certifications',
  github: 'GitHub',
  dribbble: 'Dribbble / Behance',
  contact: 'Contact',
};

export default function Preview() {
  const navigate = useNavigate();
  const {
    profile,
    design,
    previewDesign,
    setPreviewDesign,
    setDesign,
    setStep,
  } = usePortfolio();

  if (!design || !profile) {
    navigate('/design');
    return null;
  }

  const d = previewDesign || design;
  const [mobileView, setMobileView] = useState(false);
  const [panel, setPanel] = useState<'none' | 'sections' | 'style'>('none');
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());
  const [sectionOrder, setSectionOrder] = useState<string[]>(d.sectionOrder);

  const toggleSection = (id: string) => {
    const next = new Set(hiddenSections);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setHiddenSections(next);
  };

  const visibleOrder = sectionOrder.filter((id) => !hiddenSections.has(id));

  const reorder = (dir: 'up' | 'down', index: number) => {
    const next = [...visibleOrder];
    if (dir === 'up' && index > 0) {
      [next[index], next[index - 1]] = [next[index - 1], next[index]];
    } else if (dir === 'down' && index < next.length - 1) {
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
    }
    setSectionOrder(next);
  };

  const applyPreview = () => {
    setPreviewDesign({
      ...d,
      sectionOrder: visibleOrder,
    });
  };

  const goExport = () => {
    applyPreview();
    setStep('export');
    navigate('/export');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur p-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { navigate('/assistant'); }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to assistant
          </button>
          <div>
            <h1 className="font-display font-bold text-foreground">Preview your portfolio</h1>
            <p className="text-xs text-muted-foreground">Review how it looks before exporting.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setMobileView(!mobileView); }}
            className={`p-2 rounded-md transition-colors ${mobileView ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
            title="Toggle mobile preview"
          >
            <Smartphone className="h-4 w-4" />
          </button>
          <button
            onClick={goExport}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            Download ZIP <Download className="h-4 w-4 ml-1" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Controls sidebar */}
        <aside
          className={`w-80 border-r border-border/50 bg-card p-6 flex flex-col transition-all ${
            panel === 'none' ? 'w-0 overflow-hidden opacity-0' : ''
          }`}
        >
          <button
            onClick={() => setPanel('none')}
            className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
          {panel === 'sections' && (
            <div className="space-y-4 mt-4">
              <CardTitle className="text-base">Sections</CardTitle>
              <p className="text-xs text-muted-foreground mb-4">Reorder, hide, or show sections.</p>
              <div className="space-y-2">
                {visibleOrder.map((id, i) => (
                  <div
                    key={id}
                    className="flex items-center gap-2 p-2 rounded-lg border border-input bg-background/50"
                  >
                    <div className="flex items-center gap-1 cursor-grab text-xs text-muted-foreground">
                      <MoveHorizontal className="h-3 w-3" />
                      <span>{i + 1}</span>
                    </div>
                    <span className="flex-1 text-sm text-foreground truncate">{SECTION_LABELS[id] || id}</span>
                    <button
                      onClick={() => reorder('up', i)}
                      className="p-1 text-xs text-muted-foreground hover:text-primary"
                      disabled={i === 0}
                    >
                      <MoveHorizontal className="h-3 w-3 rotate-90" />
                    </button>
                    <button
                      onClick={() => reorder('down', i)}
                      className="p-1 text-xs text-muted-foreground hover:text-primary"
                      disabled={i === visibleOrder.length - 1}
                    >
                      <MoveHorizontal className="h-3 w-3 -rotate-90" />
                    </button>
                    <button
                      onClick={() => toggleSection(id)}
                      className="p-1 text-xs text-destructive hover:bg-destructive/10"
                      title="Hide section"
                    >
                      <EyeOff className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {Array.from(hiddenSections).map((id) => (
                  <div
                    key={id}
                    className="flex items-center gap-2 p-2 rounded-lg border border-input bg-muted/30 text-sm text-muted-foreground"
                  >
                    <span className="line-through">{SECTION_LABELS[id] || id}</span>
                    <button
                      onClick={() => toggleSection(id)}
                      className="ml-auto p-1 text-xs text-primary hover:bg-primary/10"
                      title="Show section"
                    >
                      <Eye className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={applyPreview}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Apply to preview
              </button>
            </div>
          )}
          {panel === 'style' && (
            <div className="space-y-4 mt-4">
              <CardTitle className="text-base">Visual style</CardTitle>
              <p className="text-xs text-muted-foreground mb-4">Adjust colors and layout.</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Primary color</label>
                  <input
                    type="color"
                    value={d.colors.primary}
                    onChange={(e) =>
                      setPreviewDesign({ ...d, colors: { ...d.colors, primary: e.target.value } })
                    }
                    className="w-full h-9 rounded-md border-none bg-transparent cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Background type</label>
                  <select
                    value={d.background.type}
                    onChange={(e) =>
                      setPreviewDesign({
                        ...d,
                        background: { ...d.background, type: e.target.value as any },
                      })
                    }
                    className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="none">None</option>
                    <option value="gradient">Gradient</option>
                    <option value="grid">Grid</option>
                    <option value="network">Network</option>
                    <option value="terminal">Terminal</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={d.animations.enabled}
                    onChange={(e) =>
                      setPreviewDesign({ ...d, animations: { ...d.animations, enabled: e.target.checked } })
                    }
                    className="rounded border-input text-primary"
                  />
                  Enable animations
                </label>
              </div>
            </div>
          )}
        </aside>

        {/* Main preview area */}
        <div className="flex-1 relative">
          <div className="absolute top-4 right-4 z-30 flex gap-2">
            <button
              onClick={() => setPanel(panel === 'sections' ? 'none' : 'sections')}
              className={`p-2 rounded-md transition-colors ${
                panel === 'sections' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
              title="Sections"
            >
              <Layout className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPanel(panel === 'style' ? 'none' : 'style')}
              className={`p-2 rounded-md transition-colors ${
                panel === 'style' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
              title="Style"
            >
              <Palette className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileView(!mobileView)}
              className={`p-2 rounded-md transition-colors ${mobileView ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
              title="Mobile view"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-2 md:p-4">
            <div className={`max-w-full mx-auto ${mobileView ? 'max-w-sm w-full' : 'max-w-5xl'}`}>
              <PortfolioPreview mobile={mobileView} />
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border/50 p-4 bg-background flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Changes are not saved until you export or save a draft.</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              applyPreview();
              navigate('/assistant');
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Edit className="h-3 w-3" /> Edit design
          </button>
          <button
            onClick={goExport}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Download portfolio ZIP
          </button>
        </div>
      </footer>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={`h-5 w-5 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
