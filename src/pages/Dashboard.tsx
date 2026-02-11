import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/context/DashboardContext';
import { useAutoProgression } from '@/hooks/useAutoProgression';
import { useNetworkScanning } from '@/hooks/useNetworkScanning';
import LeftMenu from '@/components/dashboard/LeftMenu';
import NetworkGraph from '@/components/dashboard/NetworkGraph';
import DetailsPanel from '@/components/dashboard/DetailsPanel';
import IntelligenceDialog from '@/components/dashboard/IntelligenceDialog';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state } = useDashboard();
  const [intelligenceOpen, setIntelligenceOpen] = useState(false);

  // Network scanning: reveals devices sequentially
  useNetworkScanning();

  // Autonomous progression: after twin creation, system auto-advances
  useAutoProgression();

  // Redirect to home if no use case selected, otherwise apply theme
  useEffect(() => {
    if (!state.useCase) {
      navigate('/');
    } else {
      document.documentElement.setAttribute('data-theme', state.useCase);
    }
  }, [state.useCase, navigate]);

  // Update page title based on use case
  useEffect(() => {
    const baseTitle = 'Network Edge Digital Twin for IoT Attack Detection';
    const useCaseTitle = state.useCase === 'military'
      ? 'Military and Critical National Infrastructure'
      : 'Smart Cities';

    document.title = state.useCase
      ? `${baseTitle} | ${useCaseTitle}`
      : baseTitle;
  }, [state.useCase]);

  if (!state.useCase) {
    return null;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <LeftMenu onOpenIntelligence={() => setIntelligenceOpen(true)} />
      <NetworkGraph />
      <DetailsPanel />
      <IntelligenceDialog open={intelligenceOpen} onOpenChange={setIntelligenceOpen} />
    </div>
  );
}
