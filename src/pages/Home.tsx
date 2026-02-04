import { useNavigate } from 'react-router-dom';
import { Shield, Building2, ChevronRight, Info, Cpu, Network, Radar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';
import { useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const { setUseCase } = useDashboard();

  // Remove theme when on home page for neutral colors
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
  }, []);

  const handleUseCaseSelect = (useCase: 'military' | 'smart-cities') => {
    setUseCase(useCase);
    document.documentElement.setAttribute('data-theme', useCase);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse delay-150" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-accent/40 rounded-full animate-pulse delay-300" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-accent/30 rounded-full animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse delay-700" />
      </div>

      {/* Gradient mesh background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        {/* Floating tech icons */}
        <div className="absolute inset-0 pointer-events-none">
          <Cpu className="absolute top-[15%] left-[10%] w-6 h-6 text-primary/10 animate-float" />
          <Network className="absolute top-[20%] right-[15%] w-8 h-8 text-accent/10 animate-float delay-500" />
          <Radar className="absolute bottom-[25%] left-[15%] w-7 h-7 text-primary/10 animate-float delay-1000" />
          <Zap className="absolute bottom-[20%] right-[10%] w-5 h-5 text-accent/10 animate-float delay-700" />
        </div>

        {/* Title section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Digital Twin Technology</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Network Edge Digital Twin
          </h1>
          <h2 className="text-2xl md:text-3xl font-light bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            for IoT Attack Detection
          </h2>
        </div>

        {/* Use Case Label */}
        <div className="mb-10">
          <p className="text-lg text-muted-foreground font-medium tracking-wide">Select Use Case</p>
        </div>

        {/* Use case selection - Enhanced cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full mb-16">
          {/* Military Card */}
          <button
            onClick={() => handleUseCaseSelect('military')}
            className="group relative rounded-2xl text-left overflow-hidden transition-all duration-500 hover:scale-[1.02]"
          >
            {/* Card background - transforms to green on hover */}
            <div className="absolute inset-0 bg-card border border-border rounded-2xl transition-all duration-500 group-hover:border-[hsl(142,71%,45%)]/50 group-hover:bg-[hsl(120,10%,5%)]" />
            
            {/* Military theme preview gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(142,71%,45%)]/0 via-[hsl(142,71%,45%)]/0 to-[hsl(142,71%,45%)]/0 group-hover:from-[hsl(142,71%,45%)]/10 group-hover:via-transparent group-hover:to-[hsl(142,71%,45%)]/5 transition-all duration-500 rounded-2xl" />
            
            {/* Glowing orb - green on hover */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl transition-all duration-500 group-hover:bg-[hsl(142,71%,45%)]/20 group-hover:w-48 group-hover:h-48" />
            
            {/* Scan line effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-2xl">
              <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(142,71%,45%)]/50 to-transparent animate-scan-line" />
            </div>
            
            {/* Corner accent */}
            <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-[hsl(142,71%,45%)]/0 group-hover:bg-[hsl(142,71%,45%)]/10 rotate-45 transition-all duration-500" />
            </div>

            <div className="relative z-10 p-8">
              {/* Icon container - hexagonal military style */}
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-[hsl(142,71%,45%)]/20 transition-colors duration-500 rounded-lg rotate-45" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary group-hover:text-[hsl(142,71%,45%)] transition-colors duration-500" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_30px_hsl(142,71%,45%,0.4)]" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-[hsl(142,71%,45%)] transition-colors duration-500">
                Military and Critical National Infrastructure
              </h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Defense installations, power grids, water systems, and national security networks
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 text-xs rounded-full bg-secondary/50 text-muted-foreground group-hover:bg-[hsl(142,71%,45%)]/10 group-hover:text-[hsl(142,71%,45%)] transition-all duration-500">
                  Tactical Defense
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-secondary/50 text-muted-foreground group-hover:bg-[hsl(142,71%,45%)]/10 group-hover:text-[hsl(142,71%,45%)] transition-all duration-500">
                  High Security
                </span>
              </div>
              
              <div className="flex items-center text-primary group-hover:text-[hsl(142,71%,45%)] font-medium transition-colors duration-500">
                <span>Enter Tactical Dashboard</span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </button>

          {/* Smart Cities Card */}
          <button
            onClick={() => handleUseCaseSelect('smart-cities')}
            className="group relative rounded-2xl text-left overflow-hidden transition-all duration-500 hover:scale-[1.02]"
          >
            {/* Card background - transforms to blue on hover */}
            <div className="absolute inset-0 bg-card border border-border rounded-2xl transition-all duration-500 group-hover:border-[hsl(199,89%,48%)]/50 group-hover:bg-[hsl(220,50%,6%)]" />
            
            {/* Smart City theme preview gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(199,89%,48%)]/0 via-[hsl(199,89%,48%)]/0 to-[hsl(199,89%,48%)]/0 group-hover:from-[hsl(199,89%,48%)]/10 group-hover:via-transparent group-hover:to-[hsl(199,89%,48%)]/5 transition-all duration-500 rounded-2xl" />
            
            {/* Glowing orb - cyan on hover */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl transition-all duration-500 group-hover:bg-[hsl(199,89%,48%)]/20 group-hover:w-48 group-hover:h-48" />
            
            {/* Data stream effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-2xl">
              <div className="absolute inset-y-0 w-[1px] left-8 bg-gradient-to-b from-transparent via-[hsl(199,89%,48%)]/30 to-transparent" />
              <div className="absolute inset-y-0 w-[1px] right-8 bg-gradient-to-b from-transparent via-[hsl(199,89%,48%)]/20 to-transparent" />
            </div>
            
            {/* Corner accent */}
            <div className="absolute bottom-0 right-0 w-32 h-32 overflow-hidden">
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[hsl(199,89%,48%)]/0 group-hover:bg-[hsl(199,89%,48%)]/10 rounded-full transition-all duration-500" />
            </div>

            <div className="relative z-10 p-8">
              {/* Icon container - circular urban style */}
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 bg-accent/10 group-hover:bg-[hsl(199,89%,48%)]/20 transition-colors duration-500 rounded-full" />
                <div className="absolute inset-1 border border-accent/20 group-hover:border-[hsl(199,89%,48%)]/30 rounded-full transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-accent group-hover:text-[hsl(199,89%,48%)] transition-colors duration-500" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_30px_hsl(199,89%,48%,0.4)]" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-[hsl(199,89%,48%)] transition-colors duration-500">
                Smart Cities
              </h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Urban IoT networks, traffic systems, environmental monitoring, and public safety
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 text-xs rounded-full bg-secondary/50 text-muted-foreground group-hover:bg-[hsl(199,89%,48%)]/10 group-hover:text-[hsl(199,89%,48%)] transition-all duration-500">
                  Urban Operations
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-secondary/50 text-muted-foreground group-hover:bg-[hsl(199,89%,48%)]/10 group-hover:text-[hsl(199,89%,48%)] transition-all duration-500">
                  Vision 2030
                </span>
              </div>
              
              <div className="flex items-center text-accent group-hover:text-[hsl(199,89%,48%)] font-medium transition-colors duration-500">
                <span>Enter Urban Dashboard</span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </button>
        </div>

        {/* About button */}
        <Button
          variant="outline"
          onClick={() => navigate('/about')}
          className="gap-2 bg-secondary/30 border-border hover:bg-secondary/50 transition-all duration-300"
        >
          <Info className="w-4 h-4" />
          About This Project
        </Button>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border/50 relative z-10 bg-background/50 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">
          All rights reserved. © King Saud University, February 2026.
        </p>
      </footer>
    </div>
  );
}
