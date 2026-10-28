import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Link,
  Upload,
  FileText,
  User,
  AlertCircle,
  Info,
  Loader2,
  ArrowRight,
  Mail,
  Globe,
} from 'lucide-react';
import { validateLinkedInUrl, normalizeLinkedInUrl, extractLinkedInProfile } from '../services/linkedin';
import { Textarea } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

const ALTERNATIVES = [
  { icon: Upload, label: 'Upload LinkedIn-exported PDF/resume', desc: 'Drag & drop your exported file.' },
  { icon: FileText, label: 'Import from a document', desc: 'Paste or upload a resume/CV document.' },
  { icon: User, label: 'Enter details manually', desc: 'Fill in your profile information by hand.' },
];

export default function Import() {
  const navigate = useNavigate();
  const { setProfile, setStep, setError, setLoading, setAnalysis, setDesign, demoMode } = usePortfolio();
  const [url, setUrl] = useState('');
  [demoMode];
  const [urlError, setUrlError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'extracting' | 'done' | 'blocked'>('idle');
  const [extracted, setExtracted] = useState<any>(null);
  const [blockedMsg, setBlockedMsg] = useState<string>('');
  const [manual, setManual] = useState(false);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);
    const v = validateLinkedInUrl(url);
    if (!v.valid) {
      setUrlError(v.message);
      return;
    }
    startExtraction();
  };

  const startExtraction = async () => {
    setStatus('extracting');
    setLoading(true);
    setError(null);
    try {
      const normalized = normalizeLinkedInUrl(url);
      const result = await extractLinkedInProfile(normalized);
      if (result.success && result.profile) {
        const profile = toProfileInfo(result.profile, 'linkedin');
        setProfile(profile);
        setExtracted(result.profile);
        setStatus('done');
      } else {
        setStatus('blocked');
        setBlockedMsg(result.alternativeMessage || 'LinkedIn access is not available.');
        setError(result.error || 'Unable to extract LinkedIn profile data.');
      }
    } catch (err) {
      setStatus('blocked');
      setError(err instanceof Error ? err.message : 'Extraction failed.');
      setBlockedMsg('Please use one of the alternatives below.');
    } finally {
      setLoading(false);
    }
  };

  const goManual = () => {
    setManual(true);
    setStatus('idle');
    setError(null);
  };

  const continueManual = (profile: any) => {
    const p = toProfileInfo(profile, 'manual');
    setProfile(p);
    setStep('review');
    navigate('/review');
  };

  const proceed = () => {
    if (!extracted) return;
    const profile = toProfileInfo(extracted, 'linkedin');
    setProfile(profile);
    setStep('review');
    navigate('/review');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Import your profile</h1>
        <p className="text-muted-foreground">Enter your LinkedIn profile URL to get started.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>LinkedIn profile URL</CardTitle>
          <CardDescription>
            We only read publicly accessible information. You&rsquo;ll review everything before we generate anything.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleValidate} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setUrlError(null);
                  }}
                  placeholder="https://www.linkedin.com/in/example-profile/"
                  className="pl-10 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
              </div>
              <ButtonExtract
                disabled={status === 'extracting'}
                onClick={handleValidate}
              >
                {status === 'extracting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Extracting...
                  </>
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </ButtonExtract>
            </div>
            {urlError && <p className="text-sm text-destructive">{urlError}</p>}
          </form>

          {status === 'done' && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Profile information extracted.</p>
                  <p className="text-sm text-muted-foreground">Review and confirm your details before generating.</p>
                </div>
              </div>
              <button
                onClick={proceed}
                className="mt-3 w-full py-2.5 rounded-lg border border-primary bg-primary/50 text-primary font-medium hover:bg-primary/100 transition-colors"
              >
                Review &amp; continue <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}

          {status === 'blocked' && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 rounded-xl border border-orange-500/30 bg-orange-500/10"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">LinkedIn access is restricted.</p>
                    <p className="text-sm text-muted-foreground">{blockedMsg}</p>
                  </div>
                </div>
                <button
                  onClick={goManual}
                  className="mt-3 w-full py-2.5 rounded-lg border border-primary bg-primary/50 text-primary font-medium hover:bg-primary/100 transition-colors"
                >
                  Enter details manually <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>

      {/* Manual entry shortcut */}
      {manual && (
        <ManualEntry onComplete={continueManual} />
      )}

      {/* Alternatives card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Can&rsquo;t access LinkedIn?</CardTitle>
          <CardDescription>Use one of these alternatives instead.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ALTERNATIVES.map((a) => (
            <div key={a.label} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
              <a.icon className="h-5 w-5 text-primary shrink-0" />
              <div>
                <div className="font-medium text-foreground">{a.label}</div>
                <div className="text-xs text-muted-foreground">{a.desc}</div>
              </div>
            </div>
          ))}
          <div className="pt-3 border-t border-border/50 text-xs text-muted-foreground">
            LinkedIn restricts automated access to profile data. Portify AI does not bypass login,
            CAPTCHAs, or any access controls.
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        No account required &middot; Nothing is saved to a database &middot; Drafts stay in your browser
      </p>
    </div>
  );
}

function toProfileInfo(raw: any, source: 'linkedin' | 'manual') {
  return {
    fullName: raw.fullName || '',
    headline: raw.headline || '',
    summary: raw.summary || '',
    location: raw.location,
    email: raw.email,
    profileImage: raw.profileImage,
    publicLinks: (raw.publicLinks || []).map((l: any) => ({
      id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      label: l.label || 'Profile',
      url: l.url || '',
      type: l.type || 'other',
    })),
    experience: (raw.experience || []).map((e: any, i: number) => ({
      id: `exp-${i}`,
      title: e.title || '',
      company: e.company || '',
      location: e.location,
      startDate: e.startDate || '',
      endDate: e.endDate,
      current: !!e.current,
      description: e.description || '',
      highlights: e.highlights || [],
    })),
    education: (raw.education || []).map((e: any, i: number) => ({
      id: `edu-${i}`,
      degree: e.degree || '',
      institution: e.institution || '',
      field: e.field,
      startDate: e.startDate,
      endDate: e.endDate,
    })),
    skills: (raw.skills || []).map((s: any, i: number) => ({
      id: `skill-${i}`,
      name: s.name || '',
      category: s.category || 'General',
      level: s.level || 3,
    })),
    certifications: (raw.certifications || []).map((c: any, i: number) => ({
      id: `cert-${i}`,
      name: c.name || '',
      issuer: c.issuer || '',
      date: c.date,
    })),
    projects: (raw.projects || []).map((p: any, i: number) => ({
      id: `proj-${i}`,
      title: p.title || '',
      description: p.description || '',
      technologies: p.technologies || [],
      link: p.link,
      github: p.github,
      featured: false,
    })),
    source,
    extractedAt: new Date().toISOString(),
  };
}

function ManualEntry({ onComplete }: { onComplete: (p: any) => void }) {
  const [form, setForm] = useState({
    fullName: '',
    headline: '',
    summary: '',
    email: '',
    location: '',
    skills: '',
    experience: '',
    education: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate processing then complete
    setTimeout(() => {
      const skills = form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name, i) => ({ id: `s${i}`, name, category: 'General', level: 3 }));
      onComplete({
        fullName: form.fullName,
        headline: form.headline,
        summary: form.summary,
        location: form.location || undefined,
        email: form.email || undefined,
        publicLinks: [],
        experience: [],
        education: [],
        skills,
        certifications: [],
        projects: [],
      });
      setSubmitting(false);
    }, 600);
  };

  return (
    <Card className="mt-8 max-w-2xl">
      <CardHeader>
        <CardTitle>Enter your information manually</CardTitle>
        <CardDescription>Fill in what you&rsquo;d like to appear on your portfolio.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <TextInput label="Headline / role" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
          </div>
          <Textarea
            label="Professional summary"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextInput label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <Textarea
            label="Skills (comma-separated)"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="e.g. Python, React, AWS, CI/CD"
          />
          <button
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Continue to review'
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={onChange}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

function ButtonExtract({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-sm transition-colors ${
        disabled
          ? 'bg-muted text-muted-foreground cursor-not-allowed'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
      }`}
    >
      {children}
    </button>
  );
}

