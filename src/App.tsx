import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { usePortfolio } from './context/PortfolioContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { Button } from './components/ui/Button';
import { AlertCircle, ArrowRight, Shield } from 'lucide-react';
import Landing from './pages/Landing';
import Import from './pages/Import';
import Review from './pages/Review';
import Specialization from './pages/Specialization';
import Design from './pages/Design';
import Assistant from './pages/Assistant';
import Preview from './pages/Preview';
import Export from './pages/Export';

const STEPS: Array<{ id: string; label: string }> = [
  { id: 'landing', label: 'Start' },
  { id: 'import', label: 'Import Profile' },
  { id: 'review', label: 'Review Info' },
  { id: 'specialization', label: 'Specialization' },
  { id: 'design', label: 'Generate Design' },
  { id: 'assistant', label: 'AI Assistant' },
  { id: 'preview', label: 'Preview' },
  { id: 'export', label: 'Export' },
];

function AppLayout({ children }: { children: React.ReactNode }) {
  const { step, error, isLoading } = usePortfolio();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 font-display font-bold text-xl tracking-tight ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <Shield className="h-6 w-6 text-primary" />
            <span>Portify<span className="text-muted-foreground">AI</span></span>
          </NavLink>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {STEPS.map((s) => {
              const active = step === s.id;
              return (
                <NavLink
                  key={s.id}
                  to={`/${s.id}`}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`
                  }
                >
                  {s.label}
                </NavLink>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/export')}
              className="hidden md:text-sm md:font-medium text-muted-foreground hover:text-foreground"
            >
              Export
            </button>
            <Button asChild variant="primary" size="sm">
              <a href="/" className="flex items-center gap-2">
                Start Over <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {isLoading && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Working...</p>
          </div>
        </div>
      )}

      <main className="flex-1 pt-20 pb-24 max-w-7xl mx-auto w-full px-4">
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}
        {children}
      </main>

      <footer className="border-t border-border/50 bg-background/80 backdrop-blur py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Portify AI &mdash; no account, no database. Your data stays in your browser.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PortfolioProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/import" element={<Import />} />
            <Route path="/review" element={<Review />} />
            <Route path="/specialization" element={<Specialization />} />
            <Route path="/design" element={<Design />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/export" element={<Export />} />
          </Routes>
        </AppLayout>
      </PortfolioProvider>
    </BrowserRouter>
  );
}

export default App;
