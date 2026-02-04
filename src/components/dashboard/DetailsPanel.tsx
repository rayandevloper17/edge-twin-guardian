import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import { AlertTriangle, Activity, Shield, Zap, Radio, Camera, Wifi, Server } from 'lucide-react';
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
    <div className="p-4 border-b border-destructive/20 bg-gradient-to-b from-destructive/10 to-transparent">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-destructive" />
        </div>
        <span className="text-sm font-bold text-destructive">
          {state.useCase === 'military' ? 'Active Alerts' : 'Active Alerts'}
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
          {attackingDevices.map(device => (
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

// Stage-specific header
function StageHeader({ stage }: { stage: string }) {
  const { state } = useDashboard();
  const theme = getTheme(state.useCase);
  
  const stageInfo: Record<string, { title: string; subtitle: string; icon: React.ElementType }> = {
    'network-discovery': {
      title: 'Physical Device Details',
      subtitle: 'Select a device to inspect',
      icon: Radio,
    },
    'digital-twin-creation': {
      title: 'Digital Twin Details',
      subtitle: 'Twin model and baseline data',
      icon: Camera,
    },
    'synchronization': {
      title: 'Sync & Security Status',
      subtitle: 'Real-time mirroring analysis',
      icon: Activity,
    },
    'intelligence': {
      title: theme.terminology.intelligence,
      subtitle: theme.terminology.intelligenceDesc,
      icon: Shield,
    },
  };

  const info = stageInfo[stage] || { title: 'Details', subtitle: '', icon: Activity };
  const Icon = info.icon;

  return (
    <div className="p-4 border-b border-border/50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
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
    <aside className="w-72 bg-card/50 backdrop-blur-sm border-l border-border/50 flex flex-col h-full overflow-hidden">
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
        <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
          <Activity className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground max-w-[180px] leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
