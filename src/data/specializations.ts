import type { Specialization, DesignConfig, ColorConfig, TypographyConfig, LayoutConfig, BackgroundConfig, AnimationConfig, ComponentConfig } from '../types';

export const SPECIALIZATIONS: Record<
  Specialization,
  {
    id: Specialization;
    name: string;
    description: string;
    icon: string;
    tagline: string;
    sections: string[];
  }
> = {
  cybersecurity: {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'SOC analysis, threat detection, incident response, and blue team operations.',
    icon: 'shield',
    tagline: 'Defensive by design.',
    sections: ['hero', 'about', 'security-skills', 'soc-projects', 'security-labs', 'certifications', 'incident-response', 'write-ups', 'github', 'contact'],
  },
  'ai-engineer': {
    id: 'ai-engineer',
    name: 'AI Engineer',
    description: 'Machine learning, model deployment, research, and AI product development.',
    icon: 'cpu',
    tagline: 'Building intelligence.',
    sections: ['hero', 'about', 'ai-skills', 'model-showcase', 'research', 'datasets', 'projects', 'certifications', 'github', 'contact'],
  },
  'software-development': {
    id: 'software-development',
    name: 'Software Development',
    description: 'Full-stack engineering, system design, and scalable application development.',
    icon: 'code',
    tagline: 'Engineering quality software.',
    sections: ['hero', 'about', 'tech-skills', 'projects', 'experience', 'education', 'certifications', 'github', 'contact'],
  },
  'web-development': {
    id: 'web-development',
    name: 'Web Development',
    description: 'Frontend, backend, and full-stack web experiences with modern frameworks.',
    icon: 'globe',
    tagline: 'Crafting for the web.',
    sections: ['hero', 'about', 'web-skills', 'projects', 'experience', 'education', 'certifications', 'github', 'contact'],
  },
  'ui-ux-design': {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    description: 'User research, interface design, prototyping, and design systems.',
    icon: 'pen-tool',
    tagline: 'Designing experiences.',
    sections: ['hero', 'about', 'design-skills', 'case-studies', 'projects', 'education', 'certifications', 'dribbble', 'contact'],
  },
  'data-analysis': {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Data visualization, statistical analysis, and business intelligence.',
    icon: 'bar-chart',
    tagline: 'Turning data into insight.',
    sections: ['hero', 'about', 'data-skills', 'visualizations', 'projects', 'experience', 'education', 'certifications', 'github', 'contact'],
  },
  'cloud-devops': {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    description: 'Infrastructure as code, CI/CD, cloud architecture, and site reliability.',
    icon: 'cloud',
    tagline: 'Reliable infrastructure.',
    sections: ['hero', 'about', 'cloud-skills', 'architecture', 'projects', 'certifications', 'experience', 'github', 'contact'],
  },
} as const;

export const DEFAULT_COLORS: Record<Specialization, ColorConfig> = {
  cybersecurity: {
    primary: '#0ea5e9',
    secondary: '#38bdf8',
    accent: '#22d3ee',
    background: '#050a14',
    surface: '#0f172a',
    text: '#f8fafc',
    textMuted: '#94a3b8',
  },
  'ai-engineer': {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#d8b4fe',
    background: '#0b0c10',
    surface: '#161b22',
    text: '#f3f4f6',
    textMuted: '#9ca3af',
  },
  'software-development': {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    accent: '#93c5fd',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    textMuted: '#94a3b8',
  },
  'web-development': {
    primary: '#f59e0b',
    secondary: '#fbbf24',
    accent: '#fcd34d',
    background: '#0b0f19',
    surface: '#172032',
    text: '#ffffff',
    textMuted: '#cbd5e1',
  },
  'ui-ux-design': {
    primary: '#ec4899',
    secondary: '#f472b6',
    accent: '#f9a8d4',
    background: '#fafafa',
    surface: '#ffffff',
    text: '#0f172a',
    textMuted: '#64748b',
  },
  'data-analysis': {
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#6ee7b7',
    background: '#064e3b',
    surface: '#065f46',
    text: '#f0fdf4',
    textMuted: '#a7f3d0',
  },
  'cloud-devops': {
    primary: '#38bdf8',
    secondary: '#7dd3fc',
    accent: '#bae6fd',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
  },
};

export const DEFAULT_TYPOGRAPHY: TypographyConfig = {
  headingFont: 'Space Grotesk',
  bodyFont: 'Inter',
  monoFont: 'JetBrains Mono',
  headingScale: 1.2,
  bodyScale: 1,
};

export const DEFAULT_LAYOUT: LayoutConfig = {
  type: 'single',
  navStyle: 'top',
  containerWidth: 'wide',
};

export const DEFAULT_BACKGROUND: Record<Specialization, BackgroundConfig> = {
  cybersecurity: { type: 'network', color: '#0ea5e9', opacity: 0.15, animated: true },
  'ai-engineer': { type: 'grid', color: '#8b5cf6', opacity: 0.1, animated: true },
  'software-development': { type: 'grid', color: '#3b82f6', opacity: 0.08, animated: false },
  'web-development': { type: 'gradient', color: '#f59e0b', opacity: 0.06, animated: false },
  'ui-ux-design': { type: 'none', color: '#ec4899', opacity: 0, animated: false },
  'data-analysis': { type: 'grid', color: '#10b981', opacity: 0.08, animated: false },
  'cloud-devops': { type: 'grid', color: '#38bdf8', opacity: 0.1, animated: true },
};

export const DEFAULT_ANIMATIONS: AnimationConfig = {
  enabled: true,
  fadeIn: true,
  hoverLift: true,
  scanLines: false,
};

export function makeDefaultComponents(spec: Specialization): ComponentConfig[] {
  const base: ComponentConfig[] = [
    { id: 'nav', type: 'Navigation', props: {}, enabled: true },
    { id: 'hero', type: 'Hero', props: {}, enabled: true },
    { id: 'about', type: 'About', props: {}, enabled: true },
    { id: 'skills', type: 'Skills', props: {}, enabled: true },
    { id: 'projects', type: 'Projects', props: {}, enabled: true },
    { id: 'contact', type: 'Contact', props: {}, enabled: true },
  ];
  return base;
}

export function createDefaultDesign(spec: Specialization): DesignConfig {
  return {
    id: `design-${Date.now()}`,
    name: `${SPECIALIZATIONS[spec].name} Portfolio`,
    specialization: spec,
    layout: DEFAULT_LAYOUT,
    typography: DEFAULT_TYPOGRAPHY,
    colors: DEFAULT_COLORS[spec],
    components: makeDefaultComponents(spec),
    background: DEFAULT_BACKGROUND[spec],
    animations: DEFAULT_ANIMATIONS,
    sectionOrder: SPECIALIZATIONS[spec].sections,
    version: 1,
  };
}
