import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="relative py-12 px-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
      {/* Subtle divider gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        {/* About link */}
        <Button
          variant="outline"
          onClick={() => navigate('/about')}
          className="gap-2 bg-secondary/30 border-border hover:bg-secondary/50 transition-all duration-300"
        >
          <Info className="w-4 h-4" />
          About This Project
        </Button>

        {/* Affiliation */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            King Saud University — Riyadh, Saudi Arabia
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            All rights reserved. © King Saud University, February 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}
