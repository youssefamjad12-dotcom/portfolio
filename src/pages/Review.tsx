import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import {
  User,
  Briefcase,
  GraduationCap,
  Mail,
  Link,
  Code,
  Award,
  Image,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';
import { Textarea } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

type ExpItem = {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  highlights: string[];
};

type EduItem = {
  id: string;
  degree: string;
  institution: string;
  field?: string;
  startDate?: string;
  endDate?: string;
};

type SkillItem = { id: string; name: string; category: string; level: number };
type CertItem = { id: string; name: string; issuer: string; date?: string };
type ProjItem = { id: string; title: string; description: string; technologies: string[]; link?: string; github?: string };

export default function Review() {
  const navigate = useNavigate();
  const { profile, updateProfile, setStep, setAnalysis, setDesign, apiKey, demoMode } = usePortfolio();

  if (!profile) {
    navigate('/import');
    return null;
  }

  const [form, setForm] = useState({
    fullName: profile.fullName,
    headline: profile.headline,
    summary: profile.summary,
    location: profile.location || '',
    email: profile.email || '',
    profileImage: profile.profileImage || '',
  });
  const [experience, setExperience] = useState<ExpItem[]>(profile.experience);
  const [education, setEducation] = useState<EduItem[]>(profile.education);
  const [skills, setSkills] = useState<SkillItem[]>(profile.skills);
  const [certs, setCerts] = useState<CertItem[]>(profile.certifications);
  const [projects, setProjects] = useState<ProjItem[]>(profile.projects);
  const [links, setLinks] = useState<{ id: string; label: string; url: string; type: string }[]>(profile.publicLinks);

  const handleGenerate = () => {
    const updated = {
      ...profile,
      ...form,
      experience,
      education,
      skills,
      certifications: certs,
      projects,
      publicLinks: links,
    };
    updateProfile(updated);

    // Run AI analysis + design generation
    import('../services/ai').then(({ analyzeProfile }) => {
      analyzeProfile(updated, apiKey || null).then(({ analysis, design }) => {
        setAnalysis(analysis);
        setDesign(design);
        setStep('design');
        navigate('/design');
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setStep('import'); navigate('/import'); }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="px-2 py-0.5 rounded text-xs text-muted-foreground">Review &amp; correct</span>
      </div>

      <h1 className="text-3xl font-display font-bold text-foreground mb-1">Review your information</h1>
      <p className="text-muted-foreground mb-6">Make sure everything looks right before we generate your design.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: profile basics */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Name, headline, summary, contact</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-4 p-4 border-b border-border/50">
                <Field label="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                <Field label="Headline / role" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
              </div>
              <div className="p-4 border-b border-border/50">
                <label className="block text-sm font-medium text-muted-foreground mb-2">Professional summary</label>
                <Textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="h-32"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 p-4">
                <Field label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Field label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                <Field label="Profile image URL" value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          {[
            { key: 'experience', label: 'Experience', icon: Briefcase, items: experience, setItems: setExperience, itemToRow: expRow },
            { key: 'education', label: 'Education', icon: GraduationCap, items: education, setItems: setEducation, itemToRow: eduRow },
            { key: 'projects', label: 'Projects', icon: Code, items: projects, setItems: setProjects, itemToRow: projRow },
            { key: 'certs', label: 'Certifications', icon: Award, items: certs, setItems: setCerts, itemToRow: certRow },
            { key: 'skills', label: 'Skills', icon: Code, items: skills, setItems: setSkills, itemToRow: skillRow },
            { key: 'links', label: 'Public links', icon: Link, items: links, setItems: setLinks, itemToRow: linkRow },
          ].map((section, idx) => (
            <ListSection key={section.key} {...section} />
          ))}
        </div>

        {/* Right: preview summary */}
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Ready to generate?</CardTitle>
            <CardDescription>Your specialization and design come next.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Name</span>
                <span className="text-foreground truncate">{form.fullName || '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Headline</span>
                <span className="text-foreground truncate">{form.headline || '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Experience entries</span>
                <span className="text-muted-foreground">{experience.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Skills</span>
                <span className="text-muted-foreground">{skills.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Projects</span>
                <span className="text-muted-foreground">{projects.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mode</span>
                <span className="flex items-center gap-1">
                  <Badge variant={demoMode ? 'outline' : 'secondary'}>
                    {demoMode ? 'Demo AI' : 'Live AI'}
                  </Badge>
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              AI will suggest your specialization based on your info. You can change it on the next screen.
            </p>

            <button
              onClick={handleGenerate}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Generate AI design <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------- reusable field ---------- */
function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

/* ---------- generic list section ---------- */
function ListSection({
  key,
  label,
  icon: Icon,
  items,
  setItems,
  itemToRow,
}: {
  key: string;
  label: string;
  icon: any;
  items: any[];
  setItems: (v: any[]) => void;
  itemToRow: (item: any, i: number, ctx: any) => JSX.Element;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<any>(null);

  const addItem = () => {
    const blank = blankFor(key);
    setItems([...items, blank]);
    setEditing(blank.id);
    setDraft({ ...blank });
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const saveEdit = () => {
    if (!draft) return;
    setItems(items.map((i) => (i.id === editing ? { ...i, ...draft } : i)));
    setEditing(null);
    setDraft(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft(null);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">{label}</CardTitle>
        </div>
        <button
          onClick={addItem}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="h-3 w-3" /> Add
        </button>
      </CardHeader>
      <CardContent className="p-3">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No {label.toLowerCase()} yet.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={item.id} className="rounded-lg border border-border/50 p-2 bg-background/30">
                {editing === item.id ? (
                  <EditItem item={item} draft={draft || item} setDraft={setDraft} onSave={saveEdit} onCancel={cancelEdit} itemToRow={itemToRow} ctx={{ i, items, setItems }} />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {itemToRow(item, i, { items, setItems })}
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => { setEditing(item.id); setDraft({ ...item }); }}
                        className="p-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function blankFor(key: string): any {
  const now = Date.now();
  const id = `item-${now}`;
  if (key === 'experience') return { id, title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '', highlights: [] };
  if (key === 'education') return { id, degree: '', institution: '', field: '', startDate: '', endDate: '' };
  if (key === 'projects') return { id, title: '', description: '', technologies: '', link: '', github: '' };
  if (key === 'certs') return { id, name: '', issuer: '', date: '' };
  if (key === 'skills') return { id, name: '', category: 'General', level: 3 };
  if (key === 'links') return { id, label: '', url: '', type: 'other' };
  return { id };
}

/* ---------- inline editors ---------- */
function EditItem({
  item,
  draft,
  setDraft,
  onSave,
  onCancel,
  itemToRow,
  ctx,
}: any) {
  const fields = editFields(ctx.items, item, ctx.setItems);
  return (
    <div className="space-y-2 p-2 bg-card border border-input">
      {fields.map((f, i) => (
        <div key={i} className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{f.label}</label>
          {f.type === 'textarea' ? (
            <Textarea value={f.value} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} className="h-10" />
          ) : f.type === 'tags' ? (
            <div className="flex gap-2">
              <input
                value={f.value}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                className="flex-1 h-9 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => {
                  const tags = f.value.split(',').map((t) => t.trim()).filter(Boolean);
                  setDraft({ ...draft, [f.key]: tags });
                }}
                className="px-2 text-xs text-muted-foreground hover:text-primary"
              >
                set
              </button>
            </div>
          ) : f.type === 'number' ? (
            <input
              type="number"
              min="1" max="5"
              value={f.value}
              onChange={(e) => setDraft({ ...draft, [f.key]: Number(e.target.value) || 0 })}
              className="h-9 w-20 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          ) : (
            <input
              value={f.value}
              onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
              className="h-9 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}
        </div>
      ))}
      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
        <button onClick={onSave} className="flex-1 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90">
          Save
        </button>
        <button onClick={onCancel} className="px-3 py-2 rounded-md border border-input text-xs hover:bg-accent">
          Cancel
        </button>
      </div>
    </div>
  );
}

function editFields(items: any, item: any, setItems: any) {
  const base = (key: string, label: string, value: any, type = 'text') => ({ key, label, value: value == null ? '' : value, type });
  if (item.title !== undefined && item.company !== undefined) {
    return [
      base('title', 'Title', item.title),
      base('company', 'Company', item.company),
      base('location', 'Location', item.location),
      base('startDate', 'Start date', item.startDate),
      base('endDate', 'End date', item.endDate),
      base('current', 'Current role', item.current ? 'yes' : 'no'),
      base('description', 'Description', item.description, 'textarea'),
      { key: 'highlights', label: 'Highlights (comma-separated)', value: (item.highlights || []).join(', '), type: 'tags' },
    ];
  }
  if (item.degree !== undefined) {
    return [
      base('degree', 'Degree', item.degree),
      base('institution', 'Institution', item.institution),
      base('field', 'Field of study', item.field),
      base('startDate', 'Start date', item.startDate),
      base('endDate', 'End date', item.endDate),
    ];
  }
  if (item.technologies !== undefined) {
    return [
      base('title', 'Project title', item.title),
      base('description', 'Description', item.description, 'textarea'),
      { key: 'technologies', label: 'Technologies (comma-separated)', value: (item.technologies || []).join(', '), type: 'tags' },
      base('link', 'Live demo URL', item.link),
      base('github', 'GitHub URL', item.github),
    ];
  }
  if (item.issuer !== undefined) {
    return [base('name', 'Certification name', item.name), base('issuer', 'Issuer', item.issuer), base('date', 'Date', item.date)];
  }
  if (item.category !== undefined) {
    return [base('name', 'Skill name', item.name), base('category', 'Category', item.category), { key: 'level', label: 'Level (1-5)', value: item.level, type: 'number' }];
  }
  return [base('label', 'Label', item.label), base('url', 'URL', item.url), base('type', 'Type', item.type)];
}

/* ---------- row renderers ---------- */
function expRow(item: ExpItem, _i: number, _ctx: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <span className="font-semibold text-foreground truncate">{item.title}</span>
        {item.current && <Badge variant="outline" className="text-[10px]">Current</Badge>}
      </div>
      <span className="text-xs text-muted-foreground">{item.company}</span>
      <span className="text-xs text-muted-foreground">{item.startDate} – {item.current ? 'Present' : item.endDate || ''}</span>
    </div>
  );
}
function eduRow(item: EduItem) {
  return (
    <div className="space-y-1">
      <span className="font-semibold text-foreground">{item.degree}</span>
      <span className="text-xs text-muted-foreground">{item.institution}</span>
      {item.field && <span className="text-xs text-muted-foreground">{item.field}</span>}
    </div>
  );
}
function projRow(item: ProjItem) {
  return (
    <div className="space-y-1">
      <span className="font-semibold text-foreground">{item.title}</span>
      {item.technologies.length && (
        <span className="text-xs text-muted-foreground">{item.technologies.slice(0, 3).join(', ')}</span>
      )}
    </div>
  );
}
function certRow(item: CertItem) {
  return (
    <div className="space-y-1">
      <span className="font-semibold text-foreground">{item.name}</span>
      <span className="text-xs text-muted-foreground">{item.issuer}</span>
    </div>
  );
}
function skillRow(item: SkillItem) {
  return (
    <div className="space-y-1">
      <span className="font-semibold text-foreground">{item.name}</span>
      <span className="text-xs text-muted-foreground">{item.category} · level {item.level}</span>
    </div>
  );
}
function linkRow(item: { label: string; url: string; type: string }) {
  return (
    <div className="space-y-1">
      <span className="font-semibold text-foreground truncate">{item.label}</span>
      <span className="text-xs text-muted-foreground truncate">{item.url}</span>
    </div>
  );
}
