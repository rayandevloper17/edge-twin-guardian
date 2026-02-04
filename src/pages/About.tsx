import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Building2, Network, Brain, Cpu, RefreshCw, ExternalLink, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function About() {
  const navigate = useNavigate();

  // Use neutral theme on About page
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="absolute inset-0 grid-overlay opacity-20" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-foreground">About</h1>
            <p className="text-sm text-muted-foreground">Network Edge Digital  Twin for IoT Attack Detection</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 relative z-10 max-w-4xl">
        {/* Introduction */}
        <section className="mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            This website provides a technical demonstration of the U.S.-registered patent entitled{' '}
            <span className="text-foreground font-semibold">"Network Edge Digital  Twin for IoT Attack Detection"</span>{' '}
            (Patent Grant Number: <span className="text-primary font-mono">US 12301597 B1</span>).
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The platform illustrates how a network-edge Digital  twin architecture can be deployed within IoT
            environments to enable real-time cyberattack detection and analysis while preserving the functional
            integrity and performance of the physical IoT network. By offloading monitoring and security analytics
            to dynamically instantiated Digital  twins at the network edge, the proposed approach minimizes latency,
            reduces operational overhead, and avoids interference with mission-critical IoT services.
          </p>
        </section>

        {/* Use Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Use Cases</h2>
          <p className="text-muted-foreground mb-6">The website demonstrates two primary application scenarios:</p>

          <div className="space-y-6">
            {/* Military Use Case */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Military and Critical National Infrastructure Protection
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                In defense-oriented IoT deployments, the proposed Digital  twin framework supports the protection
                of critical national infrastructure by enabling early detection of cyber threats targeting
                distributed sensors, communication nodes, and edge devices. The isolation of security analysis
                within Digital  twins allows continuous monitoring without exposing operational systems to
                additional risk, making the approach suitable for high-assurance and mission-critical environments.
              </p>
            </div>

            {/* Smart Cities Use Case */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Smart Cities as Vision 2030 Initiatives
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                As Saudi Vision 2030 progressively advances the implementation of smart cities, large-scale IoT
                infrastructures play a central role in transportation, energy management, public safety, and urban
                services. The proposed solution addresses the growing need to secure smart city IoT ecosystems by
                providing scalable, edge-based attack detection that adapts to evolving urban deployments while
                maintaining service availability and resilience.
              </p>
            </div>
          </div>
        </section>

        {/* System Capabilities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">System Capabilities</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The website allows users to interact with a live physical IoT network and dynamically instantiate
            Digital  twins on demand. These Digital  twins replicate network behavior and traffic patterns,
            enabling continuous monitoring, anomaly detection, and cybersecurity evaluation without disrupting
            real-world IoT operations.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-card border border-border">
              <Network className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-medium text-foreground mb-2">Network Discovery</h4>
              <p className="text-sm text-muted-foreground">
                Identify and map physical devices across the network with real-time visibility
              </p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <Cpu className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-medium text-foreground mb-2">Digital  Twin Creation</h4>
              <p className="text-sm text-muted-foreground">
                Create and manage virtual representations of physical assets with model baselines
              </p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <RefreshCw className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-medium text-foreground mb-2">Synchronization & Monitoring</h4>
              <p className="text-sm text-muted-foreground">
                Connect, synchronize, and monitor devices for anomalies and cyber attacks
              </p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <Brain className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-medium text-foreground mb-2">System Intelligence</h4>
              <p className="text-sm text-muted-foreground">
                Analyze system behavior, AI-driven insights, and comprehensive event logs
              </p>
            </div>
          </div>
        </section>

        {/* Inventors */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Inventors</h2>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-card border border-border">
              <h4 className="font-semibold text-foreground mb-2">Malak Alhazmi</h4>
              <a
                href="mailto:malakalhazmi@gmail.com"
                className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
              >
                <Mail className="w-4 h-4" />
                malakalhazmi@gmail.com
              </a>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border">
              <h4 className="font-semibold text-foreground mb-2">Dr. Fatimah Alakeel</h4>
              <a
                href="mailto:fyalakeel@ksu.edu.sa"
                className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
              >
                <Mail className="w-4 h-4" />
                fyalakeel@ksu.edu.sa
              </a>
            </div>
          </div>
        </section>

        {/* Affiliation */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Affiliation</h2>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
            <p className="text-xl font-semibold text-foreground mb-2">King Saud University</p>
            <p className="text-muted-foreground mb-4">Riyadh, Saudi Arabia</p>
            <a
              href="https://ksu.edu.sa/en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              https://ksu.edu.sa/en
            </a>
          </div>
        </section>
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
