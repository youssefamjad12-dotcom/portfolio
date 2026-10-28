import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { Download, Save, ArrowLeft, Mail, Globe, CheckCircle, FileText, Archive } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import {
  generateWebsiteZip,
  downloadBlob,
  downloadConfigJson,
  importConfigJson,
} from '../services/export';

export default function Export() {
  const navigate = useNavigate();
  const { profile, design, previewDesign, saveDraft, step, setStep, apiKey, setApiKey, demoMode, setProfile, setDesign, setPreviewDesign, setAnalysis } = usePortfolio();

  const [zipping, setZipping] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importText, setImportText] = useState('');

  const d = previewDesign || design;

  const handleDownloadZip = async () => {
    if (!profile || !d) return;
    setZipping(true);
    try {
      const blob = await generateWebsiteZip(profile, d, {
        includeAssets: true,
        minify: true,
        includeReadme: true,
      });
      const safeName = (profile.fullName || 'portfolio').replace(/\s+/g, '_').toLowerCase();
      downloadBlob(blob, `portify-${safeName}-website.zip`);
    } catch (err) {
      alert('Failed to generate ZIP. Please try again.');
    } finally {
      setZipping(false);
    }
  };

  const handleDownloadJson = () => {
    if (!profile || !d) return;
    downloadConfigJson(profile, d);
  };

  const handleSaveDraft = () => {
    saveDraft();
    alert('Draft saved to your browser (localStorage).');
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = importConfigJson(text);
      if (!parsed) {
        setImportStatus('error');
        return;
      }
      setProfile(parsed.profile);
      setDesign(parsed.design);
      setPreviewDesign(parsed.design);
      setAnalysis(parsed.profile.source || 'document');
      setImportStatus('success');
    };
    reader.readAsText(file);
  };

  const handleImportPaste = () => {
    const parsed = importConfigJson(importText);
    if (!parsed) {
      setImportStatus('error');
      return;
    }
    setProfile(parsed.profile);
    setDesign(parsed.design);
    setPreviewDesign(parsed.design);
    setAnalysis(parsed.profile.source || 'document');
    setImportStatus('success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setStep('preview'); navigate('/preview'); }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="px-2 py-0.5 rounded text-xs text-muted-foreground">Export &amp; download</span>
      </div>

      <h1 className="text-3xl font-display font-bold text-foreground mb-1">Export your portfolio</h1>
      <p className="text-muted-foreground mb-6">
        Download a complete, static website you can host anywhere. No account, no database required.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Option A: Website ZIP */}
        <Card className="overflow-hidden">
          <CardHeader className="p-5">
            <div className="flex items-center gap-3">
              <Archive className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Option A — Complete website</CardTitle>
                <CardDescription>
                  HTML, CSS, and JavaScript in a ZIP file. Works independently of Portify AI.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>index.html — your portfolio page</li>
              <li>All styles inline (no external dependencies)</li>
              <li>Responsive, mobile-ready layout</li>
              <li>README with hosting instructions</li>
            </ul>
            <div className="pt-4">
              <p className="text-xs text-muted-foreground mb-2">Hosting:</p>
              <div className="flex gap-2">
                <Chip label="GitHub Pages" icon={Globe} />
                <Chip label="Netlify" icon={Globe} />
                <Chip label="Vercel" icon={Globe} />
              </div>
            </div>
            <button
              onClick={handleDownloadZip}
              disabled={zipping}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg hover:bg-primary/90 disabled:opacity-60 transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
              <Archive className="h-5 w-5" />
              {zipping ? 'Generating ZIP…' : 'Download complete website ZIP'}
            </button>
          </CardContent>
        </Card>

        {/* Option B: JSON config */}
        <Card className="overflow-hidden">
          <CardHeader className="p-5">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Option B — Portfolio configuration</CardTitle>
                <CardDescription>
                  JSON file with your content, design, and theme. Import later to keep editing.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>Profile content and specialization</li>
              <li>Design configuration and section order</li>
              <li>Theme and color settings</li>
              <li>Importable back into Portify AI</li>
            </ul>
            <button
              onClick={handleDownloadJson}
              className="w-full py-3 rounded-xl border border-input bg-background text-sm font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" /> Download configuration JSON
            </button>

            <div className="mt-6 rounded-xl border border-input bg-background p-4">
              <CardTitle className="text-base mb-2">Import a saved configuration</CardTitle>
              <p className="text-xs text-muted-foreground mb-3">Paste JSON or upload a previously exported config file.</p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste JSON config here…"
                className="w-full h-32 rounded-md border border-input bg-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleImportPaste}
                  className="flex-1 py-2 rounded-md border border-input text-sm hover:bg-accent transition-colors"
                >
                  Import from text
                </button>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImportFile(f);
                    }}
                    className="sr-only"
                  />
                  <span className="block py-2 rounded-md border border-input text-sm text-center hover:bg-accent transition-colors">
                    Upload JSON file
                  </span>
                </label>
              </div>
              {importStatus === 'success' && (
                <div className="mt-3 p-2 rounded-md bg-green-500/10 text-green-500 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" /> Configuration imported.
                </div>
              )}
              {importStatus === 'error' && (
                <div className="mt-3 p-2 rounded-md bg-red-500/10 text-red-500 text-xs">
                  Invalid configuration file.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Draft saving */}
      <Card>
        <CardHeader className="p-4">
          <div className="flex items-center gap-2">
            <Save className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Save a draft locally</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-3">
            Your draft is saved to your browser&rsquo;s localStorage. It will not sync across devices and is not stored on any server.
          </p>
          <button
            onClick={handleSaveDraft}
            className="py-2.5 rounded-xl border border-input bg-background text-sm font-medium hover:bg-accent transition-colors w-full"
          >
            Save draft now
          </button>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          API key mode:{' '}
          <Badge variant={demoMode ? 'outline' : 'secondary'} className="ml-1 text-xs">
            {demoMode ? 'demo' : 'live'}
          </Badge>
          {' '}&middot; No account required
        </p>
      </div>
    </div>
  );
}

function Chip({ label, icon: Icon }: { label: string; icon: any }) {
  return (
    <span className="flex items-center gap-1 px-2 py-1 rounded border border-input text-xs text-muted-foreground bg-background/50">
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
