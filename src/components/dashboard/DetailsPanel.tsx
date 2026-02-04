import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import { AlertTriangle, Activity, Shield, Clock } from 'lucide-react';
import PhysicalDeviceDetails from './details/PhysicalDeviceDetails';
import DigitalTwinDetails from './details/DigitalTwinDetails';
import SyncDetails from './details/SyncDetails';
import IntelligenceDetails from './details/IntelligenceDetails';
import { getTheme } from '@/config/themes';

// Global Attack Dashboard - Always visible when threats exist
function AttackDashboard() {
  const { state } = useDashboard();
  const { alerts, metrics, devices } = state;
  const theme = getTheme(state.useCase);
  
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved);
  const mediumAlerts = alerts.filter(a => a.severity === 'medium' && !a.resolved);
  const attackingDevices = devices.filter(d => d.status === 'attack');

  if (criticalAlerts.length === 0 && mediumAlerts.length === 0) {
    return null;
  }

  return (
    <div className="p-4 border-b border-destructive/30 bg-destructive/5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
        <span className="text-sm font-semibold text-destructive">
          {state.useCase === 'military' ? 'HOSTILE ACTIVITY DETECTED' : 'Active Alerts'}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-destructive/10 rounded-lg p-2 text-center">
          <span className="text-2xl font-bold text-destructive">{criticalAlerts.length}</span>
          <p className="text-[10px] text-destructive/80 uppercase">
            {state.useCase === 'military' ? 'Critical Threats' : 'Critical'}
          </p>
        </div>
        <div className="bg-warning/10 rounded-lg p-2 text-center">
          <span className="text-2xl font-bold text-warning">{mediumAlerts.length}</span>
          <p className="text-[10px] text-warning/80 uppercase">
            {state.useCase === 'military' ? 'Warnings' : 'Medium'}
          </p>
        </div>
      </div>

      {/* Affected Devices */}
      {attackingDevices.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">
            {state.useCase === 'military' ? 'Compromised Assets' : 'Affected Nodes'}
          </p>
          {attackingDevices.map(device => (
            <div key={device.id} className="flex items-center gap-2 text-xs bg-destructive/10 rounded px-2 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              <span className="text-foreground font-medium">{device.name}</span>
              <span className="text-muted-foreground font-mono ml-auto">{device.ipAddress}</span>
            </div>
          ))}
        </div>
      )}

      {/* Metrics */}
      <div className="mt-3 pt-3 border-t border-destructive/20 grid grid-cols-2 gap-2 text-[10px]">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-destructive" />
          <span className="text-muted-foreground">
            {state.useCase === 'military' ? 'Intrusions:' : 'Attempts:'}
          </span>
          <span className="text-foreground font-mono">{metrics.attackAttempts}</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-destructive" />
          <span className="text-muted-foreground">
            {state.useCase === 'military' ? 'Hostile Traffic:' : 'Bad Traffic:'}
          </span>
          <span className="text-foreground font-mono">{metrics.maliciousTraffic}MB</span>
        </div>
      </div>
    </div>
  );
}

// Stage-specific header
function StageHeader({ stage }: { stage: string }) {
  const stageInfo: Record<string, { title: string; subtitle: string }> = {
    'network-discovery': {
      title: 'Physical Device Details',
      subtitle: 'Select a device to inspect',
    },
    'digital-twin-creation': {
      title: 'Digital Twin Details',
      subtitle: 'Twin model and baseline data',
    },
    'synchronization': {
      title: 'Sync & Security Status',
      subtitle: 'Real-time mirroring analysis',
    },
    'intelligence': {
      title: 'System Intelligence',
      subtitle: 'AI reasoning and forensics',
    },
  };

  const info = stageInfo[stage] || { title: 'Details', subtitle: '' };

  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">{info.title}</h3>
          <p className="text-[10px] text-muted-foreground">{info.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function DetailsPanel() {
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

  const renderContent = () => {
    switch (currentStage) {
      case 'network-discovery':
        return selectedDevice 
          ? <PhysicalDeviceDetails device={selectedDevice} />
          : <EmptyState message="Select a physical device from the network to view its specifications" />;
      
      case 'digital-twin-creation':
        if (!state.twinCreationComplete) {
          return <EmptyState message="Create digital twins to view model details and behavioral baselines" />;
        }
        return selectedTwin 
          ? <DigitalTwinDetails twin={selectedTwin} device={devices.find(d => d.id === selectedTwin.physicalDeviceId)!} />
          : <EmptyState message="Select a digital twin to view its model configuration" />;
      
      case 'synchronization':
        if (selectedDevice || selectedTwin) {
          const device = selectedDevice || devices.find(d => d.id === selectedTwin?.physicalDeviceId);
          const twin = selectedTwin || twins.find(t => t.physicalDeviceId === selectedDevice?.id);
          if (device && twin) {
            return <SyncDetails device={device} twin={twin} />;
          }
        }
        return <EmptyState message="Select a device or twin to view synchronization health and threat status" />;
      
      case 'intelligence':
        return <IntelligenceDetails />;
      
      default:
        return <EmptyState message="Select a stage from the system controller" />;
    }
  };

  return (
    <aside className="w-80 bg-card border-l border-border flex flex-col h-full overflow-hidden">
      {/* Global Attack Dashboard */}
      <AttackDashboard />
      
      {/* Stage-specific header */}
      <StageHeader stage={currentStage} />
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </aside>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[200px]">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
          <Activity className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground max-w-[200px]">{message}</p>
      </div>
    </div>
  );
}
