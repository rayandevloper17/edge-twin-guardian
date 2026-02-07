import { Network, Cpu, RefreshCw, Brain } from 'lucide-react';

const capabilities = [
  {
    icon: Network,
    title: 'Network Discovery',
    description: 'Identify and map physical IoT devices across the network with real-time visibility and asset classification.',
  },
  {
    icon: Cpu,
    title: 'Digital Twin Creation',
    description: 'Create virtual replicas of physical assets at the network edge, establishing behavioral baselines for monitoring.',
  },
  {
    icon: RefreshCw,
    title: 'Synchronization & Monitoring',
    description: 'Continuously synchronize twins with their physical counterparts, detecting anomalies and cyber threats in real time.',
  },
  {
    icon: Brain,
    title: 'System Intelligence',
    description: 'AI-driven analysis of system behavior, root cause identification, and comprehensive forensic event logging.',
  },
];

export default function AboutSection() {
  return (
    <section className="relative py-24 px-4">
      {/* Subtle divider gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">
            About the System
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Patented Digital Twin Architecture
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            This platform demonstrates the U.S.-registered patent{' '}
            <span className="text-foreground font-medium">"Network Edge Digital Twin for IoT Attack Detection"</span>{' '}
            <span className="text-primary font-mono text-sm">(US 12301597 B1)</span>.
            By offloading security analytics to dynamically instantiated digital twins at the network edge,
            the system minimizes latency and avoids interference with mission-critical IoT services.
          </p>
        </div>

        {/* Capability cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="group p-6 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-all duration-300 hover:bg-card"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                <cap.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{cap.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
