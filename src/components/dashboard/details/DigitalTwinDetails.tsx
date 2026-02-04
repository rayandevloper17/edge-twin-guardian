import { DigitalTwin, PhysicalDevice } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import {
  Link2,
  Cpu,
  Clock,
  Database,
  TrendingUp,
  Layers
} from 'lucide-react';

interface Props {
  twin: DigitalTwin;
  device: PhysicalDevice;
}

export default function DigitalTwinDetails({ twin, device }: Props) {
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
      <div>
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-foreground">Digital  Twin</h4>
          <StatusBadge status={twin.status} />
        </div>
        <p className="text-xs text-muted-foreground font-mono">{twin.id}</p>
      </div>

      {/* Twin Identification */}
      <Section title="Twin Identification">
        <InfoRow icon={Link2} label="Physical Device" value={device.name} />
        <InfoRow icon={Cpu} label="Model Type" value={twin.modelType} capitalize />
        <InfoRow icon={Layers} label="Model Version" value={twin.modelVersion} mono />
        <InfoRow icon={Clock} label="Last Sync" value={formatDate(twin.lastSyncTime)} />
      </Section>

      {/* Historical Baselines */}
      <Section title="Historical Baselines">
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

      {/* Normal Behavior Profile */}
      <Section title="Normal Behavior Profile">
        <div className="space-y-3">
          <BehaviorRange
            label="CPU Usage"
            min={twin.normalBehaviorProfile.cpuUsage.min}
            max={twin.normalBehaviorProfile.cpuUsage.max}
            current={twin.currentValues.cpuUsage}
            unit="%"
          />
          <BehaviorRange
            label="Memory Usage"
            min={twin.normalBehaviorProfile.memoryUsage.min}
            max={twin.normalBehaviorProfile.memoryUsage.max}
            current={twin.currentValues.memoryUsage}
            unit="%"
          />
          <BehaviorRange
            label="Network Traffic"
            min={twin.normalBehaviorProfile.networkTraffic.min}
            max={twin.normalBehaviorProfile.networkTraffic.max}
            current={twin.currentValues.networkTraffic}
            unit=" KB/s"
          />
          <BehaviorRange
            label="Temperature"
            min={twin.normalBehaviorProfile.temperature.min}
            max={twin.normalBehaviorProfile.temperature.max}
            current={twin.currentValues.temperature}
            unit="°C"
          />
        </div>
      </Section>

      {/* Context Inputs */}
      <Section title="Context Inputs">
        <div className="space-y-1">
          {twin.contextInputs.map((input, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Database className="w-3 h-3" />
              <span>{input}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </h5>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
  capitalize
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {Icon && <Icon className="w-3 h-3" />}
        <span>{label}</span>
      </div>
      <span className={cn(
        'text-xs text-foreground',
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
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-mono text-foreground">{value}</span>
    </div>
  );
}

function BehaviorRange({
  label,
  min,
  max,
  current,
  unit
}: {
  label: string;
  min: number;
  max: number;
  current: number;
  unit: string;
}) {
  const isInRange = current >= min && current <= max;
  const percentage = Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn(
          'text-xs font-mono',
          isInRange ? 'text-success' : 'text-destructive'
        )}>
          {current}{unit}
        </span>
      </div>
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        {/* Normal range indicator */}
        <div
          className="absolute h-full bg-success/20"
          style={{
            left: '0%',
            width: '100%'
          }}
        />
        {/* Current value indicator */}
        <div
          className={cn(
            'absolute h-full rounded-full transition-all',
            isInRange ? 'bg-success' : 'bg-destructive'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: DigitalTwin['status'] }) {
  return (
    <span className={cn(
      'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
      status === 'online' && 'status-online',
      status === 'offline' && 'status-offline',
      status === 'attack' && 'status-attack',
      status === 'warning' && 'status-warning'
    )}>
      {status}
    </span>
  );
}
