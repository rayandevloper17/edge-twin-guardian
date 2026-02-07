import { Cpu, Network, Radar, Zap, Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onScrollToUseCases: () => void;
}

export default function HeroSection({ onScrollToUseCases }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse delay-150" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-accent/40 rounded-full animate-pulse delay-300" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-accent/30 rounded-full animate-pulse delay-500" />
        <div className="absolute top-1/2 left-[15%] w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-1/3 right-[15%] w-1 h-1 bg-accent/20 rounded-full animate-pulse delay-1000" />
      </div>

      {/* Gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[150px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating tech icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Cpu className="absolute top-[15%] left-[10%] w-6 h-6 text-primary/10 animate-float" />
        <Network className="absolute top-[20%] right-[15%] w-8 h-8 text-accent/10 animate-float delay-500" />
        <Radar className="absolute bottom-[30%] left-[12%] w-7 h-7 text-primary/10 animate-float delay-1000" />
        <Zap className="absolute bottom-[25%] right-[10%] w-5 h-5 text-accent/10 animate-float delay-700" />
        <Shield className="absolute top-[40%] right-[8%] w-6 h-6 text-primary/8 animate-float delay-300" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground tracking-wide">
            U.S. Patent US 12301597 B1
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight leading-tight">
          Network Edge Digital Twin
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            for IoT Attack Detection
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Real-time cyberattack detection using network-edge digital twins for IoT systems.
          A patented approach to securing critical infrastructure without disrupting operations.
        </p>

        {/* CTA */}
        <Button
          onClick={onScrollToUseCases}
          size="lg"
          className="gap-2 text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
        >
          Launch System
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </Button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/30 to-transparent" />
      </div>
    </section>
  );
}
