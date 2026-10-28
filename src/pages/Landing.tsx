import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Sparkles,
  Link,
  Rocket,
  Layers,
  Code2,
  Download,
  Shield,
  Mail,
  Globe,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-Powered Design',
    body: 'A unique layout generated for your profession &mdash; not a generic template.',
  },
  {
    icon: Link,
    title: 'LinkedIn Import',
    body: 'Pull your public profile info, then review and correct it before generating.',
  },
  {
    icon: Download,
    title: 'Export &amp; Host',
    body: 'Download a complete static website ZIP. No account, no database required.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    body: 'Drafts stay in your browser via localStorage. Nothing is uploaded to a cloud database.',
  },
];

const SPECIALIZATIONS = [
  { id: 'cybersecurity', name: 'Cybersecurity', desc: 'SOC, threat detection, incident response', icon: Shield },
  { id: 'ai-engineer', name: 'AI Engineer', desc: 'Machine learning, LLMs, model deployment', icon: Rocket },
  { id: 'software-development', name: 'Software Development', desc: 'Full-stack engineering', icon: Code2 },
  { id: 'web-development', name: 'Web Development', desc: 'Modern web experiences', icon: Globe },
  { id: 'ui-ux-design', name: 'UI/UX Design', desc: 'User-centered interfaces', icon: Layers },
  { id: 'data-analysis', name: 'Data Analysis', desc: 'Insights from data', icon: Mail },
  { id: 'cloud-devops', name: 'Cloud &amp; DevOps', desc: 'Infrastructure &amp; reliability', icon: Download },
];

const HOW_IT_WORKS = [
  { n: '01', title: 'Enter your LinkedIn URL', body: 'Paste your public profile link to begin.' },
  { n: '02', title: 'Review &amp; correct', body: 'AI normalizes your info; you fix anything missing.' },
  { n: '03', title: 'Pick your specialization', body: 'Choose the field that matches your career.' },
  { n: '04', title: 'AI generates your design', body: 'A profession-specific layout is created for you.' },
  { n: '05', title: 'Refine with AI chat', body: 'Ask the assistant to redesign or tweak your site.' },
  { n: '06', title: 'Preview &amp; download', body: 'Export a static website ZIP to host anywhere.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { setDemoMode, setApiKey, demoMode } = usePortfolio();
  const [apiKey, setApiKeyInput] = useState('');

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px]"></div>
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px]"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-primary">
            <Shield className="h-6 w-6" />
            <span>Portify<span className="text-muted-foreground">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLinkText href="#how-it-works">How it works</NavLinkText>
            <NavLinkText href="#specializations">Specializations</NavLinkText>
            <NavLinkText href="#features">Features</NavLinkText>
            <NavLinkText href="#faq">FAQ</NavLinkText>
          </div>
          <div className="flex items-center gap-3">
            <ButtonOutline>Log in</ButtonOutline>
            <ButtonPrimary>Generate My Portfolio</ButtonPrimary>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            whileIn={{ y: [20, 0], opacity: [0, 1] }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-display font-bold text-foreground tracking-tight leading-[1.1] mb-6 text-balance"
          >
            Your LinkedIn Profile.<br />
            <span className="text-primary">Reimagined by AI.</span>
          </motion.h1>
          <motion.p
            whileIn={{ y: [20, 0], opacity: [0, 1] }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Transform your professional profile into a stunning, personalized portfolio. Let AI
            understand your career and create a website designed around your expertise.
          </motion.p>

          <motion.div
            whileIn={{ y: [20, 0], opacity: [0, 1] }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <ButtonPrimaryLarge onClick={() => navigate('/import')}>
              Generate My Portfolio <ArrowRight className="ml-2 h-5 w-5" />
            </ButtonPrimaryLarge>
            <ButtonOutlineLarge onClick={() => navigate('/#specializations')}>
              Explore Designs <ChevronRight className="ml-2 h-5 w-5" />
            </ButtonOutlineLarge>
          </motion.div>

          {/* API key / demo mode banner */}
          <div className="mt-10 flex flex-col items-center gap-3 text-xs text-muted-foreground">
            <BadgeDemo>
              {demoMode ? 'Demo mode active' : 'Live AI mode'}
            </BadgeDemo>
            <div className="flex items-center gap-2 text-sm">
              <label className="font-medium">LLM API key (optional):</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-48 h-9 rounded-md border border-input bg-input px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="sk-..."
              />
              <ButtonSmall
                onClick={() => {
                  setApiKey(apiKey || null);
                  setDemoMode(!apiKey);
                }}
              >
                Apply
              </ButtonSmall>
            </div>
            <p className="text-[10px] leading-tight max-w-xs mx-auto text-center">
              Your key is held in session memory only &mdash; never saved to localStorage or sent
              anywhere except the LLM provider you choose.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">How it works</h2>
            <p className="text-muted-foreground">From LinkedIn to a live portfolio in minutes.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.n} className="p-6 rounded-xl border border-border/50 bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {s.n}
                  </div>
                  <h3 className="font-semibold text-foreground">{s.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section id="specializations" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Built for your profession</h2>
            <p className="text-muted-foreground">Distinct design systems &mdash; never the same template twice.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SPECIALIZATIONS.map((s) => (
              <Card key={s.id} onClick={() => navigate(`/specialization?spec=${s.id}`)}>
                <div className="p-6 rounded-xl border border-border/50 bg-card flex flex-col gap-3">
                  <s.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{s.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Everything you need</h2>
            <p className="text-muted-foreground">No database. No account. Just your portfolio.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-6 rounded-xl border border-border/50 bg-card">
                <f.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Questions?</h2>
            <p className="text-muted-foreground">Everything you wanted to know.</p>
          </div>
          <div className="space-y-4">
            {[
              ['Do I need an account?', 'No. Portify AI works without creating an account. Everything runs in your browser.'],
              ['Is there a database?', 'No. Drafts are saved to your browser&rsquo;s localStorage. Nothing is stored in a shared cloud database.'],
              ['Can I export my site?', 'Yes. Download a complete static website ZIP (HTML/CSS/JS) or a JSON config file to import later.'],
              ['What if LinkedIn blocks access?', 'You can upload an exported PDF/resume, paste your info manually, or import from a document.'],
              ['Is my API key safe?', 'Yes. API keys live only in session memory and are never written to localStorage.'],
            ].map(([q, a]) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-12 text-center">
        <p className="text-xs text-muted-foreground">
          Portify AI &middot; AI-powered portfolio generator &middot; No account &middot; No database
        </p>
      </footer>
    </div>
  );
}

function NavLinkText({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-muted-foreground hover:text-foreground transition-colors">
      {children}
    </a>
  );
}

function ButtonOutline({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-4 py-2 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent">
      {children}
    </button>
  );
}

function ButtonPrimary({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
      {children}
    </button>
  );
}

function ButtonPrimaryLarge({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
    >
      {children}
    </button>
  );
}

function ButtonOutlineLarge({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3.5 rounded-xl border border-input bg-background text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2"
    >
      {children}
    </button>
  );
}

function ButtonSmall({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-md border border-input bg-background text-xs font-medium hover:bg-accent transition-colors"
    >
      {children}
    </button>
  );
}

function BadgeDemo({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full border border-input bg-card text-xs text-muted-foreground">
      {children}
    </span>
  );
}

function Card({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="cursor-pointer transition-colors hover:bg-accent/30"
    >
      {children}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left text-foreground font-medium"
      >
        {q}
        <ChevronRight className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 text-sm text-muted-foreground"
          >
            {a}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
