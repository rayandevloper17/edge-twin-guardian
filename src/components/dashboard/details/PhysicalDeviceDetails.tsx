import { PhysicalDevice } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { 
  Cpu, 
  MapPin, 
  Building, 
  Wifi, 
  Globe, 
  Clock,
  Activity,
  Gauge
} from 'lucide-react';

interface Props {
  device: PhysicalDevice;
}

export default function PhysicalDeviceDetails({ device }: Props) {
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
          <h4 className="font-semibold text-foreground">{device.name}</h4>
          <StatusBadge status={device.status} />
        </div>
        <p className="text-xs text-muted-foreground font-mono">{device.id}</p>
      </div>

      {/* Device Info */}
      <Section title="Device Information">
        <InfoRow icon={Cpu} label="Type" value={device.type} />
        <InfoRow label="Manufacturer" value={device.manufacturer} />
        <InfoRow label="Model" value={device.model} />
        <InfoRow label="Firmware" value={device.firmwareVersion} />
        <InfoRow label="OS Version" value={device.osVersion} />
      </Section>

      {/* Deployment */}
      <Section title="Deployment">
        <InfoRow icon={MapPin} label="Location" value={device.location} />
        <InfoRow icon={Building} label="Owner" value={device.owner} />
      </Section>

      {/* Network */}
      <Section title="Network Configuration">
        <InfoRow icon={Wifi} label="Network Type" value={device.networkType} />
        <InfoRow icon={Globe} label="IP Address" value={device.ipAddress} mono />
        <InfoRow label="MAC Address" value={device.macAddress} mono />
      </Section>

      {/* Status */}
      <Section title="Status & Health">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Gauge className="w-3 h-3" />
              <span>Signal Strength</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    'h-full rounded-full transition-all',
                    device.signalStrength > 80 ? 'bg-success' :
                    device.signalStrength > 50 ? 'bg-warning' : 'bg-destructive'
                  )}
                  style={{ width: `${device.signalStrength}%` }}
                />
              </div>
              <span className="text-xs font-mono text-foreground">{device.signalStrength}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="w-3 h-3" />
              <span>Latency</span>
            </div>
            <span className={cn(
              'text-xs font-mono',
              device.latency < 20 ? 'text-success' :
              device.latency < 50 ? 'text-warning' : 'text-destructive'
            )}>
              {device.latency}ms
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Last Heartbeat</span>
            </div>
            <span className="text-xs font-mono text-foreground">
              {formatDate(device.lastHeartbeat)}
            </span>
          </div>
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
  mono 
}: { 
  icon?: React.ElementType; 
  label: string; 
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {Icon && <Icon className="w-3 h-3" />}
        <span>{label}</span>
      </div>
      <span className={cn(
        'text-xs text-foreground',
        mono && 'font-mono'
      )}>
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: PhysicalDevice['status'] }) {
  return (
    <span className={cn(
      'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
      status === 'benign' && 'status-online',
      status === 'suspicious' && 'status-warning',
      status === 'compromised' && 'status-attack'
    )}>
      {status === 'benign' ? 'Benign' : status === 'compromised' ? 'Compromised' : 'Suspicious'}
    </span>
  );
}
