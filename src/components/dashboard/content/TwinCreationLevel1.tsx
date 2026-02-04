import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import {
  Copy,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Layers,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TwinCreationLevel1() {
  const { state, createTwins } = useDashboard();
  const { twins, devices, twinCreationComplete } = state;

  const modelTypes = twins.reduce((acc, twin) => {
    acc[twin.modelType] = (acc[twin.modelType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Digital  Twin Creation</h3>
        <p className="text-sm text-muted-foreground">Build and manage Digital  representations of physical assets</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Copy className="w-4 h-4 text-twin" />
            <span className="text-xs text-muted-foreground uppercase font-medium">Active Digital  Twins</span>
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

      {/* Creation Progress */}
      {!twinCreationComplete && (
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-2">
                Digital  twins have not been created yet
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                {devices.length} physical devices detected and ready for twin creation
              </p>
              <Button
                onClick={createTwins}
                size="sm"
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Create Digital  Twin Network
              </Button>
            </div>
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
              <div
                key={type}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
              >
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
          {twinCreationComplete ? 'Select a Digital  twin' : 'Create twins to continue'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {twinCreationComplete
            ? 'Click a twin on the network graph to view configuration'
            : 'Digital  twins must be created before synchronization'
          }
        </p>
      </div>
    </div>
  );
}
