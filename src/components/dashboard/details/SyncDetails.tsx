import { PhysicalDevice, DigitalTwin } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import {
  ArrowLeftRight,
  Clock,
  AlertTriangle,
  Shield,
  Activity,
  Zap
} from 'lucide-react';

interface Props {
  device: PhysicalDevice;
  twin: DigitalTwin;
}

export default function SyncDetails({ device, twin }: Props) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const isAnomaly = twin.driftIndicator > 30;
  const isThreat = twin.status === 'compromised';

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-foreground">Sync Status</h4>
          <StatusBadge synced={!isAnomaly && !isThreat} />
        </div>
        <p className="text-xs text-muted-foreground">
          {device.name} ↔ Digital  Twin
        </p>
      </div>

      {/* Alert Banner */}
      {isThreat && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Active Threat Detected</span>
          </div>
          <p className="text-xs text-destructive/80">
            Anomalous behavior pattern identified. Automated response initiated.
          </p>
        </div>
      )}

      {/* Sync Metrics */}
      <Section title="Synchronization Metrics">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Sync Latency"
            value={`${twin.syncLatency}ms`}
            status={twin.syncLatency < 50 ? 'good' : twin.syncLatency < 100 ? 'warning' : 'bad'}
          />
          <MetricCard
            label="Drift"
            value={`${twin.driftIndicator.toFixed(1)}%`}
            status={twin.driftIndicator < 20 ? 'good' : twin.driftIndicator < 50 ? 'warning' : 'bad'}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Last Sync</span>
          </div>
          <span className="text-xs font-mono text-foreground">
            {formatDate(twin.lastSyncTime)}
          </span>
        </div>
      </Section>

      {/* Value Comparison */}
      <Section title="Physical vs Digital Values">
        <div className="space-y-4">
          <ComparisonRow
            label="CPU Usage"
            physical={`${Math.floor(twin.currentValues.cpuUsage * 0.9)}%`}
            Lovable={`${twin.currentValues.cpuUsage}%`}
            drift={twin.driftIndicator > 30}
          />
          <ComparisonRow
            label="Memory"
            physical={`${Math.floor(twin.currentValues.memoryUsage * 0.95)}%`}
            Lovable={`${twin.currentValues.memoryUsage}%`}
            drift={false}
          />
          <ComparisonRow
            label="Network I/O"
            physical={`${Math.floor(twin.currentValues.networkTraffic * 0.92)} KB/s`}
            Lovable={`${twin.currentValues.networkTraffic} KB/s`}
            drift={isThreat}
          />
          <ComparisonRow
            label="Temperature"
            physical={`${twin.currentValues.temperature - 1}°C`}
            Lovable={`${twin.currentValues.temperature}°C`}
            drift={false}
          />
        </div>
      </Section>

      {/* Anomaly Detection */}
      <Section title="Anomaly Detection">
        <div className="space-y-3">
          {isThreat ? (
            <>
              <AnomalyItem
                type="DDoS Attack"
                confidence={92}
                severity="critical"
              />
              <AnomalyItem
                type="Traffic Spike"
                confidence={88}
                severity="high"
              />
            </>
          ) : isAnomaly ? (
            <AnomalyItem
              type="Behavior Deviation"
              confidence={65}
              severity="medium"
            />
          ) : (
            <div className="flex items-center gap-2 text-success text-xs">
              <Shield className="w-4 h-4" />
              <span>No anomalies detected</span>
            </div>
          )}
        </div>
      </Section>

      {/* Response Actions */}
      {(isThreat || isAnomaly) && (
        <Section title="Automated Response">
          <div className="space-y-2">
            {isThreat && (
              <>
                <ActionItem action="Traffic isolated to quarantine VLAN" status="completed" />
                <ActionItem action="Backup systems activated" status="completed" />
                <ActionItem action="SOC notification sent" status="completed" />
              </>
            )}
            {isAnomaly && !isThreat && (
              <ActionItem action="Enhanced monitoring enabled" status="active" />
            )}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </h5>
      {children}
    </div>
  );
}

function StatusBadge({ synced }: { synced: boolean }) {
  return (
    <span className={cn(
      'px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1',
      synced ? 'status-online' : 'status-attack'
    )}>
      <ArrowLeftRight className="w-3 h-3" />
      {synced ? 'In Sync' : 'Drift Detected'}
    </span>
  );
}

function MetricCard({
  label,
  value,
  status
}: {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'bad'
}) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 border border-border">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={cn(
        'text-lg font-mono font-semibold',
        status === 'good' ? 'text-success' :
          status === 'warning' ? 'text-warning' : 'text-destructive'
      )}>
        {value}
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  physical,
  Lovable,
  drift
}: {
  label: string;
  physical: string;
  Lovable: string;
  drift: boolean;
}) {
  return (
    <div className={cn(
      'p-2 rounded-lg',
      drift && 'bg-destructive/5 border border-destructive/20'
    )}>
      <div className="text-xs text-muted-foreground mb-2">{label}</div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 text-center">
          <div className="text-[10px] text-physical uppercase tracking-wider mb-1">Physical</div>
          <div className="text-sm font-mono text-foreground">{physical}</div>
        </div>
        <ArrowLeftRight className={cn(
          'w-4 h-4',
          drift ? 'text-destructive' : 'text-muted-foreground'
        )} />
        <div className="flex-1 text-center">
          <div className="text-[10px] text-twin uppercase tracking-wider mb-1">Digital</div>
          <div className="text-sm font-mono text-foreground">{Lovable}</div>
        </div>
      </div>
    </div>
  );
}

function AnomalyItem({
  type,
  confidence,
  severity
}: {
  type: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}) {
  return (
    <div className={cn(
      'p-2 rounded-lg border',
      severity === 'critical' ? 'bg-destructive/10 border-destructive/30' :
        severity === 'high' ? 'bg-destructive/5 border-destructive/20' :
          severity === 'medium' ? 'bg-warning/10 border-warning/30' :
            'bg-muted border-border'
    )}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{type}</span>
        <span className={cn(
          'text-[10px] px-1.5 py-0.5 rounded uppercase font-medium',
          severity === 'critical' ? 'bg-destructive text-destructive-foreground' :
            severity === 'high' ? 'bg-destructive/80 text-destructive-foreground' :
              severity === 'medium' ? 'bg-warning text-warning-foreground' :
                'bg-muted text-muted-foreground'
        )}>
          {severity}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full',
              severity === 'critical' || severity === 'high' ? 'bg-destructive' :
                severity === 'medium' ? 'bg-warning' : 'bg-muted-foreground'
            )}
            style={{ width: `${confidence}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {confidence}%
        </span>
      </div>
    </div>
  );
}

function ActionItem({
  action,
  status
}: {
  action: string;
  status: 'completed' | 'active' | 'pending';
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Zap className={cn(
        'w-3 h-3',
        status === 'completed' ? 'text-success' :
          status === 'active' ? 'text-warning' : 'text-muted-foreground'
      )} />
      <span className="text-foreground">{action}</span>
      <span className={cn(
        'ml-auto text-[10px] px-1.5 py-0.5 rounded',
        status === 'completed' ? 'bg-success/20 text-success' :
          status === 'active' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
      )}>
        {status}
      </span>
    </div>
  );
}
