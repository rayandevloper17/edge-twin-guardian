import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import { 
  Wifi, 
  Radio, 
  Camera, 
  Server, 
  AlertCircle,
  CheckCircle2,
  Network
} from 'lucide-react';

export default function DiscoveryLevel1() {
  const { state } = useDashboard();
  const { devices } = state;

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  const warningDevices = devices.filter(d => d.status === 'warning').length;
  const attackDevices = devices.filter(d => d.status === 'attack').length;

  const deviceTypes = devices.reduce((acc, device) => {
    acc[device.deviceType] = (acc[device.deviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const vendors = [...new Set(devices.map(d => d.manufacturer))];

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'radar': return Radio;
      case 'camera': return Camera;
      case 'sensor': return Wifi;
      case 'gateway': return Server;
      default: return Network;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Network Discovery</h3>
        <p className="text-sm text-muted-foreground">Real-time visibility into connected physical devices</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase font-medium">Discovered Devices</span>
          </div>
          <span className="text-3xl font-bold text-foreground">{devices.length}</span>
        </div>
        
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground uppercase font-medium">Active Connections</span>
          </div>
          <span className="text-3xl font-bold text-success">{onlineDevices}</span>
        </div>
      </div>

      {/* Status Overview */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Online / Offline Status
        </h4>
        <div className="space-y-2">
          <StatusRow label="Online" count={onlineDevices} total={devices.length} color="bg-success" />
          <StatusRow label="Warning" count={warningDevices} total={devices.length} color="bg-warning" />
          <StatusRow label="Under Attack" count={attackDevices} total={devices.length} color="bg-destructive" />
          <StatusRow label="Offline" count={offlineDevices} total={devices.length} color="bg-muted-foreground" />
        </div>
      </div>

      {/* Device Types */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Device Types
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(deviceTypes).map(([type, count]) => {
            const Icon = getDeviceIcon(type);
            return (
              <div 
                key={type} 
                className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground capitalize flex-1">{type}</span>
                <span className="text-sm font-bold text-foreground">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vendors */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Vendors Detected
        </h4>
        <div className="flex flex-wrap gap-2">
          {vendors.map(vendor => (
            <span 
              key={vendor} 
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              {vendor}
            </span>
          ))}
        </div>
      </div>

      {/* Network Topology Note */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Network Topology</p>
            <p className="text-xs text-muted-foreground">
              Logical view of device connectivity shown in the center panel. Click on any device to inspect details.
            </p>
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div className="text-center pt-4 border-t border-border/50">
        <p className="text-sm text-primary font-medium">Select a physical IoT device</p>
        <p className="text-xs text-muted-foreground mt-1">Click a device on the network graph to view specifications</p>
      </div>
    </div>
  );
}

function StatusRow({ 
  label, 
  count, 
  total, 
  color 
}: { 
  label: string; 
  count: number; 
  total: number; 
  color: string; 
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-24">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all', color)} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
      <span className="text-xs font-mono text-foreground w-8 text-right">{count}</span>
    </div>
  );
}
