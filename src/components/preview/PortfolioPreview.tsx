import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Sparkles, Terminal, Shield, Code, Layers, BarChart, Cloud, Globe, Mail, GitBranch, Link, RefreshCw } from 'lucide-react';

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
  'soc-projects': 'SOC Projects',
  'security-labs': 'Security Labs',
  projects: 'Projects',
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

const ICONS: Record<string, any> = {
  hero: Sparkles,
  about: Terminal,
  'security-skills': Shield,
  'ai-skill': Code,
  'ai-skills': Code,
  'tech-skills': Code,
  'web-skills': Code,
  'design-skills': Layers,
  'data-skills': BarChart,
  'cloud-skills': Cloud,
  projects: Code,
  'soc-projects': Shield,
  'security-labs': Terminal,
  'model-showcase': Sparkles,
  research: Sparkles,
  datasets: BarChart,
  'case-studies': Layers,
  visualizations: BarChart,
  architecture: Cloud,
  experience: BriefcaseIcon,
  education: GraduationIcon,
  certifications: AwardIcon,
  github: GitBranch,
  dribbble: Link,
  contact: Mail,
};

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-5 w-5 ${className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h8a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
function GraduationIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-5 w-5 ${className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4V8m0 6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function AwardIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-5 w-5 ${className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l7-4 7 4M5 13l-.3 1.196A6 6 0 0011.996 20h.004c1.697 0 3.062-.579 4.16-1.456L17 13M5 13l3.657.914a3 3 0 004.772-.003L17 13" />
    </svg>
  );
}

export interface PortfolioPreviewProps {
  className?: string;
  mobile?: boolean;
}

export function PortfolioPreview({ className, mobile = false }: PortfolioPreviewProps) {
  const { profile, design, previewDesign } = usePortfolio();
  const d = previewDesign || design;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!profile || !d) {
    return (
      <div className={`rounded-2xl border border-border/50 bg-card min-h-[500px] flex flex-col items-center justify-center text-muted-foreground ${className || ''}`}>
        Loading preview…
      </div>
    );
  }

  const style = `\
:root{--primary:${d.colors.primary};--secondary:${d.colors.secondary};--accent:${d.colors.accent};--bg:${d.colors.background};--surface:${d.colors.surface};--text:${d.colors.text};--muted:${d.colors.textMuted};--heading:${d.typography.headingFont};--body:${d.typography.bodyFont};--mono:${d.typography.monoFont}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:var(--body);background:var(--bg);color:var(--text);line-height:1.6}}
a{{color:var(--accent);text-decoration:none}}
.container{{max-width:{d.layout.containerWidth === 'narrow' ? '720px' : d.layout.containerWidth === 'wide' ? '1000px' : 'none'};margin:0 auto;padding:0 1.5rem}}
.skip{{position:absolute;top:-40px;left:0;background:var(--accent);color:var(--primary-foreground,#000);padding:.5rem 1rem;z-index:100}}
.skip:focus{{top:0}}
section{{padding:4rem 0}}
header{{position:sticky;top:0;z-index:50;background:rgba(5,10,20,0.6);backdrop-filter:blur(8px);border-bottom:1px solid rgba(255,255,255,0.06)}}
.header-inner{{display:flex;align-items:center;justify-content:space-between;max-width:1000px;margin:0 auto;padding:1rem 1.5rem}}
.logo{{display:flex;align-items:center;gap:.5rem;font-family:var(--heading);font-weight:700;font-size:1.25rem;color:var(--text)}}
.logo-mark{{font-family:var(--mono);color:var(--accent)}}
nav ul{{display:flex;gap:1.75rem;list-style:none}}
.nav-link{{color:var(--muted);font-weight:500;font-size:.95rem}}
.nav-link:hover{{color:var(--accent)}}
.hero{{padding:5rem 0 3rem}}
.hero-grid{{display:grid;gap:2.5rem;align-items:center}}
@media(min-width:768px){{.hero-grid{{grid-template-columns:1fr 1fr}}}}
.hero-title{{font-family:var(--heading);font-size:clamp(2rem,6vw,3.5rem);font-weight:700;line-height:1.1;margin-bottom:1rem}}
.hero-sub{{font-size:1.125rem;color:var(--muted);max-width:42rem;margin-bottom:1.5rem}}
.btn{{display:inline-flex;align-items:center;gap:.5rem;background:var(--accent);color:#011120;border:none;padding:.75rem 1.5rem;border-radius:6px;font-weight:600}}
.btn-ghost{{background:transparent;color:var(--text);border:1px solid var(--muted);padding:.75rem 1.5rem;border-radius:6px;font-weight:600}}
.hero-image{{width:240px;height:240px;border-radius:1rem;object-fit:cover;border:2px solid var(--accent)}}
.hero-avatar{{width:240px;height:240px;border-radius:1rem;background:var(--surface);border:2px solid var(--accent);display:grid;place-items:center;font-family:var(--heading);font-weight:700;font-size:2.5rem;color:var(--accent)}}
.section-header{{margin-bottom:2rem}}
.section-title{{font-family:var(--heading);font-size:1.5rem;font-weight:700;margin-bottom:.5rem}}
.divider{{width:3rem;height:3px;background:var(--accent);border-radius:2px}}
.skill-tag{{background:var(--surface);border:1px solid rgba(255,255,255,0.08);color:var(--muted);padding:.4rem .8rem;border-radius:4px;font-size:.9rem;display:inline-block;margin:.25rem .25rem 0 0}}
.project-card{{background:var(--surface);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:1.5rem;margin-bottom:1.5rem}}
.project-card h3{{font-family:var(--heading);font-size:1.15rem;margin-bottom:.5rem}}
.exp-item{{margin-bottom:1.5rem;border-left:3px solid var(--accent);padding-left:1rem}}
.cert-card{{background:var(--surface);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:1rem;margin-bottom:1rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem}}
`;

  const renderSections = () => {
    const els = d.sectionOrder.map((id) => {
      switch (id) {
        case 'hero': return heroEl();
        case 'about': return sectionEl('about', 'About Me', aboutEl());
        case 'security-skills': case 'ai-skills': case 'tech-skills': case 'web-skills': case 'design-skills': case 'data-skills': case 'cloud-skills':
          return sectionEl('skills', SECTION_LABELS[id], skillsEl());
        case 'projects': case 'soc-projects': case 'model-showcase': case 'case-studies': case 'visualizations':
          return sectionEl('projects', SECTION_LABELS[id], projectsEl());
        case 'security-labs': return sectionEl('labs', 'Security Labs', labsEl());
        case 'incident-response': return sectionEl('incident', 'Incident Response', incidentEl());
        case 'write-ups': return sectionEl('writeups', 'Technical Write-ups', writeupsEl());
        case 'research': return sectionEl('research', 'Research', researchEl());
        case 'datasets': return sectionEl('datasets', 'Datasets', datasetsEl());
        case 'architecture': return sectionEl('architecture', 'Architecture', architectureEl());
        case 'experience': return sectionEl('experience', 'Experience', experienceEl());
        case 'education': return sectionEl('education', 'Education', educationEl());
        case 'certifications': return sectionEl('certifications', 'Certifications', certificationsEl());
        case 'github': return sectionEl('github', 'GitHub', githubEl());
        case 'dribbble': return sectionEl('dribbble', 'Design Portfolio', dribbbleEl());
        case 'contact': return sectionEl('contact', 'Contact', contactEl());
        default: return null;
      }
    });
    return <>{els}</>;
  };

  const heroEl = () => (
    <section id="hero" className="hero">
      <a href="#main" className="skip">Skip to main content</a>
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow" style={{ color: d.colors.accent, fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.125em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Available for {profile.headline}
            </p>
            <h1 className="hero-title">{profile.fullName}</h1>
            <p className="hero-sub">{profile.summary || 'Professional portfolio built with Portify AI.'}</p>
            <div className="hero-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <a href="#projects" className="btn">View Projects</a>
              <a href="#contact" className="btn-ghost">Contact</a>
            </div>
          </div>
          <div className="hero-visual" style={{ display: 'flex', justifyContent: 'center' }}>
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.fullName} className="hero-image" />
            ) : (
              <div className="hero-avatar">{profile.fullName.charAt(0)}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const sectionEl = (id: string, title: string, content: React.ReactNode) => {
    const Icon = ICONS[id];
    return (
      <section key={id} id={id}>
        <div className="container">
          <div className="section-header">
            <div className="flex items-center gap-2 mb-2">
              {Icon && <Icon className="h-4 w-4 text-accent" />}
              <h2 className="section-title">{title}</h2>
            </div>
            <div className="divider"></div>
          </div>
          {content}
        </div>
      </section>
    );
  };

  const aboutEl = () => (
    <>
      <p style={{ fontSize: '1.1rem', color: d.colors.textMuted, maxWidth: '42rem' }}>
        {profile.summary || 'Passionate professional dedicated to excellence in my field.'}
      </p>
      {profile.publicLinks.length && (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {profile.publicLinks.map((l) => (
            <a key={l.id} href={l.url} className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} target="_blank" rel="noopener">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );

  const skillsEl = () => {
    const byCat: Record<string, string[]> = {};
    for (const s of profile.skills) {
      (byCat[s.category || 'General'] = byCat[s.category || 'General'] || []).push(s.name);
    }
    const groups = Object.entries(byCat).map(([cat, items]) => (
      <div key={cat} style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: d.typography.headingFont, fontSize: '1.1rem', marginBottom: '0.5rem', color: d.colors.accent }}>{cat}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {items.map((i) => (
            <span key={i} className="skill-tag">{i}</span>
          ))}
        </div>
      </div>
    ));
    return groups.length ? groups : <p>No skills listed yet.</p>;
  };

  const projectsEl = () => {
    const items = profile.projects.map((p) => (
      <article key={p.id} className="project-card">
        <h3>{p.title}</h3>
        <p style={{ color: d.colors.textMuted, marginBottom: '1rem' }}>{p.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {p.technologies.map((t) => (
            <span key={t} style={{ background: `rgba(34,211,238,0.1)`, color: d.colors.secondary, padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontFamily: d.typography.monoFont }}>
              {t}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {p.github && <a href={p.github} className="btn-ghost" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }} target="_blank" rel="noopener">GitHub</a>}
          {p.link && <a href={p.link} className="btn" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>Live Demo</a>}
        </div>
      </article>
    ));
    return items.length ? items : <p>No projects listed yet.</p>;
  };

  const labsEl = () => <p style={{ color: d.colors.textMuted }}>Hands-on security labs and controlled environments.</p>;
  const incidentEl = () => <p style={{ color: d.colors.textMuted }}>Incident response methodologies and playbooks.</p>;
  const writeupsEl = () => <p style={{ color: d.colors.textMuted }}>Technical write-ups and security analysis.</p>;
  const researchEl = () => <p style={{ color: d.colors.textMuted }}>AI research and publications.</p>;
  const datasetsEl = () => <p style={{ color: d.colors.textMuted }}>Dataset visualizations and exploration.</p>;
  const architectureEl = () => <p style={{ color: d.colors.textMuted }}>Cloud architecture diagrams.</p>;
  const experienceEl = () => (
    <>
      {profile.experience.map((e) => (
        <article key={e.id} className="exp-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h3 style={{ fontFamily: d.typography.headingFont, fontSize: '1.15rem' }}>{e.title}</h3>
            <span style={{ fontFamily: d.typography.monoFont, fontSize: '0.85rem', color: d.colors.secondary }}>{e.startDate} – {e.current ? 'Present' : e.endDate || ''}</span>
          </div>
          <h4 style={{ fontSize: '1rem', color: d.colors.secondary, marginBottom: '0.5rem' }}>{e.company}</h4>
          <p style={{ color: d.colors.textMuted, marginBottom: '0.75rem' }}>{e.description}</p>
          {e.highlights.length && (
            <ul style={{ color: d.colors.textMuted, listStyle: 'disc', paddingLeft: '1.25rem' }}>
              {e.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          )}
        </article>
      ))}
    </>
  );
  const educationEl = () => (
    <>
      {profile.education.map((e) => (
        <article key={e.id} style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: d.typography.headingFont, fontSize: '1.15rem' }}>{e.degree}</h3>
          <h4 style={{ fontSize: '1rem', color: d.colors.secondary }}>{e.institution}</h4>
          <p style={{ fontFamily: d.typography.monoFont, fontSize: '0.85rem', color: d.colors.textMuted }}>{`${e.startDate || ''} – ${e.endDate || ''}`}</p>
        </article>
      ))}
    </>
  );
  const certificationsEl = () => (
    <>
      {profile.certifications.map((c) => (
        <article key={c.id} className="cert-card">
          <div>
            <h3 style={{ fontFamily: d.typography.headingFont, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{c.name}</h3>
            <p style={{ color: d.colors.textMuted, fontSize: '0.9rem' }}>{c.issuer}</p>
          </div>
          <div style={{ fontFamily: d.typography.monoFont, fontSize: '0.85rem', color: d.colors.textMuted, textAlign: 'right' }}>
            {c.date || ''}
          </div>
        </article>
      ))}
    </>
  );
  const githubEl = () => (
    <div style={{ color: d.colors.textMuted }}>
      <p>Explore repositories and contributions.</p>
      {profile.publicLinks.find((l) => l.type === 'github') && (
        <a href={profile.publicLinks.find((l) => l.type === 'github')!.url} className="btn" style={{ marginTop: '1rem' }}>View GitHub</a>
      )}
    </div>
  );
  const dribbbleEl = () => <p style={{ color: d.colors.textMuted }}>UI/UX case studies and design work.</p>;
  const contactEl = () => (
    <div style={{ maxWidth: '36rem' }}>
      <p style={{ color: d.colors.textMuted, marginBottom: '1.5rem' }}>I'm open to new opportunities. Feel free to reach out.</p>
      {profile.email && <p style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> <a href={`mailto:${profile.email}`}>{profile.email}</a></p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {profile.publicLinks.map((l) => (
          <a key={l.id} href={l.url} className="btn-ghost" style={{ padding: '0.6rem 1.2rem' }} target="_blank" rel="noopener">{l.label}</a>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`${className || ''} relative`}>
      <style dangerouslySetInnerHTML={{ __html: style }} />
      <header className="site-header">
        <div className="header-inner">
          <a href="#hero" className="logo">
            <span className="logo-mark">[#]</span>
            <span className="logo-text">{profile.fullName}</span>
          </a>
          <nav className="hidden md:flex">
            <ul>
              {d.sectionOrder.filter((id) => id !== 'hero').map((id) => (
                <li key={id}><a href={`#${id}`} className="nav-link">{SECTION_LABELS[id] || id}</a></li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main id="main">{renderSections()}</main>
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem 0', textAlign: 'center', color: d.colors.textMuted, fontSize: '0.875rem' }}>
        Built with Portify AI
      </footer>
    </div>
  );
}
