import type { ProfileInfo, AIAnalysis, DesignConfig, DesignChange, Specialization, ChatMessage } from '../types';
import { createDefaultDesign, SPECIALIZATIONS, DEFAULT_COLORS } from '../data/specializations';

const DEMO_MODE_KEY = 'portify_demo_mode';

export function getDemoMode(): boolean {
  if (typeof sessionStorage === 'undefined') return true;
  try {
    return sessionStorage.getItem(DEMO_MODE_KEY) !== 'false';
  } catch {
    return true;
  }
}

export function setDemoMode(value: boolean): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(DEMO_MODE_KEY, value ? 'true' : 'false');
  } catch {
    // ignore
  }
}

/* -------------------------------------------------------------------------- */
/*  LLM Integration                                                           */
/* -------------------------------------------------------------------------- */

type LLMProvider = 'openai' | 'anthropic' | 'google' | 'groq' | 'custom';

interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model?: string;
  baseURL?: string;
}

function buildLLMConfig(apiKey: string): LLMConfig {
  // Heuristic provider detection based on key prefix.
  if (apiKey.startsWith('sk-') && apiKey.includes('proj') === false) {
    return { provider: 'openai', apiKey, model: 'gpt-4o-mini' };
  }
  if (apiKey.startsWith('sk-ant-')) {
    return { provider: 'anthropic', apiKey, model: 'claude-3-haiku-20240307' };
  }
  if (apiKey.startsWith('AIza')) {
    return { provider: 'google', apiKey, model: 'gemini-1.5-flash' };
  }
  if (apiKey.startsWith('gsk_')) {
    return { provider: 'groq', apiKey, model: 'llama-3.1-8b-instant' };
  }
  return { provider: 'custom', apiKey, model: 'default' };
}

