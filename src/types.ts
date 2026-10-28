export type Specialization =
  | 'cybersecurity'
  | 'ai-engineer'
  | 'software-development'
  | 'web-development'
  | 'ui-ux-design'
  | 'data-analysis'
  | 'cloud-devops';

export interface ProfileInfo {
  fullName: string;
  headline: string;
  summary: string;
  location?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  publicLinks: PublicLink[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  source: 'linkedin' | 'manual' | 'document' | 'demo';
  extractedAt?: string;
  notes?: string;
}

export interface PublicLink {
  id: string;
  label: string;
  url: string;
  type: 'github' | 'linkedin' | 'portfolio' | 'website' | 'other';
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  honors?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: number; // 1-5
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  credentialId?: string;
  url?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  image?: string;
  featured: boolean;
}

export interface AIAnalysis {
  specialization: Specialization;
  targetRole: string;
  professionalSummary: string;
  keySkills: string[];
  experienceSummary: string;
  achievements: string[];
  certifications: string[];
  educationSummary: string;
  brandingOpportunities: string[];
}

export interface DesignConfig {
  id: string;
  name: string;
  specialization: Specialization;
  layout: LayoutConfig;
  typography: TypographyConfig;
  colors: ColorConfig;
  components: ComponentConfig[];
  background: BackgroundConfig;
  animations: AnimationConfig;
  sectionOrder: string[];
  version: number;
}

export interface LayoutConfig {
  type: 'single' | 'sidebar' | 'split';
  navStyle: 'top' | 'side' | 'floating';
  containerWidth: 'narrow' | 'wide' | 'full';
}

export interface TypographyConfig {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  headingScale: number;
  bodyScale: number;
}

export interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
}

export interface ComponentConfig {
  id: string;
  type: string;
  props: Record<string, unknown>;
  enabled: boolean;
}

export interface BackgroundConfig {
  type: 'none' | 'gradient' | 'grid' | 'network' | 'terminal';
  color: string;
  opacity: number;
  animated: boolean;
}

export interface AnimationConfig {
  enabled: boolean;
  fadeIn: boolean;
  hoverLift: boolean;
  scanLines: boolean;
}

export interface PortfolioState {
  step: 'landing' | 'import' | 'review' | 'specialization' | 'design' | 'assistant' | 'preview' | 'export';
  profile: ProfileInfo | null;
  analysis: AIAnalysis | null;
  design: DesignConfig | null;
  previewDesign: DesignConfig | null;
  history: DesignConfig[];
  historyIndex: number;
  isLoading: boolean;
  error: string | null;
  demoMode: boolean;
  apiKey: string | null;
  drafts: PortfolioDraft[];
}

export interface PortfolioDraft {
  id: string;
  name: string;
  updatedAt: string;
  profile: ProfileInfo;
  design: DesignConfig;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  designChange?: DesignChange;
}

export interface DesignChange {
  type: 'colors' | 'layout' | 'typography' | 'components' | 'background' | 'animations' | 'sectionOrder' | 'fullRedesign';
  description: string;
  config: Partial<DesignConfig>;
}

export interface ExportOptions {
  includeAssets: boolean;
  minify: boolean;
  includeReadme: boolean;
}
