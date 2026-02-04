import { DigitalTwin, PhysicalDevice } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import {
  RefreshCw,
  Clock,
  Activity,
  AlertTriangle,
  Shield,
  Ban,
  Bell,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  twin: DigitalTwin;
  device: PhysicalDevice;
}

export default function SyncLevel2({ twin, device }: Props) {

  const isUnderAttack = device.status === 'attack' || twin.status === 'attack';
  const hasDrift = twin.driftIndicator > 30;

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-foreground text-lg">Live Monitoring</h4>
          <p className="text-xs text-muted-foreground mt-1">{device.name} ↔ DT-{device.name.split(' ')[0]}</p>
        </div>
        <StatusBadge isAttack={isUnderAttack} hasDrift={hasDrift} />
      </div>

      {/* Data Alignment */}
      <Section title="Data Alignment" icon={ArrowUpDown}>
        <div className="space-y-3">
          <AlignmentRow
            label="CPU Usage"
            physical={`${Math.round(twin.currentValues.cpuUsage * 0.95)}%`}
            Lovable={`${twin.currentValues.cpuUsage}%`}
            diff={twin.currentValues.cpuUsage * 0.05}
          />
          <AlignmentRow
            label="Memory Usage"
            physical={`${Math.round(twin.currentValues.memoryUsage * 0.98)}%`}
            Lovable={`${twin.currentValues.memoryUsage}%`}
            diff={twin.currentValues.memoryUsage * 0.02}
          />
          <AlignmentRow
            label="Network Traffic"
            physical={`${Math.round(twin.currentValues.networkTraffic * 1.02)} KB/s`}
            Lovable={`${twin.currentValues.networkTraffic} KB/s`}
            diff={twin.currentValues.networkTraffic * 0.02}
          />
          <AlignmentRow
            label="Temperature"
            physical={`${Math.round(twin.currentValues.temperature + 0.5)}°C`}
            Lovable={`${twin.currentValues.temperature}°C`}
            diff={0.5}
          />
        </div>

        <div className="mt-3 flex items-center justify-between p-2 rounded bg-muted/30">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Timestamp Difference</span>
          </div>
          <span className={cn(
            'text-xs font-mono',
            twin.syncLatency < 30 ? 'text-success' :
              twin.syncLatency < 60 ? 'text-warning' : 'text-destructive'
          )}>
            {twin.syncLatency}ms
          </span>
        </div>
      </Section>

      {/* Anomaly Detection */}
      <Section title="Anomaly Detection" icon={Activity}>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
            <span className="text-xs text-muted-foreground">Behavioral Deviation</span>
            <span className={cn(
              'text-xs font-medium',
              twin.driftIndicator < 30 ? 'text-success' :
                twin.driftIndicator < 60 ? 'text-warning' : 'text-destructive'
            )}>
              {twin.driftIndicator < 30 ? 'None Detected' : `${twin.driftIndicator.toFixed(1)}% Drift`}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
            <span className="text-xs text-muted-foreground">Threat Likelihood</span>
            <span className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase',
              isUnderAttack ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'
            )}>
              {isUnderAttack ? 'High' : 'Low'}
            </span>
          </div>
        </div>
      </Section>

      {/* Security Monitoring */}
      <Section title="Security Monitoring" icon={Shield}>
        <div className={cn(
          'p-4 rounded-xl border',
          isUnderAttack
            ? 'bg-destructive/10 border-destructive/30'
            : 'bg-muted/20 border-border/50'
        )}>
          {isUnderAttack ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="text-sm font-semibold text-destructive">Threat Detected</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Suspicious traffic patterns detected. Potential intrusion attempt identified.
              </p>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pattern:</span>
                  <span className="text-destructive font-mono">DDoS / Port Scan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="text-destructive font-mono">87%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-success" />
              <div>
                <span className="text-sm font-medium text-foreground block">No Active Threats</span>
                <span className="text-xs text-muted-foreground">All security checks passed</span>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Controls */}
      <Section title="Controls" icon={RefreshCw}>
        <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" size="sm" className="gap-2 justify-start">
            <RefreshCw className="w-4 h-4" />
            Trigger Re-synchronization
          </Button>
          <Button
            variant={isUnderAttack ? "destructive" : "outline"}
            size="sm"
            className="gap-2 justify-start"
          >
            <Ban className="w-4 h-4" />
            Isolate Device
          </Button>
          <Button variant="outline" size="sm" className="gap-2 justify-start">
            <Bell className="w-4 h-4" />
            Escalate Alert
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
        <Icon className="w-4 h-4 text-sync" />
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h5>
      </div>
      <div className="space-y-1 pl-6">{children}</div>
    </div>
  );
}

function AlignmentRow({
  label,
  physical,
  Lovable,
  diff
}: {
  label: string;
  physical: string;
  Lovable: string;
  diff: number;
}) {
  const isAligned = diff < 5;

  return (
    <div className="grid grid-cols-3 gap-2 p-2 rounded bg-muted/30 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="text-center">
        <span className="text-[10px] text-muted-foreground block">Physical</span>
        <span className="font-mono text-foreground">{physical}</span>
      </div>
      <div className="text-center">
        <span className="text-[10px] text-muted-foreground block">Digital </span>
        <span className={cn(
          'font-mono',
          isAligned ? 'text-success' : 'text-warning'
        )}>{Lovable}</span>
      </div>
    </div>
  );
}

function StatusBadge({ isAttack, hasDrift }: { isAttack: boolean; hasDrift: boolean }) {
  if (isAttack) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-destructive/20 text-destructive animate-pulse">
        Under Attack
      </span>
    );
  }
  if (hasDrift) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-warning/20 text-warning">
        Drift Detected
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-success/20 text-success">
      Synchronized
    </span>
  );
}
