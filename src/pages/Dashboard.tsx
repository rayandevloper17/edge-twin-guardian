import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/context/DashboardContext';
import LeftMenu from '@/components/dashboard/LeftMenu';
import NetworkGraph from '@/components/dashboard/NetworkGraph';
import DetailsPanel from '@/components/dashboard/DetailsPanel';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state } = useDashboard();

  // Redirect to home if no use case selected
  useEffect(() => {
    if (!state.useCase) {
      navigate('/');
    }
  }, [state.useCase, navigate]);

  if (!state.useCase) {
    return null;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Left Menu */}
      <LeftMenu />

      {/* Center - Network Visualization */}
      <NetworkGraph />

      {/* Right - Details Panel */}
      <DetailsPanel />
    </div>
  );
}
