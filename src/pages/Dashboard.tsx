import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/context/DashboardContext';
import { useAutoProgression } from '@/hooks/useAutoProgression';
import LeftMenu from '@/components/dashboard/LeftMenu';
import NetworkGraph from '@/components/dashboard/NetworkGraph';
import DetailsPanel from '@/components/dashboard/DetailsPanel';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state } = useDashboard();

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
    const baseTitle = 'Network Edge Digital  Twin for IoT Attack Detection';
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
      {/* Left Menu - Navigation */}
      <LeftMenu />

      {/* Center - Network Visualization (Content Area based on selection) */}
      <NetworkGraph />

      {/* Right - Details Panel (Content Area 1 & 2) */}
      <DetailsPanel />
    </div>
  );
}
