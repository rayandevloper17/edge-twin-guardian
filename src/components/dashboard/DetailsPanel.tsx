import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import { AlertTriangle, Activity, Zap } from 'lucide-react';

// Level 1 Content Components
import DiscoveryLevel1 from './content/DiscoveryLevel1';
import TwinCreationLevel1 from './content/TwinCreationLevel1';
import SyncLevel1 from './content/SyncLevel1';
import IntelligenceLevel1 from './content/IntelligenceLevel1';

// Level 2 Content Components
import DiscoveryLevel2 from './content/DiscoveryLevel2';
import TwinCreationLevel2 from './content/TwinCreationLevel2';
import SyncLevel2 from './content/SyncLevel2';
import IntelligenceLevel2 from './content/IntelligenceLevel2';

// Global Attack Dashboard - Always visible when threats exist
function AttackDashboard() {
  const { state } = useDashboard();
  const { alerts, metrics, devices } = state;

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved);
  const mediumAlerts = alerts.filter(a => a.severity === 'medium' && !a.resolved);
  const attackingDevices = devices.filter(d => d.status === 'compromised');

  if (criticalAlerts.length === 0 && mediumAlerts.length === 0) {
    return null;
  }

  return (
    <div className="p-4 border-b border-destructive/20 bg-gradient-to-b from-destructive/10 to-transparent">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-destructive" />
        </div>
        <span className="text-sm font-bold text-destructive">
          Active Threats
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-center">
          <span className="text-2xl font-bold text-destructive">{criticalAlerts.length}</span>
          <p className="text-[10px] text-destructive/70 uppercase font-medium mt-0.5">Critical</p>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-center">
          <span className="text-2xl font-bold text-warning">{mediumAlerts.length}</span>
          <p className="text-[10px] text-warning/70 uppercase font-medium mt-0.5">Medium</p>
        </div>
      </div>

      {/* Affected Devices */}
      {attackingDevices.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">
            Affected Nodes
          </p>
          {attackingDevices.slice(0, 3).map(device => (
            <div key={device.id} className="flex items-center gap-2 text-xs bg-destructive/5 border border-destructive/10 rounded-lg px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-foreground font-medium flex-1">{device.name}</span>
              <span className="text-muted-foreground font-mono text-[10px]">{device.ipAddress}</span>
            </div>
          ))}
        </div>
      )}

      {/* Metrics */}
      <div className="mt-4 pt-3 border-t border-destructive/10 grid grid-cols-2 gap-3 text-[10px]">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-destructive" />
          <span className="text-muted-foreground">Attempts:</span>
          <span className="text-foreground font-mono font-medium">{metrics.attackAttempts}</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-destructive" />
          <span className="text-muted-foreground">Bad Traffic:</span>
          <span className="text-foreground font-mono font-medium">{metrics.maliciousTraffic}MB</span>
        </div>
      </div>
    </div>
  );
}

interface ContentAreaProps {
  level: 1 | 2;
}

// Content Area 1 - Level 1: High-level KPIs and summaries
function ContentArea1() {
  const { state } = useDashboard();
  const { currentStage } = state;

  switch (currentStage) {
    case 'network-discovery':
      return <DiscoveryLevel1 />;
    case 'Digital -twin-creation':
      return <TwinCreationLevel1 />;
    case 'synchronization':
      return <SyncLevel1 />;
    case 'intelligence':
      return <IntelligenceLevel1 />;
    default:
      return <EmptyState message="Select a stage from the system controller" />;
  }
}

// Content Area 2 - Level 2: Detailed views based on selection
function ContentArea2() {
  const { state } = useDashboard();
  const { currentStage, selectedDeviceId, selectedTwinId, devices, twins } = state;

  const selectedDevice = selectedDeviceId
    ? devices.find(d => d.id === selectedDeviceId)
    : null;

  const selectedTwin = selectedTwinId
    ? twins.find(t => t.id === selectedTwinId)
    : selectedDevice
      ? twins.find(t => t.physicalDeviceId === selectedDevice.id)
      : null;

  switch (currentStage) {
    case 'network-discovery':
      return selectedDevice
        ? <DiscoveryLevel2 device={selectedDevice} />
        : <EmptyState message="Select a physical device from the network to view its specifications" />;

    case 'Digital -twin-creation':
      if (!state.twinCreationComplete) {
        return <EmptyState message="Create Digital  twins to view model details and behavioral baselines" />;
      }
      if (selectedTwin) {
        const device = devices.find(d => d.id === selectedTwin.physicalDeviceId);
        return device ? <TwinCreationLevel2 twin={selectedTwin} device={device} /> : null;
      }
      return <EmptyState message="Select a Digital  twin to view its model configuration" />;

    case 'synchronization':
      if (selectedDevice || selectedTwin) {
        const device = selectedDevice || devices.find(d => d.id === selectedTwin?.physicalDeviceId);
        const twin = selectedTwin || twins.find(t => t.physicalDeviceId === selectedDevice?.id);
        if (device && twin) {
          return <SyncLevel2 device={device} twin={twin} />;
        }
      }
      return <EmptyState message="Select a device or twin to view synchronization health and threat status" />;

    case 'intelligence':
      return <IntelligenceLevel2 />;

    default:
      return <EmptyState message="Select a stage from the system controller" />;
  }
}

export default function DetailsPanel() {
  return (
    <div className="w-[600px] flex h-full overflow-hidden border-l border-border/50">
      {/* Content Area 1 - Level 1: KPIs */}
      <aside className="w-[300px] bg-card/30 backdrop-blur-sm border-r border-border/30 flex flex-col h-full overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 bg-muted/20">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Content Area 1 — Overview
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ContentArea1 />
        </div>
      </aside>

      {/* Content Area 2 - Level 2: Details */}
      <aside className="w-[300px] bg-card/50 backdrop-blur-sm flex flex-col h-full overflow-hidden">
        {/* Global Attack Dashboard */}
        <AttackDashboard />

        <div className="px-4 py-3 border-b border-border/50 bg-muted/20">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Content Area 2 — Details
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ContentArea2 />
        </div>
      </aside>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[200px]">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
          <Activity className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground max-w-[180px] leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
