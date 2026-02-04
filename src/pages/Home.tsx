import { useNavigate } from 'react-router-dom';
import { Shield, Building2, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';

export default function Home() {
  const navigate = useNavigate();
  const { setUseCase } = useDashboard();

  const handleUseCaseSelect = (useCase: 'military' | 'smart-cities') => {
    setUseCase(useCase);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background grid effect */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        {/* Glowing orb effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        {/* Title section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Network Edge Digital Twin
          </h1>
          <h2 className="text-2xl md:text-3xl font-light text-primary text-glow">
            for IoT Attack Detection
          </h2>
        </div>

        {/* Use Case Label */}
        <div className="mb-8">
          <p className="text-lg text-muted-foreground font-medium">Select Use Case</p>
        </div>

        {/* Use case selection */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full mb-12">
          {/* Military Card */}
          <button
            onClick={() => handleUseCaseSelect('military')}
            className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/20 transition-colors" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:glow-primary transition-all">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Military and Critical National Infrastructure
              </h3>
              <p className="text-muted-foreground mb-4">
                Defense installations, power grids, water systems, and national security networks
              </p>
              
              <div className="flex items-center text-primary font-medium">
                <span>Enter Dashboard</span>
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Smart Cities Card */}
          <button
            onClick={() => handleUseCaseSelect('smart-cities')}
            className="group relative p-8 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 group-hover:bg-accent/20 transition-colors" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all">
                <Building2 className="w-7 h-7 text-accent" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Smart Cities
              </h3>
              <p className="text-muted-foreground mb-4">
                Urban IoT networks, traffic systems, environmental monitoring, and public safety
              </p>
              
              <div className="flex items-center text-accent font-medium">
                <span>Enter Dashboard</span>
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        {/* About button */}
        <Button
          variant="outline"
          onClick={() => navigate('/about')}
          className="gap-2"
        >
          <Info className="w-4 h-4" />
          About
        </Button>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border relative z-10">
        <p className="text-sm text-muted-foreground">
          All rights reserved. © King Saud University, February 2026.
        </p>
      </footer>
    </div>
  );
}
