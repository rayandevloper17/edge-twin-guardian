import { DigitalTwin, PhysicalDevice } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import {
  Link2,
  TrendingUp,
  Settings,
  Play,
  RefreshCw,
  Power
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  twin: DigitalTwin;
  device: PhysicalDevice;
}

export default function TwinCreationLevel2({ twin, device }: Props) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-foreground text-lg">Digital  Twin</h4>
          <p className="text-xs text-muted-foreground font-mono mt-1">{twin.id}</p>
        </div>
        <StatusBadge status={twin.status} />
      </div>

      {/* Twin Mapping */}
      <Section title="Twin Mapping" icon={Link2}>
        <InfoRow label="Linked Physical Device" value={device.name} />
        <InfoRow label="Physical Device ID" value={device.id} mono />
        <div className="mt-2 p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Assigned Sensors & Data Streams</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {twin.contextInputs.map((input, i) => (
              <span key={i} className="px-2 py-1 text-[10px] bg-primary/10 text-primary rounded-full">
                {input}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Model Settings */}
      <Section title="Model Settings" icon={Settings}>
        <InfoRow label="Model Type" value={twin.modelType} capitalize />
        <InfoRow label="Model Version" value={twin.modelVersion} mono />
        <InfoRow label="Last Synchronization" value={formatDate(twin.lastSyncTime)} />

        <div className="mt-3">
          <p className="text-xs text-muted-foreground mb-2">State Variables</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded bg-muted/30 text-center">
              <span className="text-[10px] text-muted-foreground block">CPU</span>
              <span className="text-sm font-mono text-foreground">{twin.currentValues.cpuUsage}%</span>
            </div>
            <div className="p-2 rounded bg-muted/30 text-center">
              <span className="text-[10px] text-muted-foreground block">Memory</span>
              <span className="text-sm font-mono text-foreground">{twin.currentValues.memoryUsage}%</span>
            </div>
            <div className="p-2 rounded bg-muted/30 text-center">
              <span className="text-[10px] text-muted-foreground block">Network</span>
              <span className="text-sm font-mono text-foreground">{twin.currentValues.networkTraffic}KB/s</span>
            </div>
            <div className="p-2 rounded bg-muted/30 text-center">
              <span className="text-[10px] text-muted-foreground block">Temp</span>
              <span className="text-sm font-mono text-foreground">{twin.currentValues.temperature}°C</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Model Parameters */}
      <Section title="Baseline Configuration" icon={TrendingUp}>
        <div className="space-y-3">
          <BaselineRow
            label="Avg Response Time"
            value={`${twin.historicalBaseline.avgResponseTime}ms`}
          />
          <BaselineRow
            label="Avg Packet Loss"
            value={`${twin.historicalBaseline.avgPacketLoss.toFixed(2)}%`}
          />
          <BaselineRow
            label="Avg Uptime"
            value={`${twin.historicalBaseline.avgUptime.toFixed(2)}%`}
          />
        </div>
      </Section>

      {/* Simulation */}
      <Section title="Simulation" icon={Play}>
        <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">Simulation Enabled</span>
            <span className="text-xs font-medium text-success">✓ Available</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Scenario Testing</span>
            <span className="text-xs font-medium text-success">✓ Available</span>
          </div>
        </div>
      </Section>

      {/* Lifecycle Actions */}
      <Section title="Lifecycle Actions" icon={RefreshCw}>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="text-xs h-9">
            <Settings className="w-3 h-3 mr-1" />
            Update
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-9">
            <RefreshCw className="w-3 h-3 mr-1" />
            Re-sync
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-9 text-destructive hover:text-destructive">
            <Power className="w-3 h-3 mr-1" />
            Deactivate
          </Button>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-twin" />
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h5>
      </div>
      <div className="space-y-1 pl-6">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
  capitalize
}: {
  label: string;
  value: string;
  mono?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn(
        'text-xs text-foreground text-right max-w-[50%] truncate',
        mono && 'font-mono',
        capitalize && 'capitalize'
      )}>
        {value}
      </span>
    </div>
  );
}

function BaselineRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-muted/30">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-mono text-foreground">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: DigitalTwin['status'] }) {
  return (
    <span className={cn(
      'px-3 py-1 rounded-full text-xs font-semibold uppercase',
      status === 'benign' && 'bg-success/20 text-success',
      status === 'compromised' && 'bg-destructive/20 text-destructive animate-pulse',
      status === 'suspicious' && 'bg-warning/20 text-warning'
    )}>
      {status === 'benign' ? 'Benign' : status === 'compromised' ? 'Compromised' : 'Suspicious'}
    </span>
  );
}