async function callLLM(config: LLMConfig, system: string, user: string): Promise<string> {
  const { provider, apiKey, model } = config;

  const handlers: Record<LLMProvider, () => Promise<string>> = {
    openai: async () => {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
          temperature: 0.4,
        }),
      });
      if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    },
    anthropic: async () => {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'claude-3-haiku-20240307',
          max_tokens: 1024,
          system,
          messages: [{ role: 'user', content: user }],
        }),
      });
      if (!res.ok) throw new Error(`Anthropic error: ${res.status}`);
      const data = await res.json();
      return data.content?.[0]?.text || '';
    },
    google: async () => {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${system}\n\n${user}` }] }],
          }),
        },
      );
      if (!res.ok) throw new Error(`Google error: ${res.status}`);
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    },
    groq: async () => {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'llama-3.1-8b-instant',
          messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
          temperature: 0.4,
        }),
      });
      if (!res.ok) throw new Error(`Groq error: ${res.status}`);
      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    },
    custom: async () => {
      throw new Error('Custom provider requires a configured base URL.');
    },
  };

  return handlers[provider]();
}

/* -------------------------------------------------------------------------- */
/*  Demo (offline) implementations                                            */
/* -------------------------------------------------------------------------- */

const DEMO_ANALYSIS: Record<Specialization, AIAnalysis> = {
  cybersecurity: {
    specialization: 'cybersecurity',
    targetRole: 'SOC Analyst / Blue Team Engineer',
    professionalSummary:
      'Security-focused professional with experience in threat detection, SIEM monitoring, and incident response. Committed to protecting organizational assets through vigilant monitoring and rapid response.',
    keySkills: ['SIEM (Splunk, Sentinel)', 'Threat Detection', 'Incident Response', 'Network Security', 'Vulnerability Management', 'Python', 'Bash'],
    experienceSummary: 'Monitored security events and investigated alerts within a security operations center.',
    achievements: ['Reduced mean-time-to-detect by 22%', 'Handled 50+ security incidents', 'Built custom detection rules'],
    certifications: ['CompTIA Security+', 'LFCS', 'TryHackMe SOC Level 1'],
    educationSummary: 'Bachelor of Science in Cybersecurity (or related field)',
    brandingOpportunities: ['Highlight lab environment', 'Publish technical write-ups', 'Showcase CTF achievements'],
  },
  'ai-engineer': {
    specialization: 'ai-engineer',
    targetRole: 'AI / Machine Learning Engineer',
    professionalSummary:
      'AI engineer experienced in building and deploying machine learning models, with a focus on practical, production-ready AI applications.',
    keySkills: ['Python', 'PyTorch', 'TensorFlow', 'LLM Fine-tuning', 'RAG', 'MLOps', 'Docker'],
    experienceSummary: 'Developed and deployed AI models for real-world use cases.',
    achievements: ['Improved model accuracy by 15%', 'Deployed 3 production ML services', 'Published research on LLM efficiency'],
    certifications: ['TensorFlow Developer', 'AWS Machine Learning Specialty'],
    educationSummary: 'Master of Science in Artificial Intelligence (or related field)',
    brandingOpportunities: ['Share model cards', 'Publish research summaries', 'Demo interactive models'],
  },
  'software-development': {
    specialization: 'software-development',
    targetRole: 'Software Engineer',
    professionalSummary:
      'Software engineer focused on building scalable, maintainable applications with modern engineering practices.',
    keySkills: ['TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
    experienceSummary: 'Developed full-stack applications and contributed to production codebases.',
    achievements: ['Shipped 5+ production features', 'Reduced API latency by 30%', 'Led code reviews for team of 6'],
    certifications: ['AWS Certified Developer', 'React Certification'],
    educationSummary: 'Bachelor of Science in Computer Science (or related field)',
    brandingOpportunities: ['Maintain active GitHub', 'Write technical blog posts', 'Contribute to open source'],
  },
  'web-development': {
    specialization: 'web-development',
    targetRole: 'Frontend / Full-Stack Web Developer',
    professionalSummary:
      'Web developer crafting accessible, performant, and responsive web experiences with modern frameworks.',
    keySkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML5', 'CSS3'],
    experienceSummary: 'Built responsive websites and web applications for clients and internal products.',
    achievements: ['Launched 10+ websites', 'Improved Core Web Vitals by 40%', 'Built design system used across 3 products'],
    certifications: ['Meta Front-End Developer', 'freeCodeCamp Responsive Web Design'],
    educationSummary: 'Bachelor of Science in Web Development (or related field)',
    brandingOpportunities: ['Showcase live demos', 'Share CodePen experiments', 'Write frontend tutorials'],
  },
  'ui-ux-design': {
    specialization: 'ui-ux-design',
    targetRole: 'Product Designer / UX Designer',
    professionalSummary:
      'Product designer focused on user-centered design, research, and creating intuitive digital experiences.',
    keySkills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing', 'Adobe XD'],
    experienceSummary: 'Designed interfaces and conducted user research to inform product decisions.',
    achievements: ['Redesigned 4 product flows', 'Increased conversion by 18%', 'Built design system adopted by 2 teams'],
    certifications: ['Google UX Design Professional Certificate', 'Nielsen Norman UX Certificate'],
    educationSummary: 'Bachelor of Design / Human-Computer Interaction (or related field)',
    brandingOpportunities: ['Publish case studies', 'Share design process', 'Maintain Dribbble/Behance'],
  },
  'data-analysis': {
    specialization: 'data-analysis',
    targetRole: 'Data Analyst / Business Intelligence Analyst',
    professionalSummary:
      'Data analyst turning complex datasets into clear, actionable insights for business stakeholders.',
    keySkills: ['SQL', 'Python (pandas)', 'Tableau', 'Power BI', 'Excel', 'Statistics', 'Data Visualization'],
    experienceSummary: 'Analyzed business data and built dashboards to support decision-making.',
    achievements: ['Built 15+ executive dashboards', 'Identified $50K cost savings', 'Automated weekly reporting'],
    certifications: ['Google Data Analytics Professional Certificate', 'Tableau Desktop Specialist'],
    educationSummary: 'Bachelor of Science in Data Analytics / Statistics (or related field)',
    brandingOpportunities: ['Publish data visualizations', 'Share analysis notebooks', 'Write data stories'],
  },
  'cloud-devops': {
    specialization: 'cloud-devops',
    targetRole: 'DevOps Engineer / Cloud Engineer',
    professionalSummary:
      'Cloud and DevOps engineer focused on reliable infrastructure, automation, and site reliability engineering.',
    keySkills: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Python'],
    experienceSummary: 'Managed cloud infrastructure and automated deployment pipelines.',
    achievements: ['Reduced deployment time by 60%', 'Managed infrastructure for 5+ services', 'Maintained 99.9% uptime'],
    certifications: ['AWS Solutions Architect', 'Certified Kubernetes Administrator', 'Terraform Associate'],
    educationSummary: 'Bachelor of Science in Cloud Computing / DevOps (or related field)',
    brandingOpportunities: ['Share infrastructure-as-code repos', 'Write postmortems', 'Present at meetups'],
  },
};

function demoAnalysis(spec: Specialization, profile: ProfileInfo): AIAnalysis {
  const base = DEMO_ANALYSIS[spec];
  return {
    ...base,
    professionalSummary: profile.summary || base.professionalSummary,
    keySkills: [
      ...(profile.skills.map((s) => s.name).slice(0, 6)),
      ...base.keySkills.filter((k) => !profile.skills.some((s) => s.name.toLowerCase().includes(k.toLowerCase()))),
    ].slice(0, 7),
    experienceSummary: profile.experience.length
      ? profile.experience.map((e) => e.title).join(', ') + ' experience.'
      : base.experienceSummary,
    achievements: profile.projects.slice(0, 3).map((p) => `Delivered: ${p.title}`).concat(base.achievements).slice(0, 4),
    certifications: profile.certifications.length
      ? profile.certifications.map((c) => c.name)
      : base.certifications,
    educationSummary: profile.education.length
      ? `${profile.education[0].degree} — ${profile.education[0].institution}`
      : base.educationSummary,
  };
}

export async function analyzeProfile(
  profile: ProfileInfo,
  apiKey: string | null,
): Promise<{ analysis: AIAnalysis; design: DesignConfig }> {
  const spec = inferSpecialization(profile);
  const design = createDefaultDesign(spec);

  if (!apiKey || getDemoMode()) {
    const analysis = demoAnalysis(spec, profile);
    return { analysis, design };
  }

  const config = buildLLMConfig(apiKey);
  const system = `You are an expert career coach and portfolio strategist. Analyze the following LinkedIn-extracted professional profile and produce a JSON object only (no markdown, no extra text) with these exact keys: specialization (one of: cybersecurity, ai-engineer, software-development, web-development, ui-ux-design, data-analysis, cloud-devops), targetRole, professionalSummary, keySkills (array), experienceSummary, achievements (array), certifications (array), educationSummary, brandingOpportunities (array). Base everything ONLY on the provided profile. Do not invent degrees, jobs, or certifications. If information is missing, state that it is not provided.`;

  const user = JSON.stringify(profile, null, 2);
  let content: string;
  try {
    content = await callLLM(config, system, user);
  } catch (err) {
    // Fall back to demo on LLM failure so the app stays functional.
    const analysis = demoAnalysis(spec, profile);
    return { analysis, design };
  }

  let analysis: AIAnalysis;
  try {
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    analysis = {
      specialization: SPECIALIZATIONS[parsed.specialization as Specialization]
        ? (parsed.specialization as Specialization)
        : spec,
      targetRole: parsed.targetRole || 'Professional',
      professionalSummary: parsed.professionalSummary || profile.summary,
      keySkills: Array.isArray(parsed.keySkills) ? parsed.keySkills : [],
      experienceSummary: parsed.experienceSummary || '',
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
      educationSummary: parsed.educationSummary || '',
      brandingOpportunities: Array.isArray(parsed.brandingOpportunities)
        ? parsed.brandingOpportunities
        : [],
    };
  } catch {
    const analysis = demoAnalysis(spec, profile);
    return { analysis, design };
  }

  return { analysis, design };
}

export async function generateDesignChange(
  current: DesignConfig,
  instruction: string,
  profile: ProfileInfo,
  apiKey: string | null,
): Promise<DesignChange> {
  const spec = current.specialization;
  if (!apiKey || getDemoMode()) {
    return demoDesignChange(current, instruction, spec);
  }

  const config = buildLLMConfig(apiKey);
  const system = `You are a design-configuration engine. The user wants to modify a portfolio design. Return ONLY a JSON object with keys: type (one of: colors, layout, typography, components, background, animations, sectionOrder, fullRedesign), description, and config (a partial DesignConfig object with only the fields to change). Do not invent executable code. Valid section IDs: ${SPECIALIZATIONS[spec].sections.join(', ')}.`;
  const user = `Current design: ${JSON.stringify(current)}\nInstruction: ${instruction}\nProfile specialization: ${spec}`;

  try {
    const content = await callLLM(config, system, user);
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return demoDesignChange(current, instruction, spec);
  }
}

export async function chatReply(
  messages: ChatMessage[],
  current: DesignConfig,
  profile: ProfileInfo,
  apiKey: string | null,
): Promise<{ reply: string; change?: DesignChange }> {
  if (!apiKey || getDemoMode()) {
    const lastUser = messages[messages.length - 1]?.content || '';
    const change = demoDesignChange(current, lastUser, current.specialization);
    return {
      reply: demoChatReply(lastUser, current.specialization),
      change,
    };
  }

  const config = buildLLMConfig(apiKey);
  const system = `You are Portify AI's design assistant. Help the user refine their portfolio design. Respond conversationally and, when a design change is requested, also provide a JSON "change" block. Keep responses short and helpful. Never suggest executing arbitrary code.`;
  const history = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
  const user = `Current design: ${JSON.stringify(current)}\nConversation:\n${history}`;

  try {
    const content = await callLLM(config, system, user);
    return { reply: content };
  } catch {
    const lastUser = messages[messages.length - 1]?.content || '';
    const change = demoDesignChange(current, lastUser, current.specialization);
    return {
      reply: demoChatReply(lastUser, current.specialization),
      change,
    };
  }
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function inferSpecialization(profile: ProfileInfo): Specialization {
  const text = [
    profile.headline,
    profile.summary,
    ...profile.skills.map((s) => s.name),
    ...profile.experience.map((e) => e.title + ' ' + e.description),
    ...profile.certifications.map((c) => c.name),
  ]
    .join(' ')
    .toLowerCase();

  const scores: Record<Specialization, number> = {
    cybersecurity: 0,
    'ai-engineer': 0,
    'software-development': 0,
    'web-development': 0,
    'ui-ux-design': 0,
    'data-analysis': 0,
    'cloud-devops': 0,
  };

  const keywords: Record<Specialization, string[]> = {
    cybersecurity: ['security', 'soc', 'siem', 'incident', 'threat', 'soc analyst', 'blue team', 'splunk', 'vulnerability', 'penetration'],
    'ai-engineer': ['ai', 'machine learning', 'ml', 'llm', 'tensorflow', 'pytorch', 'deep learning', 'nlp', 'generative'],
    'software-development': ['software', 'engineer', 'developer', 'backend', 'full-stack', 'full stack', 'java', 'c++', 'c#', '.net'],
    'web-development': ['web', 'frontend', 'react', 'frontend', 'javascript', 'html', 'css', 'next.js', 'vue'],
    'ui-ux-design': ['ux', 'ui', 'design', 'figma', 'product designer', 'user experience', 'interface', 'prototyping'],
    'data-analysis': ['data', 'analyst', 'sql', 'tableau', 'power bi', 'pandas', 'visualization', 'statistics', 'business intelligence'],
    'cloud-devops': ['cloud', 'devops', 'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'terraform', 'ci/cd', 'sre'],
  };

  for (const [spec, kws] of Object.entries(keywords)) {
    for (const kw of kws) {
      if (text.includes(kw)) scores[spec as Specialization] += 1;
    }
  }

  let best: Specialization = 'software-development';
  let bestScore = -1;
  for (const [spec, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = spec as Specialization;
    }
  }
  return bestScore === 0 ? 'software-development' : best;
}

function demoDesignChange(current: DesignConfig, instruction: string, spec: Specialization): DesignChange {
  const lower = instruction.toLowerCase();
  const config: Partial<DesignConfig> = {};

  if (lower.includes('cybersecurity') || lower.includes('soc dashboard') || lower.includes('terminal')) {
    config.colors = DEFAULT_COLORS.cybersecurity;
    config.background = { type: 'network', color: '#0ea5e9', opacity: 0.15, animated: true };
    config.animations = { enabled: true, fadeIn: true, hoverLift: true, scanLines: true };
    config.sectionOrder = SPECIALIZATIONS.cybersecurity.sections;
    return {
      type: 'fullRedesign',
      description: 'Redesigned as a cybersecurity SOC-dashboard style portfolio.',
      config,
    };
  }

  if (lower.includes('color') || lower.includes('palette') || lower.includes('theme')) {
    config.colors = { ...current.colors, primary: current.colors.primary === '#22d3ee' ? '#3b82f6' : '#22d3ee' };
    return { type: 'colors', description: 'Updated accent color palette.', config };
  }

  if (lower.includes('layout')) {
    config.layout = { ...current.layout, type: current.layout.type === 'single' ? 'sidebar' : 'single' };
    return { type: 'layout', description: 'Changed page layout structure.', config };
  }

  if (lower.includes('animation')) {
    config.animations = { ...current.animations, scanLines: !current.animations.scanLines };
    return { type: 'animations', description: 'Toggled scanning animations.', config };
  }

  return {
    type: 'fullRedesign',
    description: 'Applied your requested design adjustments.',
    config: { name: `${SPECIALIZATIONS[spec].name} Portfolio (updated)` },
  };
}

function demoChatReply(instruction: string, spec: Specialization): string {
  const lower = instruction.toLowerCase();
  if (lower.includes('cybersecurity') || lower.includes('soc')) {
    return "I've redesigned your portfolio as a premium cybersecurity SOC dashboard with a dark navy theme, electric blue accents, terminal-inspired hero, and network background. The layout now highlights security skills, SOC projects, labs, certifications, and incident response sections.";
  }
  if (lower.includes('ai') || lower.includes('ml')) {
    return "Your portfolio now has a futuristic AI-engineer aesthetic with model showcases, research sections, and dataset visualization cards. Deep purple and violet accents complete the look.";
  }
  if (lower.includes('developer') || lower.includes('software')) {
    return "I switched to a clean software-development design with modern typography, GitHub integration, interactive project cards, and code-inspired visual elements.";
  }
  if (lower.includes('animation') || lower.includes('animate')) {
    return "Added subtle fade-in and hover-lift animations throughout, plus a restrained scanning effect in the hero for a polished, professional feel.";
  }
  if (lower.includes('layout')) {
    return "Restructured the page layout while keeping all your information intact. Sections have been reordered for better recruiter impact.";
  }
  return "I've applied your design adjustments to the live preview. You can keep iterating, or undo/redo changes using the design controls.";
}
