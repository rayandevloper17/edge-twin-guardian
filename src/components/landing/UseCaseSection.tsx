import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, ChevronRight } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { UseCase } from '@/types/dashboard';

const UseCaseSection = forwardRef<HTMLElement>((_, ref) => {
  const navigate = useNavigate();
  const { setUseCase } = useDashboard();

  const handleUseCaseSelect = (useCase: UseCase) => {
    setUseCase(useCase);
    document.documentElement.setAttribute('data-theme', useCase);
    navigate('/dashboard');
  };

  return (
    <section ref={ref} className="relative py-24 px-4">
      {/* Section header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">
          Select Your Scenario
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Choose a Use Case
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          The system adapts its visual identity, device terminology, and network topology
          based on the operational context you select.
        </p>
      </div>

      {/* Use case cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Military Card */}
        <button
          onClick={() => handleUseCaseSelect('military')}
          className="group relative rounded-2xl text-left overflow-hidden transition-all duration-500 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
        >
          {/* Card background */}
          <div className="absolute inset-0 bg-card border border-border rounded-2xl transition-all duration-500 group-hover:border-[hsl(142,71%,45%)]/50 group-hover:bg-[hsl(120,10%,5%)]" />

          {/* Theme preview gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(142,71%,45%)]/0 via-transparent to-[hsl(142,71%,45%)]/0 group-hover:from-[hsl(142,71%,45%)]/10 group-hover:to-[hsl(142,71%,45%)]/5 transition-all duration-500 rounded-2xl" />

          {/* Glowing orb */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl transition-all duration-500 group-hover:bg-[hsl(142,71%,45%)]/20 group-hover:w-48 group-hover:h-48" />

          {/* Scan line effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-2xl">
            <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(142,71%,45%)]/50 to-transparent animate-scan-line" />
          </div>

          <div className="relative z-10 p-8 md:p-10">
            {/* Icon */}
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-[hsl(142,71%,45%)]/20 transition-colors duration-500 rounded-lg rotate-45" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary group-hover:text-[hsl(142,71%,45%)] transition-colors duration-500" />
              </div>
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_30px_hsl(142,71%,45%,0.4)]" />
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-[hsl(142,71%,45%)] transition-colors duration-500">
              Military & Critical National Infrastructure
            </h3>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Defense installations, power grids, water systems, and national security networks.
              Tactical-grade monitoring with high-assurance threat detection.
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
          className="group relative rounded-2xl text-left overflow-hidden transition-all duration-500 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background"
        >
          {/* Card background */}
          <div className="absolute inset-0 bg-card border border-border rounded-2xl transition-all duration-500 group-hover:border-[hsl(199,89%,48%)]/50 group-hover:bg-[hsl(220,50%,6%)]" />

          {/* Theme preview gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(199,89%,48%)]/0 via-transparent to-[hsl(199,89%,48%)]/0 group-hover:from-[hsl(199,89%,48%)]/10 group-hover:to-[hsl(199,89%,48%)]/5 transition-all duration-500 rounded-2xl" />

          {/* Glowing orb */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl transition-all duration-500 group-hover:bg-[hsl(199,89%,48%)]/20 group-hover:w-48 group-hover:h-48" />

          {/* Data stream effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-2xl">
            <div className="absolute inset-y-0 w-[1px] left-8 bg-gradient-to-b from-transparent via-[hsl(199,89%,48%)]/30 to-transparent" />
            <div className="absolute inset-y-0 w-[1px] right-8 bg-gradient-to-b from-transparent via-[hsl(199,89%,48%)]/20 to-transparent" />
          </div>

          <div className="relative z-10 p-8 md:p-10">
            {/* Icon */}
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 bg-accent/10 group-hover:bg-[hsl(199,89%,48%)]/20 transition-colors duration-500 rounded-full" />
              <div className="absolute inset-1 border border-accent/20 group-hover:border-[hsl(199,89%,48%)]/30 rounded-full transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-accent group-hover:text-[hsl(199,89%,48%)] transition-colors duration-500" />
              </div>
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_30px_hsl(199,89%,48%,0.4)]" />
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-[hsl(199,89%,48%)] transition-colors duration-500">
              Smart Cities — Vision 2030
            </h3>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Urban IoT networks, traffic systems, environmental monitoring, and public safety.
              Scalable edge-based detection for evolving urban deployments.
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
    </section>
  );
});

UseCaseSection.displayName = 'UseCaseSection';

export default UseCaseSection;
