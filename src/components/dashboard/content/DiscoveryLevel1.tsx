import { useDashboard } from '@/context/DashboardContext';
import { getTheme } from '@/config/themes';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import {
  Wifi,
  Radio,
  Camera,
  Server,
  AlertCircle,
  CheckCircle2,
  Network,
  Loader2,
} from 'lucide-react';

export default function DiscoveryLevel1() {
  const { state } = useDashboard();
  const { devices, scanningComplete, discoveredDeviceIds } = state;
  const theme = getTheme(state.useCase);

  const discoveredDevices = devices.filter(d => discoveredDeviceIds.includes(d.id));
  const scanProgress = devices.length > 0 ? (discoveredDeviceIds.length / devices.length) * 100 : 0;

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

      {/* Scanning Progress */}
      {!scanningComplete && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-sm font-semibold text-primary">Scanning Network...</span>
          </div>
          <Progress value={scanProgress} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{discoveredDeviceIds.length} devices found</span>
            <span>{Math.round(scanProgress)}%</span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase font-medium">Discovered Devices</span>
          </div>
          <span className="text-3xl font-bold text-foreground">
            {scanningComplete ? devices.length : discoveredDeviceIds.length}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground uppercase font-medium">Security Status</span>
          </div>
          <span className="text-lg font-bold text-success">All Benign</span>
        </div>
      </div>

      {/* Discovered Devices List */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {scanningComplete ? 'All Devices' : 'Discovered So Far'}
        </h4>
        <div className="space-y-2">
          {discoveredDevices.map(device => {
            const Icon = getDeviceIcon(device.deviceType);
            return (
              <div
                key={device.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                style={{ animation: 'nodeAppear 0.5s ease-out' }}
              >
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-foreground font-medium block">{device.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{device.ipAddress}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-success/20 text-success uppercase">
                  Benign
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vendors */}
      {scanningComplete && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Vendors Detected
          </h4>
          <div className="flex flex-wrap gap-2">
            {[...new Set(devices.map(d => d.manufacturer))].map(vendor => (
              <span
                key={vendor}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {vendor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Selection Info */}
      {scanningComplete && !state.twinCreationComplete && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Ready for Digital Twinning</p>
              <p className="text-xs text-muted-foreground">
                {state.selectedForTwinning.length} of {devices.length} devices selected.
                Click devices in the network graph to toggle selection, then create digital twins.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instruction */}
      {!scanningComplete && (
        <div className="text-center pt-4 border-t border-border/50">
          <p className="text-sm text-primary font-medium">Network scan in progress</p>
          <p className="text-xs text-muted-foreground mt-1">Devices will appear as they are discovered</p>
        </div>
      )}
    </div>
  );
}
