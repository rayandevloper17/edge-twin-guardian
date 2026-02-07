import { useRef, useEffect } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import UseCaseSection from '@/components/landing/UseCaseSection';
import AboutSection from '@/components/landing/AboutSection';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Home() {
  const useCaseRef = useRef<HTMLElement>(null);

  // Remove theme when on landing page for neutral colors
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
  }, []);

  const scrollToUseCases = () => {
    useCaseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeroSection onScrollToUseCases={scrollToUseCases} />
      <UseCaseSection ref={useCaseRef} />
      <AboutSection />
      <LandingFooter />
    </div>
  );
}
