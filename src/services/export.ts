import JSZip from 'jszip';
import type { ProfileInfo, DesignConfig, ExportOptions } from '../types';

/* -------------------------------------------------------------------------- */
/*  HTML template generators                                                  */
/* -------------------------------------------------------------------------- */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function fontsCss(spec: string): string {
  const display =
    spec === 'ui-ux-design'
      ? "'Space Grotesk', system-ui, sans-serif"
      : "'Inter', system-ui, sans-serif";
  return `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
    :root {
      --color-primary: #22d3ee;
      --color-secondary: #38bdf8;
      --color-accent: #06b6d4;
      --color-bg: #050a14;
      --color-surface: #0f172a;
      --color-text: #f8fafc;
      --color-text-muted: #94a3b8;
      --font-heading: ${display};
      --font-body: 'Inter', system-ui, sans-serif;
      --font-mono: 'JetBrains Mono', ui-monospace, monospace;
    }
  `;
}

function baseCss(): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font-body);
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    a { color: var(--color-primary); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 1.5rem; }
    .skip-link {
      position: absolute; top: -40px; left: 0; background: var(--color-primary);
      color: #000; padding: 0.5rem 1rem; z-index: 100; transition: top 0.2s;
    }
    .skip-link:focus { top: 0; }
    section { padding: 5rem 0; }
    .eyebrow { font-size: 0.875rem; font-weight: 600; letter-spacing: 0.125em;
      color: var(--color-secondary); text-transform: uppercase; margin-bottom: 1rem; }
    .btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: var(--color-primary); color: #011120; border: none;
      padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600;
      cursor: pointer; transition: transform 0.2s, opacity 0.2s;
    }
    .btn:hover { transform: translateY(-2px); opacity: 0.95; text-decoration: none; }
    .btn-ghost {
      background: transparent; color: var(--color-text);
      border: 1px solid var(--color-text-muted); padding: 0.75rem 1.5rem;
      border-radius: 6px; font-weight: 600; cursor: pointer;
    }
    .btn-ghost:hover { border-color: var(--color-primary); color: var(--color-primary); }
  `;
}

function layoutCss(): string {
  return `
    header.site-header {
      position: sticky; top: 0; z-index: 50;
      background: rgba(5, 10, 20, 0.8); backdrop-filter: blur(8px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .header-inner { display: flex; align-items: center; justify-content: space-between;
      max-width: 1000px; margin: 0 auto; padding: 1rem 1.5rem; }
    .logo { display: flex; align-items: center; gap: 0.5rem; font-weight: 700;
      font-size: 1.25rem; font-family: var(--font-heading); color: var(--color-text); }
    .logo-mark { font-family: var(--font-mono); color: var(--color-primary); }
    nav.primary-nav ul { display: flex; gap: 1.75rem; list-style: none; }
    .nav-link { color: var(--color-text-muted); font-weight: 500; font-size: 0.95rem; }
    .nav-link:hover, .nav-link:focus { color: var(--color-primary); }
    .nav-cta { background: var(--color-primary); color: #011120; padding: 0.5rem 1rem;
      border-radius: 6px; font-weight: 700; }
    .nav-toggle { display: none; background: none; border: none; color: var(--color-text);
      cursor: pointer; font-size: 1.5rem; }
    @media (max-width: 768px) {
      nav.primary-nav { position: absolute; top: 100%; left: 0; right: 0;
        background: var(--color-surface); border-bottom: 1px solid rgba(255,255,255,0.06);
        padding: 1rem; display: none; }
      nav.primary-nav.open { display: block; }
      nav.primary-nav ul { flex-direction: column; gap: 1rem; padding: 0.5rem 0; }
      .nav-toggle { display: block; }
    }
  `;
}

function heroHtml(profile: ProfileInfo): string {
  const image = profile.profileImage
    ? `<img src="${escapeHtml(profile.profileImage)}" alt="${escapeHtml(profile.fullName)}" class="hero-image">`
    : `<div class="hero-avatar">${escapeHtml(profile.fullName.charAt(0))}</div>`;
  return `
    <section class="hero" id="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Available for ${escapeHtml(profile.headline)}</p>
          <h1 class="hero-title">${escapeHtml(profile.fullName)}</h1>
          <p class="hero-sub">${escapeHtml(profile.summary || 'Professional portfolio built with Portify AI.')}</p>
          <div class="hero-actions" style="margin-top: 1.5rem;">
            <a href="#projects" class="btn">View Projects</a>
            <a href="#contact" class="btn-ghost">Contact</a>
          </div>
          <div class="hero-meta" style="margin-top: 1.5rem; display: flex; gap: 2rem; flex-wrap: wrap; font-size: 0.9rem; color: var(--color-text-muted);">
            ${profile.location ? `<div><strong>Based in:</strong> ${escapeHtml(profile.location)}</div>` : ''}
            ${profile.publicLinks.length ? `<div><strong>Links:</strong> ${profile.publicLinks.length}</div>` : ''}
          </div>
        </div>
        <div class="hero-visual">${image}</div>
      </div>
    </section>
  `;
}

function heroCss(): string {
  return `
    .hero { padding: 6rem 0 4rem; }
    .hero-grid { display: grid; gap: 3rem; align-items: center; }
    @media (min-width: 768px) { .hero-grid { grid-template-columns: 1fr 1fr; } }
    .hero-title { font-family: var(--font-heading); font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700; line-height: 1.1; margin-bottom: 1rem; }
    .hero-sub { font-size: 1.125rem; color: var(--color-text-muted); max-width: 42rem; margin-bottom: 1.5rem; }
    .hero-visual { display: flex; justify-content: center; }
    .hero-image { width: 260px; height: 260px; border-radius: 1rem; object-fit: cover;
      border: 2px solid var(--color-primary); box-shadow: 0 20px 40px -10px rgba(34,211,238,0.25); }
    .hero-avatar { width: 260px; height: 260px; border-radius: 1rem; background: var(--color-surface);
      border: 2px solid var(--color-primary); display: grid; place-items: center;
      font-family: var(--font-heading); font-weight: 700; font-size: 3rem; color: var(--color-primary); }
  `;
}

function section(title: string, id: string, content: string): string {
  return `
    <section id="${id}">
      <div class="container">
        <div class="section-header" style="margin-bottom: 2rem;">
          <h2 class="section-title" style="font-family: var(--font-heading); font-size: 1.75rem;
            font-weight: 700; margin-bottom: 0.5rem;">${escapeHtml(title)}</h2>
          <div class="section-divider" style="width: 3rem; height: 3px; background: var(--color-primary); border-radius: 2px;"></div>
        </div>
        ${content}
      </div>
    </section>
  `;
}

function aboutHtml(profile: ProfileInfo): string {
  return section('About Me', 'about', `
    <p style="font-size: 1.1rem; color: var(--color-text-muted); max-width: 42rem;">
      ${escapeHtml(profile.summary || 'Passionate professional dedicated to excellence in my field.')}
    </p>
    ${profile.publicLinks.length
      ? `<div style="margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 1rem;">
          ${profile.publicLinks
            .map(
              (l) =>
                `<a href="${escapeHtml(l.url)}" class="btn-ghost" style="padding: 0.5rem 1rem; font-size: 0.9rem;" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`,
            )
            .join('')}
        </div>`
      : ''}
  `);
}

function skillsHtml(profile: ProfileInfo): string {
  const byCat: Record<string, string[]> = {};
  for (const s of profile.skills) {
    (byCat[s.category || 'General'] = byCat[s.category || 'General'] || []).push(s.name);
  }
  const groups = Object.entries(byCat)
    .map(
      ([cat, items]) => `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--color-primary);">${escapeHtml(cat)}</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${items.map((i) => `<span style="background: var(--color-surface); border: 1px solid rgba(255,255,255,0.08); color: var(--color-text-muted); padding: 0.4rem 0.8rem; border-radius: 4px; font-size: 0.9rem;">${escapeHtml(i)}</span>`).join('')}
          </div>
        </div>
      `,
    )
    .join('') || '<p>No skills listed yet.</p>';
  return section('Skills', 'skills', groups);
}

function projectsHtml(profile: ProfileInfo): string {
  const items = profile.projects
    .map(
      (p) => `
        <article style="background: var(--color-surface); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; transition: transform 0.2s;">
          <h3 style="font-family: var(--font-heading); font-size: 1.15rem; margin-bottom: 0.5rem;">${escapeHtml(p.title)}</h3>
          <p style="color: var(--color-text-muted); margin-bottom: 1rem;">${escapeHtml(p.description)}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
            ${p.technologies.map((t) => `<span style="background: rgba(34,211,238,0.1); color: var(--color-secondary); padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-family: var(--font-mono);">${escapeHtml(t)}</span>`).join('')}
          </div>
          <div style="display: flex; gap: 0.75rem;">
            ${p.github ? `<a href="${escapeHtml(p.github)}" class="btn-ghost" style="font-size: 0.85rem; padding: 0.4rem 0.9rem;" target="_blank" rel="noopener">GitHub</a>` : ''}
            ${p.link ? `<a href="${escapeHtml(p.link)}" class="btn" style="font-size: 0.85rem; padding: 0.4rem 0.9rem;">Live Demo</a>` : ''}
          </div>
        </article>
      `,
    )
    .join('') || '<p>No projects listed yet.</p>';
  return section('Projects', 'projects', items);
}

function experienceHtml(profile: ProfileInfo): string {
  if (!profile.experience.length) return '';
  const items = profile.experience
    .map(
      (e) => `
        <article style="margin-bottom: 1.5rem; border-left: 3px solid var(--color-primary); padding-left: 1rem;">
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.25rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.15rem;">${escapeHtml(e.title)}</h3>
            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-secondary);">${escapeHtml(`${e.startDate} – ${e.current ? 'Present' : e.endDate}`)}</span>
          </div>
          <h4 style="font-size: 1rem; color: var(--color-secondary); margin-bottom: 0.5rem;">${escapeHtml(e.company)}${e.location ? ` · ${escapeHtml(e.location)}` : ''}</h4>
          <p style="color: var(--color-text-muted); margin-bottom: 0.75rem;">${escapeHtml(e.description)}</p>
          ${e.highlights.length
            ? `<ul style="color: var(--color-text-muted); list-style: disc; padding-left: 1.25rem;">
                ${e.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}
              </ul>`
            : ''}
        </article>
      `,
    )
    .join('');
  return section('Experience', 'experience', items);
}

function educationHtml(profile: ProfileInfo): string {
  if (!profile.education.length) return '';
  const items = profile.education
    .map(
      (e) => `
        <article style="margin-bottom: 1.5rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.15rem;">${escapeHtml(e.degree)}</h3>
          <h4 style="font-size: 1rem; color: var(--color-secondary);">${escapeHtml(e.institution)}${e.field ? ` · ${escapeHtml(e.field)}` : ''}</h4>
          <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-text-muted);">${escapeHtml(`${e.startDate || ''} – ${e.endDate || ''}`)}</p>
        </article>
      `,
    )
    .join('');
  return section('Education', 'education', items);
}

function certificationsHtml(profile: ProfileInfo): string {
  if (!profile.certifications.length) return '';
  const items = profile.certifications
    .map(
      (c) => `
        <article style="background: var(--color-surface); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px; padding: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.25rem;">${escapeHtml(c.name)}</h3>
            <p style="color: var(--color-text-muted); font-size: 0.9rem;">${escapeHtml(c.issuer)}</p>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-text-muted); text-align: right;">
            ${c.date ? escapeHtml(c.date) : ''} ${c.url ? `<br><a href="${escapeHtml(c.url)}" class="btn-ghost" style="font-size: 0.8rem; padding: 0.25rem 0.6rem;" target="_blank" rel="noopener">Verify</a>` : ''}
          </div>
        </article>
      `,
    )
    .join('');
  return section('Certifications', 'certifications', items);
}

function contactHtml(profile: ProfileInfo): string {
  return section('Contact', 'contact', `
    <div style="max-width: 36rem;">
      <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">I'm open to new opportunities. Feel free to reach out.</p>
      ${profile.email ? `<p style="margin-bottom: 0.5rem;"><strong>Email:</strong> <a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a></p>` : ''}
      <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
        ${profile.publicLinks
          .map(
            (l) => `<a href="${escapeHtml(l.url)}" class="btn-ghost" style="padding: 0.6rem 1.2rem;" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`,
          )
          .join('')}
      </div>
    </div>
  `);
}

function fullHtml(profile: ProfileInfo, design: DesignConfig): string {
  const spec = design.specialization;
  const sections: string[] = [];
  for (const id of design.sectionOrder) {
    switch (id) {
      case 'hero':
        sections.push(heroHtml(profile));
        break;
      case 'about':
        sections.push(aboutHtml(profile));
        break;
      case 'security-skills':
      case 'ai-skills':
      case 'tech-skills':
      case 'web-skills':
      case 'design-skills':
      case 'data-skills':
      case 'cloud-skills':
        sections.push(skillsHtml(profile));
        break;
      case 'projects':
        sections.push(projectsHtml(profile));
        break;
      case 'experience':
        sections.push(experienceHtml(profile));
        break;
      case 'education':
        sections.push(educationHtml(profile));
        break;
      case 'certifications':
        sections.push(certificationsHtml(profile));
        break;
      case 'contact':
        sections.push(contactHtml(profile));
        break;
      default:
        break;
    }
  }
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(profile.fullName)} | Portfolio</title>
<meta name="description" content="${escapeHtml(profile.headline || 'Professional portfolio')}">
<style>
${fontsCss(spec)}
${baseCss()}
${layoutCss()}
${heroCss()}
@media (max-width: 640px) {
  .hero { padding: 4rem 0 3rem; }
  .hero-image, .hero-avatar { width: 200px; height: 200px; font-size: 2.25rem; }
}
</style>
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header" id="siteHeader">
  <div class="header-inner">
    <a href="#hero" class="logo"><span class="logo-mark">[#]</span><span class="logo-text">${escapeHtml(profile.fullName)}</span></a>
    <nav class="primary-nav" id="primaryNav" aria-label="Primary">
      <ul>
        ${design.sectionOrder
          .filter((id) => id !== 'hero')
          .map((id) => {
            const labels: Record<string, string> = {
              about: 'About', 'security-skills': 'Security Skills', 'ai-skills': 'AI Skills',
              'tech-skills': 'Technical Skills', 'web-skills': 'Web Skills', 'design-skills': 'Design Skills',
              'data-skills': 'Data Skills', 'cloud-skills': 'Cloud Skills', projects: 'Projects',
              experience: 'Experience', education: 'Education', certifications: 'Certifications',
              contact: 'Contact',
            };
            return `<li><a href="#${id}" class="nav-link">${escapeHtml(labels[id] || id)}</a></li>`;
          })
          .join('')}
        <li><a href="#contact" class="nav-link nav-cta">Contact</a></li>
      </ul>
    </nav>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">☰</button>
  </div>
</header>
<main id="main">
  ${sections.join('\n')}
</main>
<footer style="border-top: 1px solid rgba(255,255,255,0.06); padding: 2rem 0; text-align: center; color: var(--color-text-muted); font-size: 0.875rem;">
  Built with <a href="#" style="color: var(--color-primary);">Portify AI</a>. Exported for independent hosting.
</footer>
<script>
document.getElementById('navToggle')?.addEventListener('click', () => {
  const nav = document.getElementById('primaryNav');
  if (nav) nav.classList.toggle('open');
});
</script>
</body>
</html>`;
}

