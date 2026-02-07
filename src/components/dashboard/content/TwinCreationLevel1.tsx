import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import {
  Copy,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Layers,
  Wifi,
  Radio,
  Camera,
  Server,
  Network,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TwinCreationLevel1() {
  const { state, createTwins, toggleDeviceForTwinning, selectAllForTwinning } = useDashboard();
  const { twins, devices, twinCreationComplete, selectedForTwinning } = state;

  const modelTypes = twins.reduce((acc, twin) => {
    acc[twin.modelType] = (acc[twin.modelType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
        <h3 className="text-lg font-semibold text-foreground mb-1">Digital Twin Creation</h3>
        <p className="text-sm text-muted-foreground">Build and manage digital representations of physical assets</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Copy className="w-4 h-4 text-twin" />
            <span className="text-xs text-muted-foreground uppercase font-medium">Active Digital Twins</span>
          </div>
          <span className="text-3xl font-bold text-twin">{twins.length}</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            {twinCreationComplete ? (
              <CheckCircle2 className="w-4 h-4 text-success" />
            ) : (
              <Clock className="w-4 h-4 text-warning" />
            )}
            <span className="text-xs text-muted-foreground uppercase font-medium">Twin Status</span>
          </div>
          <span className={cn(
            'text-lg font-bold',
            twinCreationComplete ? 'text-success' : 'text-warning'
          )}>
            {twinCreationComplete ? 'All Active' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Device Selection for Twinning */}
      {!twinCreationComplete && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Select Devices for Twinning
            </h4>
            <button
              onClick={selectAllForTwinning}
              className="text-[10px] text-primary hover:underline font-medium"
            >
              {selectedForTwinning.length === devices.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="space-y-2">
            {devices.map(device => {
              const Icon = getDeviceIcon(device.deviceType);
              const isSelected = selectedForTwinning.includes(device.id);
              return (
                <button
                  key={device.id}
                  onClick={() => toggleDeviceForTwinning(device.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                    isSelected
                      ? "bg-primary/10 border-primary/30"
                      : "bg-muted/30 border-border/50 hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "bg-primary border-primary" : "border-muted-foreground/40"
                  )}>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                    )}
                  </div>
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-foreground font-medium block">{device.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{device.ipAddress}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <Button
              onClick={createTwins}
              disabled={selectedForTwinning.length === 0}
              className="w-full gap-2"
            >
              <Copy className="w-4 h-4" />
              Create Digital Twins ({selectedForTwinning.length})
            </Button>
          </div>
        </div>
      )}

      {/* Model Types */}
      {twinCreationComplete && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Model Types
          </h4>
          <div className="space-y-2">
            {Object.entries(modelTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-twin" />
                  <span className="text-sm text-foreground capitalize">{type.replace('-', ' ')}</span>
                </div>
                <span className="text-sm font-bold text-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Sources */}
      {twinCreationComplete && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Data Sources Assigned
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
              <Database className="w-5 h-5 text-primary mx-auto mb-2" />
              <span className="text-xs text-muted-foreground block">Sensor Streams</span>
              <span className="text-lg font-bold text-foreground">{twins.length * 3}</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
              <Layers className="w-5 h-5 text-primary mx-auto mb-2" />
              <span className="text-xs text-muted-foreground block">Model Versions</span>
              <span className="text-lg font-bold text-foreground">{twins.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Instruction */}
      <div className="text-center pt-4 border-t border-border/50">
        <p className="text-sm text-twin font-medium">
          {twinCreationComplete ? 'Select a Digital twin' : 'Select devices to create twins'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {twinCreationComplete
            ? 'Click a twin on the network graph to view configuration'
            : 'System will auto-advance after twin creation'
          }
        </p>
      </div>
    </div>
  );
}
