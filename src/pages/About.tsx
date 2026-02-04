import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Cpu, Network, Brain, Users, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function About() {
  const navigate = useNavigate();

  const capabilities = [
    {
      icon: Network,
      title: 'Network Discovery',
      description: 'Automated discovery and profiling of all IoT devices within the network perimeter',
    },
    {
      icon: Cpu,
      title: 'Digital Twin Creation',
      description: 'Dynamic creation of virtual replicas with physics-based and data-driven models',
    },
    {
      icon: Shield,
      title: 'Real-time Synchronization',
      description: 'Continuous mirroring between physical devices and their digital counterparts',
    },
    {
      icon: Brain,
      title: 'AI-Powered Detection',
      description: 'Machine learning algorithms for anomaly detection and threat classification',
    },
  ];

  const inventors = [
    'Dr. Abdullah Al-Malaise Al-Ghamdi',
    'Dr. Mahmoud Ahmad Al-Khasawneh',
    'Dr. Shailendra Mishra',
    'Dr. Surbhi Bhatia Khan',
  ];

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
            <p className="text-sm text-muted-foreground">System Documentation</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 relative z-10 max-w-4xl">
        {/* Patent Info */}
        <section className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-mono text-primary">US Patent</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Network Edge Digital Twin for IoT Attack Detection
          </h2>
          <p className="text-xl text-primary font-mono">
            Patent Grant Number: US 12301597 B1
          </p>
        </section>

        {/* Purpose */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            System Purpose
          </h3>
          <div className="p-6 rounded-xl bg-card border border-border">
            <p className="text-muted-foreground leading-relaxed">
              This patented system provides a comprehensive cybersecurity framework for protecting 
              IoT networks through the innovative use of Digital Twin technology. By creating and 
              maintaining synchronized virtual replicas of physical IoT devices at the network edge, 
              the system enables real-time monitoring, anomaly detection, and automated threat response 
              without impacting the operation of actual devices.
            </p>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-4">Target Applications</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-foreground">Military & Critical Infrastructure</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Defense installations, power grids, water systems, and national security networks 
                requiring the highest levels of protection.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Network className="w-5 h-5 text-accent" />
                </div>
                <h4 className="font-medium text-foreground">Smart Cities</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Urban IoT deployments including traffic management, environmental monitoring, 
                public safety systems, and utility networks.
              </p>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-4">System Capabilities</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {capabilities.map((cap, i) => (
              <div key={i} className="p-5 rounded-xl bg-card border border-border">
                <cap.icon className="w-8 h-8 text-primary mb-3" />
                <h4 className="font-medium text-foreground mb-2">{cap.title}</h4>
                <p className="text-sm text-muted-foreground">{cap.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Inventors */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Inventors
          </h3>
          <div className="p-6 rounded-xl bg-card border border-border">
            <ul className="space-y-2">
              {inventors.map((name, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-medium">
                    {i + 1}
                  </span>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Affiliation */}
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Affiliation
          </h3>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
            <p className="text-lg font-medium text-foreground">King Saud University</p>
            <p className="text-muted-foreground">Riyadh, Kingdom of Saudi Arabia</p>
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