function readmeMd(profile: ProfileInfo, design: DesignConfig): string {
  return `# ${escapeHtml(profile.fullName)} — Portfolio

Exported by Portify AI. This is a complete, static website that you can host anywhere (GitHub Pages, Netlify, Vercel, etc.).

## Files
- \`index.html\` — the portfolio page
- \`README.md\` — this file

## Hosting
1. Upload \`index.html\` (and this README) to any static host.
2. No build step, no database, no account required.

## Customization
Edit \`index\`.html directly to change text, colors, or add sections. All styles are inline in \`<style>\`.

Generated for specialization: ${design.specialization}
`;
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

export async function generateWebsiteZip(
  profile: ProfileInfo,
  design: DesignConfig,
  options: ExportOptions,
): Promise<Blob> {
  const zip = new JSZip();

  zip.file('index.html', fullHtml(profile, design));
  if (options.includeReadme) {
    zip.file('README.md', readmeMd(profile, design));
  }

  return zip.generateAsync({ type: 'blob', compression: options.minify ? 'DEFLATE' : 'STORE' });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadConfigJson(profile: ProfileInfo, design: DesignConfig): void {
  const payload = {
    exportedAt: new Date().toISOString(),
    profile,
    design,
    version: 1,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const safeName = (profile.fullName || 'portfolio').replace(/\s+/g, '_').toLowerCase();
  downloadBlob(blob, `portify-config-${safeName}.json`);
}

export function importConfigJson(text: string): { profile: ProfileInfo; design: DesignConfig } | null {
  try {
    const payload = JSON.parse(text);
    if (!payload.profile || !payload.design) return null;
    return { profile: payload.profile, design: payload.design };
  } catch {
    return null;
  }
}
